#!/usr/bin/env python3
import argparse
import json
import os

import fiona
from fiona.transform import transform_geom


def list_layers(gdb_path):
    with fiona.Env():
        return fiona.listlayers(gdb_path)


def export_layer(gdb_path, layer_name, output_path, target_crs='EPSG:4326'):
    with fiona.Env():
        with fiona.open(gdb_path, layer=layer_name) as src:
            schema = src.schema.copy()
            crs = src.crs
            features = []
            for feature in src:
                geom = transform_geom(crs, target_crs, feature['geometry'])
                if hasattr(geom, '__geo_interface__'):
                    geom = geom.__geo_interface__
                features.append({
                    'type': 'Feature',
                    'id': feature.get('id'),
                    'properties': dict(feature['properties']),
                    'geometry': geom,
                })

            output = {
                'type': 'FeatureCollection',
                'features': features,
                'crs': {
                    'type': 'name',
                    'properties': {'name': target_crs}
                }
            }

    with open(output_path, 'w', encoding='utf-8') as fp:
        json.dump(output, fp, indent=2)

    print(f'Exported {len(features)} features from {layer_name} to {output_path}')


def main():
    parser = argparse.ArgumentParser(description='Export Esri FileGDB layer to GeoJSON')
    parser.add_argument('gdb_path', help='Path to the .gdb folder')
    parser.add_argument('--layer', default='STR_STRUCT', help='Layer name to export')
    parser.add_argument('--output', default='../data/bridges.geojson', help='Output GeoJSON path')
    parser.add_argument('--crs', default='EPSG:4326', help='Target CRS for GeoJSON')
    args = parser.parse_args()

    gdb_path = os.path.expanduser(args.gdb_path)
    if not os.path.isdir(gdb_path):
        raise FileNotFoundError(f'FileGDB folder not found: {gdb_path}')

    layers = list_layers(gdb_path)
    print('Available layers:', layers)
    if args.layer not in layers:
        raise ValueError(f'Layer {args.layer} not found in {gdb_path}')

    output_path = os.path.abspath(os.path.join(os.path.dirname(__file__), args.output))
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    export_layer(gdb_path, args.layer, output_path, args.crs)


if __name__ == '__main__':
    main()
