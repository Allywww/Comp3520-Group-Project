# IFC Hybrid Routing Prototype

A simple hybrid routing prototype for the IFC - Central Station - Exchange Square area.

## What this includes

- Graph-based route model stored in `data/graph.json`
- A* routing engine with two optimization modes: `distance` and `time`
- Floor toggle controls for multi-level routing
- Route confidence, covered/exposed weather indicator, and basic crowdedness hints
- Simple 2D SVG map visualization

## How to run

1. Open a terminal in `ifc-routing`
2. Install the Python dependency:
   ```bash
   python3 -m pip install -r requirements.txt
   ```
3. (Optional) Export bridge data from the local GDB:
   ```bash
   python3 scripts/extract_str_struct.py ~/Downloads/STR_STRUCT_CSDI.gdb
   ```
4. Convert exported bridge geometries into a route graph:
   ```bash
   python3 scripts/convert_bridges_to_graph.py --input ../data/bridges.geojson --output ../data/bridge_graph.json
   ```
5. Run a local web server:
   ```bash
   python3 -m http.server 8000
   ```
6. Open `http://127.0.0.1:8000` in your browser

7. In the browser, click **Use my current location** and then select either start or destination. The current location option is now available for both origin and destination in the selectors.

## Project structure

- `index.html` — web UI shell
- `styles.css` — styling
- `app.js` — graph loader, A* engine, routing UI, map rendering
- `data/graph.json` — sample location graph data
- `data/bridge_graph.json` — optionally loaded bridge route graph for IFC connectivity; the UI filters this dataset to the local Central/IFC bounding box to avoid drawing unrelated Hong Kong bridges.

## Notes

- The graph format is intentionally simple so it can be edited by hand.
- The routing engine is designed for rapid prototyping rather than production-scale GIS.
- Weather and crowd guidance are based on manual path tags and static heuristics.
