#!/usr/bin/env python3
"""Download IFC mall floorplan tiles from the rendered tile layer."""

import argparse
import os
import ssl
import urllib.request
from urllib.error import HTTPError, URLError

FLOORS = ["L-1", "L-2", "L-3", "L-4"]
ZOOM = 15
TILE_X = [16383, 16384]
TILE_Y = [16382, 16383, 16384, 16385]
OUTPUT_ROOT = os.path.join(os.path.dirname(__file__), "..", "data", "floorplan")
BASE_URL = "https://ifc.com.hk/assets/www/maptiles"


def make_directory(path):
    os.makedirs(path, exist_ok=True)


def download_tile(url, path, context):
    try:
        with urllib.request.urlopen(url, context=context) as resp:
            data = resp.read()
            with open(path, "wb") as fd:
                fd.write(data)
        print(f"Downloaded: {url}")
        return True
    except HTTPError as exc:
        print(f"HTTP error {exc.code} for {url}")
    except URLError as exc:
        print(f"URL error {exc.reason} for {url}")
    except Exception as exc:
        print(f"Failed to download {url}: {exc}")
    return False


def main():
    parser = argparse.ArgumentParser(description='Download IFC mall floorplan tiles from the rendered tile layer.')
    parser.add_argument('--insecure', action='store_true', help='Disable SSL certificate verification for tile downloads')
    args = parser.parse_args()

    if args.insecure:
        context = ssl._create_unverified_context()
        print('Warning: running in insecure mode; SSL certificate validation is disabled.')
    else:
        context = ssl.create_default_context()

    print('Downloading IFC floorplan tiles...')
    for floor in FLOORS:
        for x in TILE_X:
            for y in TILE_Y:
                rel_dir = os.path.join(OUTPUT_ROOT, floor, str(ZOOM), str(x))
                make_directory(rel_dir)
                filename = os.path.join(rel_dir, f"{y}.jpg")
                if os.path.exists(filename) and os.path.getsize(filename) > 1024:
                    print(f"Skipping existing tile: {filename}")
                    continue
                url = f"{BASE_URL}/{floor}/{ZOOM}/{x}/{y}.jpg"
                download_tile(url, filename, context)

    print('Done. Floorplan tiles are saved under data/floorplan.')


if __name__ == "__main__":
    main()
