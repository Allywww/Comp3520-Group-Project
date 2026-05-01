#!/usr/bin/env python3
import argparse
import json
import math
import os
import re


def sanitize_id(value):
    value = str(value or '').strip()
    value = re.sub(r'[^A-Za-z0-9_]+', '_', value)
    value = re.sub(r'__+', '_', value)
    return value.strip('_') or 'bridge'


def polygon_centroid(coords):
    # coords: list of [lon, lat] for a single ring
    area = 0.0
    cx = 0.0
    cy = 0.0
    n = len(coords)
    if n < 3:
        return coords[0] if coords else (0.0, 0.0)

    for i in range(n - 1):
        x0, y0 = coords[i]
        x1, y1 = coords[i + 1]
        cross = x0 * y1 - x1 * y0
        area += cross
        cx += (x0 + x1) * cross
        cy += (y0 + y1) * cross

    if abs(area) < 1e-12:
        return tuple(coords[0])

    area *= 0.5
    cx /= (6.0 * area)
    cy /= (6.0 * area)
    return cx, cy


def multipolygon_centroid(geometry):
    total_area = 0.0
    weighted_x = 0.0
    weighted_y = 0.0

    if geometry['type'] == 'Polygon':
        rings = geometry['coordinates']
        centroid = polygon_centroid(rings[0])
        return centroid

    if geometry['type'] != 'MultiPolygon':
        raise ValueError(f'Unsupported geometry type: {geometry["type"]}')

    for polygon in geometry['coordinates']:
        if not polygon or not polygon[0]:
            continue
        outer_ring = polygon[0]
        cx, cy = polygon_centroid(outer_ring)
        # approximate area using shoelace on the outer ring
        area = abs(sum(outer_ring[i][0] * outer_ring[i + 1][1] - outer_ring[i + 1][0] * outer_ring[i][1]
                       for i in range(len(outer_ring) - 1)) * 0.5)
        total_area += area
        weighted_x += cx * area
        weighted_y += cy * area

    if total_area < 1e-12:
        for polygon in geometry['coordinates']:
            if polygon and polygon[0]:
                return tuple(polygon[0][0])
        return 0.0, 0.0

    return weighted_x / total_area, weighted_y / total_area


def haversine_meters(coord1, coord2):
    lon1, lat1 = coord1
    lon2, lat2 = coord2
    r = 6371000.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return r * c


def build_nodes(features):
    nodes = []
    existing_ids = set()
    for idx, feature in enumerate(features, start=1):
        props = feature.get('properties', {})
        base_id = sanitize_id(props.get('STR_NO') or f'bridge_{idx}')
        node_id = base_id
        suffix = 1
        while node_id in existing_ids:
            node_id = f'{base_id}_{suffix}'
            suffix += 1

        centroid = multipolygon_centroid(feature['geometry'])
        label = f'Bridge {props.get("STR_NO", idx)}'

        node = {
            'id': node_id,
            'label': label,
            'shortLabel': node_id,
            'lon': centroid[0],
            'lat': centroid[1],
            'properties': {
                'STR_NO': props.get('STR_NO'),
                'Shape_Length': props.get('Shape_Length'),
                'Shape_Area': props.get('Shape_Area'),
            },
            'type': 'bridge',
        }
        nodes.append(node)
        existing_ids.add(node_id)
    return nodes


def build_edges(nodes, max_distance=80.0):
    edges = []
    for i, source in enumerate(nodes):
        for j in range(i + 1, len(nodes)):
            target = nodes[j]
            distance = haversine_meters((source['lon'], source['lat']), (target['lon'], target['lat']))
            if distance <= max_distance:
                edges.append({
                    'id': f'edge_{source["id"]}_{target["id"]}',
                    'from': source['id'],
                    'to': target['id'],
                    'label': 'Bridge adjacency',
                    'description': 'Nearby bridge connectivity inferred from spatial proximity.',
                    'distance': round(distance, 1),
                    'estimatedTime': round(distance / 1.4, 1),
                    'covered': True,
                    'confidence': 'low',
                    'crowded': False,
                    'type': 'bridge_link',
                })
    return edges


def main():
    parser = argparse.ArgumentParser(description='Convert bridge GeoJSON into a route graph format.')
    parser.add_argument('--input', default='../data/bridges.geojson', help='Path to the bridge GeoJSON file')
    parser.add_argument('--output', default='../data/bridge_graph.json', help='Path to write the generated route graph JSON')
    parser.add_argument('--threshold', type=float, default=80.0, help='Maximum adjacency distance in meters')
    args = parser.parse_args()

    input_path = os.path.abspath(os.path.join(os.path.dirname(__file__), args.input))
    output_path = os.path.abspath(os.path.join(os.path.dirname(__file__), args.output))

    with open(input_path, 'r', encoding='utf-8') as fp:
        geojson = json.load(fp)

    features = geojson.get('features', [])
    nodes = build_nodes(features)
    edges = build_edges(nodes, max_distance=args.threshold)

    graph = {
        'source': 'STR_STRUCT',
        'description': 'Bridge graph generated from STR_STRUCT bridge polygons.',
        'nodes': nodes,
        'edges': edges,
    }

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as fp:
        json.dump(graph, fp, indent=2)

    print(f'Generated {len(nodes)} nodes and {len(edges)} edges in {output_path}')


if __name__ == '__main__':
    main()
