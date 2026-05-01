const GRAPH_URL = 'data/graph.json';
const BRIDGE_GRAPH_URL = 'data/bridge_graph.json';
const SEARCH_INDEX_URL = 'data/shop_search_index.json';
const USER_LOCATION_ID = '__user_location__';

const BRIDGE_AREA_BOUNDS = {
  minLon: 114.1590,
  maxLon: 114.1655,
  minLat: 22.2815,
  maxLat: 22.2875,
};

const MAP_DIMENSIONS = {
  width: 760,
  height: 420,
  padding: 20,
};

const FLOORPLAN_TILE_ROOT = 'data/floorplan';
const FLOORPLAN_TILE_ZOOM = 15;
const FLOORPLAN_TILE_SIZE = 256;
const FLOORPLAN_TILE_MIN = { x: 16382, y: 16382 };
const FLOORPLAN_FLOOR_ID = {
  1: 'L-1',
  2: 'L-2',
  3: 'L-3',
  4: 'L-4',
};
const FLOORPLAN_TILE_LAYOUT = [];
for (let y = 16382; y <= 16385; y += 1) {
  for (let x = 16382; x <= 16385; x += 1) {
    FLOORPLAN_TILE_LAYOUT.push({
      x,
      y,
      left: (x - FLOORPLAN_TILE_MIN.x) * FLOORPLAN_TILE_SIZE,
      top: (y - FLOORPLAN_TILE_MIN.y) * FLOORPLAN_TILE_SIZE,
    });
  }
}
const FLOORPLAN_LAYOUT_BOUNDS = FLOORPLAN_TILE_LAYOUT.reduce(
  (bounds, tile) => {
    bounds.minLeft = Math.min(bounds.minLeft, tile.left);
    bounds.minTop = Math.min(bounds.minTop, tile.top);
    bounds.maxRight = Math.max(bounds.maxRight, tile.left + FLOORPLAN_TILE_SIZE);
    bounds.maxBottom = Math.max(bounds.maxBottom, tile.top + FLOORPLAN_TILE_SIZE);
    return bounds;
  },
  {
    minLeft: Infinity,
    minTop: Infinity,
    maxRight: -Infinity,
    maxBottom: -Infinity,
  }
);
const FLOORPLAN_MOSAIC_WIDTH = FLOORPLAN_LAYOUT_BOUNDS.maxRight - FLOORPLAN_LAYOUT_BOUNDS.minLeft;
const FLOORPLAN_MOSAIC_HEIGHT = FLOORPLAN_LAYOUT_BOUNDS.maxBottom - FLOORPLAN_LAYOUT_BOUNDS.minTop;
const FLOORPLAN_CONTENT_BOUNDS = {
  1: { minX: 79, minY: 229, maxX: 913, maxY: 803 },
  2: { minX: 79, minY: 229, maxX: 909, maxY: 733 },
  3: { minX: 79, minY: 229, maxX: 909, maxY: 733 },
  4: { minX: 79, minY: 229, maxX: 909, maxY: 733 },
};
const FLOORPLAN_LABELS = {
  1: new Set(['city’super', 'chapter', 'ZARA', 'Sephora', 'PALACE ifc', 'Maje', 'ba&sh', 'Apple Store', 'Alexandre Zo', 'SmarTone', '奇華餅家']),
  2: new Set(['Zegna', 'TOM FORD', '愛彼', 'LOEWE', 'CHANEL Fashi', 'CELINE', 'Chloé', 'BVLGARI', 'CHAUMET', 'Mannings Plu', 'Apple Store']),
  3: new Set(['45R', 'Apple Store', 'agnès b. LA ', '連卡佛']),
  4: new Set(['Shake Shack', '四季菊']),
};
const FLOORPLAN_LABEL_LAYOUTS = {
  1: {
    'Apple Store': { x: 716, y: 246, fontSize: 7.2, textLength: 42 },
    'Alexandre Zo': { x: 483, y: 415, text: 'Alexandre Zouari', fontSize: 8.5 },
    'Maje': { x: 305, y: 274, fontSize: 8.5 },
    'PALACE ifc': { x: 431, y: 165, fontSize: 8.5 },
    'SmarTone': { x: 469, y: 454, fontSize: 8.5 },
    'chapter': { x: 479, y: 24, fontSize: 8.5 },
    'city’super': { x: 177, y: 110, fontSize: 8.5 },
    'ZARA': { x: 377, y: 69, fontSize: 8.5 },
    'ba&sh': { x: 349, y: 383, fontSize: 8.5 },
    'Sephora': { x: 443, y: 67, fontSize: 8.5 },
    '奇華餅家': { x: 498, y: 483, text: 'Kee Wah Bakery', fontSize: 8.5 },
  },
  2: {
    'Apple Store': { x: 770, y: 250, fontSize: 7.2, textLength: 42 },
    'CHANEL Fashi': { x: 400, y: 30, text: 'CHANEL Fashion', fontSize: 8.5 },
    'TOM FORD': { x: 152, y: 128, fontSize: 8.5 },
    '愛彼': { x: 134, y: 166, text: 'Audemars Piguet', fontSize: 8.5 },
    'LOEWE': { x: 346, y: 188, fontSize: 8.5 },
    'BVLGARI': { x: 296, y: 336, fontSize: 8.5 },
    'CELINE': { x: 626, y: 20, fontSize: 8.5 },
    'CHAUMET': { x: 298, y: 372, fontSize: 8.5 },
    'Chloé': { x: 452, y: 148, fontSize: 8.5 },
    'Mannings Plu': { x: 760, y: 316, text: 'Mannings Plus', fontSize: 8.5 },
    'Zegna': { x: 230, y: 82, fontSize: 8.5 },
  },
  3: {
    '45R': { x: 600, y: 146, fontSize: 8.5 },
    'Apple Store': { x: 778, y: 274, fontSize: 7.2, textLength: 42 },
    'agnès b. LA ': { x: 716, y: 406, text: 'agnes b. LA LOGGIA bis', fontSize: 8.5 },
    '連卡佛': { x: 286, y: 132, text: 'Lane Crawford', fontSize: 8.5 },
  },
  4: {
    'Shake Shack': { x: 642, y: 136, fontSize: 8.5 },
    '四季菊': { x: 250, y: 118, text: 'Shikigiku Japanese Restaurant', fontSize: 8.5 },
  },
};
const IFC_FLOOR_ROUTE_CONFIG = {
  1: {
    corridorNodes: {
      westTop: { x: 188, y: 184 },
      topMid: { x: 394, y: 136 },
      topEast: { x: 652, y: 152 },
      rightMid: { x: 742, y: 292 },
      bottomRight: { x: 664, y: 444 },
      bottomMid: { x: 476, y: 472 },
      bottomLeft: { x: 332, y: 404 },
      westMid: { x: 206, y: 284 },
      center: { x: 474, y: 274 },
    },
    corridorEdges: [
      ['westTop', 'topMid'],
      ['topMid', 'topEast'],
      ['topEast', 'rightMid'],
      ['rightMid', 'bottomRight'],
      ['bottomRight', 'bottomMid'],
      ['bottomMid', 'bottomLeft'],
      ['bottomLeft', 'westMid'],
      ['westMid', 'westTop'],
      ['topMid', 'center'],
      ['center', 'bottomMid'],
      ['center', 'rightMid'],
    ],
    shopDoors: {},
  },
  2: {
    corridorNodes: {
      leftTop: { x: 170, y: 170 },
      topMid: { x: 408, y: 126 },
      topRight: { x: 684, y: 112 },
      rightMid: { x: 754, y: 274 },
      bottomRight: { x: 700, y: 432 },
      bottomMid: { x: 464, y: 460 },
      bottomLeft: { x: 258, y: 382 },
      leftMid: { x: 150, y: 278 },
      center: { x: 474, y: 254 },
    },
    corridorEdges: [
      ['leftTop', 'topMid'],
      ['topMid', 'topRight'],
      ['topRight', 'rightMid'],
      ['rightMid', 'bottomRight'],
      ['bottomRight', 'bottomMid'],
      ['bottomMid', 'bottomLeft'],
      ['bottomLeft', 'leftMid'],
      ['leftMid', 'leftTop'],
      ['topMid', 'center'],
      ['center', 'bottomMid'],
      ['center', 'rightMid'],
    ],
    shopDoors: {},
  },
  3: {
    corridorNodes: {
      topWest: { x: 468, y: 150 },
      topMid: { x: 560, y: 128 },
      topEast: { x: 650, y: 150 },
      rightUpper: { x: 720, y: 178 },
      rightMid: { x: 758, y: 232 },
      rightLower: { x: 758, y: 274 },
      bottomRight: { x: 734, y: 380 },
      bottomMid: { x: 618, y: 406 },
      lowerMid: { x: 492, y: 374 },
      leftMid: { x: 356, y: 292 },
    },
    corridorEdges: [
      ['topWest', 'topMid'],
      ['topMid', 'topEast'],
      ['topEast', 'rightUpper'],
      ['rightUpper', 'rightMid'],
      ['rightMid', 'rightLower'],
      ['rightLower', 'bottomRight'],
      ['bottomRight', 'bottomMid'],
      ['bottomMid', 'lowerMid'],
      ['lowerMid', 'leftMid'],
      ['leftMid', 'topWest'],
      ['topMid', 'lowerMid'],
    ],
    shopDoors: {
      ifc_l3_3031_70_l3: {
        x: 448,
        y: 156,
        corridorNode: 'topWest',
        exitLabel: 'Exit Lane Crawford to the upper corridor',
        enterLabel: 'Enter Lane Crawford from the upper corridor',
      },
      ifc_l3_apple_store_3093_97_l3: {
        x: 758,
        y: 274,
        corridorNode: 'rightLower',
        exitLabel: 'Exit Apple Store to the right corridor',
        enterLabel: 'Enter Apple Store from the right corridor',
      },
      ifc_l3_45r_3083_l3: {
        x: 592,
        y: 152,
        corridorNode: 'topEast',
        exitLabel: 'Exit 45R to the upper corridor',
        enterLabel: 'Enter 45R from the upper corridor',
      },
      ifc_l3_agn_s_b_la_loggia_bis_3002_05_l3: {
        x: 716,
        y: 396,
        corridorNode: 'bottomRight',
        exitLabel: 'Exit agnes b. LA LOGGIA bis to the lower corridor',
        enterLabel: 'Enter agnes b. LA LOGGIA bis from the lower corridor',
      },
    },
  },
  4: {
    corridorNodes: {
      left: { x: 216, y: 152 },
      midLeft: { x: 366, y: 138 },
      mid: { x: 528, y: 144 },
      right: { x: 672, y: 168 },
    },
    corridorEdges: [
      ['left', 'midLeft'],
      ['midLeft', 'mid'],
      ['mid', 'right'],
    ],
    shopDoors: {},
  },
};
const FLOORPLAN_GRAPH_BOUNDS_CACHE = {};

function getFloorplanContentBounds(floorIndex) {
  const bounds = FLOORPLAN_CONTENT_BOUNDS[floorIndex];
  if (!bounds) {
    return {
      minX: 0,
      minY: 0,
      maxX: FLOORPLAN_MOSAIC_WIDTH - 1,
      maxY: FLOORPLAN_MOSAIC_HEIGHT - 1,
      width: FLOORPLAN_MOSAIC_WIDTH,
      height: FLOORPLAN_MOSAIC_HEIGHT,
    };
  }

  return {
    ...bounds,
    width: bounds.maxX - bounds.minX + 1,
    height: bounds.maxY - bounds.minY + 1,
  };
}

const DEFAULT_SEARCH_CONFIG = {
  fuzzy_match_threshold: 0.4,
  max_results: 20,
  boost_exact_match: true,
  boost_category_match: 0.8,
  boost_keyword_match: 0.6,
};

const state = {
  graph: null,
  currentFloor: 1,
  currentRoute: null,
  currentLocation: null,
  highlightedSearchNodes: [],
  searchIndexEntries: [],
  searchIndexMap: {},
  searchConfig: DEFAULT_SEARCH_CONFIG,
};

const startSelect = document.getElementById('startSelect');
const endSelect = document.getElementById('endSelect');
const modeSelect = document.getElementById('modeSelect');
const findRouteBtn = document.getElementById('findRouteBtn');
const routeSummary = document.getElementById('routeSummary');
const routeMeta = document.getElementById('routeMeta');
const instructions = document.getElementById('instructions');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');
const nearbyResults = document.getElementById('nearbyResults');
const routePageBtn = document.getElementById('routePageBtn');
const nearbyPageBtn = document.getElementById('nearbyPageBtn');
const routePage = document.getElementById('routePage');
const nearbyPage = document.getElementById('nearbyPage');
const nearbyShopsBtn = document.getElementById('nearbyShopsBtn');
const nearbyBuildingsBtn = document.getElementById('nearbyBuildingsBtn');
const mapSvg = document.getElementById('mapSvg');
const currentLocationOriginBtn = document.getElementById('currentLocationOriginBtn');
const currentLocationDestinationBtn = document.getElementById('currentLocationDestinationBtn');
const locationStatus = document.getElementById('locationStatus');
const weatherSummary = document.getElementById('weatherSummary');
const weatherAlert = document.getElementById('weatherAlert');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const zoomResetBtn = document.getElementById('zoomResetBtn');
const floorButtons = document.querySelectorAll('.floor-btn');
const floorplanOverlay = document.getElementById('floorplanOverlay');
const mapContainer = document.querySelector('.map-container');
const mapViewport = document.getElementById('mapViewport');
let activePage = 'route';
let currentFloorplanFloor = null;
let floorplanRouteSvg = null;
let mapTransform = { x: 0, y: 0 };
let mapScale = 1;
let panStart = null;
let isMapPanning = false;
const MAP_MIN_SCALE = 1;
const MAP_MAX_SCALE = 3;
const MAP_ZOOM_STEP = 0.2;

function normalizeDisplayFloor(level) {
  return level === 0 ? 1 : level;
}

window.addEventListener('DOMContentLoaded', async () => {
  try {
    state.graph = await loadGraph();
    populateLocations();
    renderMap();
    setFloorButton(state.currentFloor);
  } catch (error) {
    console.error('Graph load failed:', error);
    if (routeSummary) {
      routeSummary.textContent = 'Unable to load graph data. Please check the browser console for details.';
    }
  } finally {
    loadWeather();

    if (mapContainer) {
      mapContainer.addEventListener('pointerdown', onMapPointerDown);
      window.addEventListener('pointermove', onMapPointerMove);
      window.addEventListener('pointerup', onMapPointerUp);
      mapContainer.addEventListener('wheel', onMapWheel, { passive: false });
    }
  }
});

zoomInBtn?.addEventListener('click', () => {
  zoomMap(MAP_ZOOM_STEP);
});

zoomOutBtn?.addEventListener('click', () => {
  zoomMap(-MAP_ZOOM_STEP);
});

zoomResetBtn?.addEventListener('click', () => {
  resetMapView();
});

currentLocationOriginBtn.addEventListener('click', () => {
  requestCurrentLocation(() => {
    setCurrentLocationAs('start');
  });
});

currentLocationDestinationBtn.addEventListener('click', () => {
  requestCurrentLocation(() => {
    setCurrentLocationAs('end');
  });
});

routePageBtn.addEventListener('click', () => {
  switchPage('route');
});

nearbyPageBtn.addEventListener('click', () => {
  switchPage('nearby');
});

searchBtn.addEventListener('click', () => {
  switchPage('route');
  updateSearchResults(searchInput.value);
});

searchInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    switchPage('route');
    updateSearchResults(searchInput.value);
  }
});

nearbyShopsBtn.addEventListener('click', () => {
  switchPage('nearby');
  showNearbyPlaces('shop');
});

nearbyBuildingsBtn.addEventListener('click', () => {
  switchPage('nearby');
  showNearbyPlaces('building');
});

const resultsContainers = [searchResults, nearbyResults];
resultsContainers.forEach((container) => {
  container.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button || !button.dataset.action) {
      return;
    }
    selectSearchLocation(button.dataset.id, button.dataset.action);
  });
});

routePageBtn.addEventListener('click', () => {
  switchPage('route');
});

nearbyPageBtn.addEventListener('click', () => {
  switchPage('nearby');
});

searchBtn.addEventListener('click', () => {
  switchPage('route');
  updateSearchResults(searchInput.value);
});

searchInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    switchPage('route');
    updateSearchResults(searchInput.value);
  }
});

nearbyShopsBtn.addEventListener('click', () => {
  switchPage('nearby');
  showNearbyPlaces('shop');
});

nearbyBuildingsBtn.addEventListener('click', () => {
  switchPage('nearby');
  showNearbyPlaces('building');
});

findRouteBtn.addEventListener('click', () => {
  const startId = getSelectedStartId();
  const endId = getSelectedEndId();
  const mode = modeSelect.value;
  if (!isValidStartId(startId) || !isValidStartId(endId) || startId === endId) {
    alert('Select two different locations or enable current location first.');
    return;
  }
  const route = findRoute(state.graph, startId, endId, mode);
  state.currentRoute = route;
  state.highlightedSearchNodes = [];
  if (route && state.graph.nodes[startId]) {
    setFloorForNode(state.graph.nodes[startId]);
  } else {
    renderMap();
  }
  renderRoute(route, mode);
});

floorButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const floor = normalizeDisplayFloor(Number(button.dataset.floor));
    state.currentFloor = floor;
    setFloorButton(floor);
    resetMapView();
    renderMap();
  });
});

async function loadGraph() {
  const [baseResponse, bridgeResponse, indexResponse] = await Promise.all([
    fetch(GRAPH_URL),
    fetch(BRIDGE_GRAPH_URL),
    fetch(SEARCH_INDEX_URL),
  ]);

  if (!baseResponse.ok || !bridgeResponse.ok || !indexResponse.ok) {
    throw new Error('Failed to load graph or search index data');
  }

  const baseGraph = await baseResponse.json();
  const bridgeGraph = await bridgeResponse.json();
  const searchIndexData = await indexResponse.json();

  const { shops, categories, search_config: searchConfig } =
    Array.isArray(searchIndexData) ? { shops: searchIndexData } : searchIndexData;

  state.searchIndexEntries = Array.isArray(shops) ? shops : [];
  state.searchConfig = { ...DEFAULT_SEARCH_CONFIG, ...(searchConfig || {}) };
  state.searchIndexMap = state.searchIndexEntries.reduce((map, entry) => {
    const key = entry.shop_id || entry.id || `${entry.level}_${entry.code}`;
    map[key] = entry;
    return map;
  }, {});

  const graph = mergeGraphs(baseGraph, bridgeGraph);

  graph.nodes = graph.nodes.reduce((hash, node) => {
    hash[node.id] = node;
    return hash;
  }, {});
  graph.adjacency = buildAdjacency(graph);
  return graph;
}

function buildAdjacency(graph) {
  return graph.edges.reduce((adj, edge) => {
    adj[edge.from] = adj[edge.from] || [];
    adj[edge.from].push(edge);
    adj[edge.to] = adj[edge.to] || [];
    adj[edge.to].push({ ...edge, from: edge.to, to: edge.from });
    return adj;
  }, {});
}

function mergeGraphs(baseGraph, bridgeGraph) {
  const nodes = [...baseGraph.nodes];
  const idMap = {};
  const nodeIds = new Set(nodes.map((node) => node.id));
  const bridgeNodes = [];

  bridgeGraph.nodes.forEach((node) => {
    if (!isBridgeInArea(node)) {
      return;
    }

    let id = node.id;
    let suffix = 1;
    while (nodeIds.has(id)) {
      id = `${node.id}_${suffix}`;
      suffix += 1;
    }

    if (id !== node.id) {
      idMap[node.id] = id;
    }

    nodeIds.add(id);
    bridgeNodes.push({
      ...node,
      id,
      level: node.level ?? 0,
      lon: node.lon,
      lat: node.lat,
      x: node.x ?? 0,
      y: node.y ?? 0,
      shortLabel: node.shortLabel ?? node.label ?? id,
      type: node.type ?? 'bridge',
    });
  });

  assignBridgeCoordinates(bridgeNodes);
  nodes.push(...bridgeNodes);

  const bridgeEdges = bridgeGraph.edges
    .map((edge) => ({
      ...edge,
      from: idMap[edge.from] || edge.from,
      to: idMap[edge.to] || edge.to,
    }))
    .filter((edge) => nodeIds.has(edge.from) && nodeIds.has(edge.to));

  const edges = [...baseGraph.edges, ...bridgeEdges];
  return { nodes, edges };
}

function getMapXYFromLonLat(lon, lat) {
  const { width, height, padding } = MAP_DIMENSIONS;
  const lonRange = BRIDGE_AREA_BOUNDS.maxLon - BRIDGE_AREA_BOUNDS.minLon || 0.0001;
  const latRange = BRIDGE_AREA_BOUNDS.maxLat - BRIDGE_AREA_BOUNDS.minLat || 0.0001;
  const xNorm = (lon - BRIDGE_AREA_BOUNDS.minLon) / lonRange;
  const yNorm = (BRIDGE_AREA_BOUNDS.maxLat - lat) / latRange;
  return {
    x: padding + xNorm * width,
    y: padding + yNorm * height,
  };
}

function requestCurrentLocation(callback) {
  if (!navigator.geolocation) {
    setLocationStatus('Geolocation not supported', 'error');
    return;
  }

  setLocationStatus('Requesting current location...', '');
  navigator.geolocation.getCurrentPosition(
    (position) => {
      state.currentLocation = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
      const coordsText = `${state.currentLocation.lat.toFixed(5)}, ${state.currentLocation.lon.toFixed(5)}`;
      setLocationStatus(`Current location set: ${coordsText}`, 'set');
      enableCurrentLocationOption(coordsText);
      addCurrentLocationNode();
      renderMap();
      if (typeof callback === 'function') {
        callback();
      }
    },
    (error) => {
      setLocationStatus(`Location error: ${error.message}`, 'error');
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    }
  );
}

function setLocationStatus(message, stateClass) {
  locationStatus.textContent = message;
  locationStatus.className = 'location-status';
  if (stateClass) {
    locationStatus.classList.add(stateClass);
  }
}

function enableCurrentLocationOption(label) {
  const currentStartOption = startSelect.querySelector(`option[value="${USER_LOCATION_ID}"]`);
  const currentEndOption = endSelect.querySelector(`option[value="${USER_LOCATION_ID}"]`);

  if (currentStartOption) {
    currentStartOption.textContent = `Current location (${label})`;
    currentStartOption.disabled = false;
  }

  if (currentEndOption) {
    currentEndOption.textContent = `Current location (${label})`;
    currentEndOption.disabled = false;
  }
}

function setCurrentLocationAs(type) {
  if (type === 'start') {
    startSelect.value = USER_LOCATION_ID;
  } else if (type === 'end') {
    endSelect.value = USER_LOCATION_ID;
  }
}

function addCurrentLocationNode() {
  if (!state.currentLocation || !state.graph) {
    return;
  }

  const { x, y } = getMapXYFromLonLat(state.currentLocation.lon, state.currentLocation.lat);
  state.graph.nodes[USER_LOCATION_ID] = {
    id: USER_LOCATION_ID,
    label: 'Current Location',
    shortLabel: 'You',
    level: 0,
    x,
    y,
    lon: state.currentLocation.lon,
    lat: state.currentLocation.lat,
    type: 'user',
  };

  state.graph.edges = state.graph.edges.filter(
    (edge) => edge.from !== USER_LOCATION_ID && edge.to !== USER_LOCATION_ID
  );

  const nearby = getNearestNodesToUser(state.graph.nodes[USER_LOCATION_ID], Object.values(state.graph.nodes), 4, 150);
  nearby.forEach((target) => {
    if (target.id === USER_LOCATION_ID) {
      return;
    }
    state.graph.edges.push({
      id: `edge_${USER_LOCATION_ID}_${target.id}`,
      from: USER_LOCATION_ID,
      to: target.id,
      label: 'Path from current location',
      description: 'Route connection from your current location to the nearby graph node.',
      distance: nearestDistance(state.graph.nodes[USER_LOCATION_ID], target),
      estimatedTime: nearestDistance(state.graph.nodes[USER_LOCATION_ID], target) / 1.4,
      covered: false,
      confidence: 'low',
      crowded: false,
      type: 'user_connection',
    });
  });

  state.graph.adjacency = buildAdjacency(state.graph);
}

function switchPage(page) {
  activePage = page;
  if (page === 'route') {
    routePage.classList.remove('hidden');
    nearbyPage.classList.add('hidden');
    routePageBtn.classList.add('active');
    nearbyPageBtn.classList.remove('active');
    nearbyResults.innerHTML = '';
  } else {
    routePage.classList.add('hidden');
    nearbyPage.classList.remove('hidden');
    routePageBtn.classList.remove('active');
    nearbyPageBtn.classList.add('active');
    searchResults.innerHTML = '';
  }
}

function updateMapTransform() {
  if (!mapViewport) {
    return;
  }
  mapViewport.style.transform = `translate(${mapTransform.x}px, ${mapTransform.y}px) scale(${mapScale})`;
}

function clampMapScale(scale) {
  return Math.min(MAP_MAX_SCALE, Math.max(MAP_MIN_SCALE, scale));
}

function zoomMap(delta, anchor) {
  if (!mapContainer || !mapViewport) {
    return;
  }

  const nextScale = clampMapScale(Number((mapScale + delta).toFixed(3)));
  if (nextScale === mapScale) {
    return;
  }

  const rect = mapContainer.getBoundingClientRect();
  const anchorPoint = anchor || {
    x: rect.width / 2,
    y: rect.height / 2,
  };

  const contentX = (anchorPoint.x - mapTransform.x) / mapScale;
  const contentY = (anchorPoint.y - mapTransform.y) / mapScale;
  mapScale = nextScale;
  mapTransform.x = anchorPoint.x - contentX * mapScale;
  mapTransform.y = anchorPoint.y - contentY * mapScale;
  updateMapTransform();
}

function resetMapView() {
  mapScale = 1;
  mapTransform = { x: 0, y: 0 };
  updateMapTransform();
}

function onMapWheel(event) {
  if (!mapContainer) {
    return;
  }

  event.preventDefault();
  const rect = mapContainer.getBoundingClientRect();
  const anchor = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
  zoomMap(event.deltaY < 0 ? MAP_ZOOM_STEP : -MAP_ZOOM_STEP, anchor);
}

function onMapPointerDown(event) {
  if (!mapContainer || !mapViewport) {
    return;
  }
  if (event.pointerType === 'mouse' && event.button !== 0) {
    return;
  }
  isMapPanning = true;
  panStart = {
    x: event.clientX - mapTransform.x,
    y: event.clientY - mapTransform.y,
  };
  mapContainer.classList.add('grabbing');
  mapContainer.setPointerCapture(event.pointerId);
  event.preventDefault();
}

function onMapPointerMove(event) {
  if (!isMapPanning || !panStart) {
    return;
  }
  mapTransform.x = event.clientX - panStart.x;
  mapTransform.y = event.clientY - panStart.y;
  updateMapTransform();
}

function onMapPointerUp(event) {
  if (!isMapPanning) {
    return;
  }
  isMapPanning = false;
  panStart = null;
  if (mapContainer) {
    mapContainer.classList.remove('grabbing');
    if (event?.pointerId) {
      mapContainer.releasePointerCapture(event.pointerId);
    }
  }
}

function getResultsContainer() {
  return activePage === 'route' ? searchResults : nearbyResults;
}

function getSelectedStartId() {
  if (startSelect.value && startSelect.value !== USER_LOCATION_ID) {
    return startSelect.value;
  }
  return state.currentLocation ? USER_LOCATION_ID : '';
}

function getSelectedEndId() {
  if (endSelect.value && endSelect.value !== USER_LOCATION_ID) {
    return endSelect.value;
  }
  return state.currentLocation ? USER_LOCATION_ID : '';
}

function isValidStartId(startId) {
  return Boolean(startId && (startId !== USER_LOCATION_ID || state.currentLocation));
}

function updateSearchResults(query) {
  switchPage('route');
  const normalized = (query || '').trim().toLowerCase();
  const results = searchLocations(query);
  state.highlightedSearchNodes = results.map((item) => item.id);

  const startId = getSelectedStartId();
  const exactMatches = results.filter((node) => {
    const label = (node.label || '').toLowerCase();
    const code = String(node.code || '').toLowerCase();
    return label === normalized || code === normalized;
  });
  const autoTarget = exactMatches.length === 1 ? exactMatches[0] : results.length === 1 ? results[0] : null;

  if (isValidStartId(startId) && autoTarget && autoTarget.id !== startId) {
    setFloorForNode(autoTarget);
    endSelect.value = autoTarget.id;
    const route = findRoute(state.graph, startId, autoTarget.id, modeSelect.value);
    state.currentRoute = route;
    renderMap();
    renderRoute(route, modeSelect.value);
  }

  renderSearchResults(results, normalized ? `Search results for “${query.trim()}”` : 'Enter a search term');
}

function searchLocations(query) {
  const normalized = (query || '').trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  const candidates = state.searchIndexEntries
    .map((entry) => ({
      entry,
      score: scoreSearchEntry(entry, normalized),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, state.searchConfig.max_results || 20);

  return candidates
    .map((item) => mapSearchEntryToGraphNode(item.entry))
    .filter(Boolean);
}

function scoreSearchEntry(entry, query) {
  const label = (entry.name || entry.label || '').toLowerCase();
  const code = (entry.code || '').toLowerCase();
  const category = (entry.category || '').toLowerCase();
  const keywords = (entry.keywords || []).map((keyword) => keyword.toLowerCase());
  const config = state.searchConfig || DEFAULT_SEARCH_CONFIG;

  let score = 0;
  const exactLabel = query === label;
  const exactCode = query === code;
  const exactCategory = query === category;

  if (exactLabel) score += config.boost_exact_match ? 200 : 160;
  if (exactCode) score += config.boost_exact_match ? 180 : 140;
  if (exactCategory) score += config.boost_category_match ? 150 : 120;

  if (label.startsWith(query)) score += 90;
  if (code.startsWith(query)) score += 70;
  if (category.startsWith(query)) score += 60 * (config.boost_category_match || 1);

  if (label.includes(query)) score += 70;
  if (code.includes(query)) score += 55;
  if (category.includes(query)) score += 45 * (config.boost_category_match || 1);
  if (keywords.some((keyword) => keyword.includes(query))) score += 65 * (config.boost_keyword_match || 1);

  const tokens = query.split(/\s+/).filter(Boolean);
  tokens.forEach((token) => {
    if (label.includes(token)) score += 18;
    if (category.includes(token)) score += 12 * (config.boost_category_match || 1);
    if (keywords.some((keyword) => keyword.includes(token))) score += 14 * (config.boost_keyword_match || 1);
    if (code.includes(token)) score += 20;
    if (isSubsequence(token, label) || isSubsequence(token, category) || keywords.some((keyword) => isSubsequence(token, keyword))) {
      score += 8;
    }
  });

  if (exactLabel || exactCode || exactCategory) {
    score += 30;
  }

  return score;
}

function mapSearchEntryToGraphNode(entry) {
  if (!state.graph || !state.graph.nodes) {
    return null;
  }

  const searchLevel = parseInt((entry.level || '').replace(/[^0-9]/g, ''), 10);
  const candidates = Object.values(state.graph.nodes).filter((node) => {
    if (node.id === USER_LOCATION_ID) return false;
    const sameLevel = searchLevel ? node.level === searchLevel : true;
    const sameCode = entry.code ? String(node.code || '').toLowerCase() === String(entry.code).toLowerCase() : false;
    const sameLabel = entry.name ? String(node.label || '').toLowerCase() === String(entry.name).toLowerCase() : false;
    return sameLevel && (sameCode || sameLabel);
  });

  return candidates.length ? candidates[0] : null;
}

function isSubsequence(needle, haystack) {
  let i = 0;
  let j = 0;
  while (i < needle.length && j < haystack.length) {
    if (needle[i] === haystack[j]) {
      i += 1;
    }
    j += 1;
  }
  return i === needle.length;
}

function showNearbyPlaces(category) {
  if (!state.currentLocation || !state.graph.nodes[USER_LOCATION_ID]) {
    alert('Enable current location first so nearby places can be found.');
    return;
  }

  switchPage('nearby');
  const origin = state.graph.nodes[USER_LOCATION_ID];
  const candidates = Object.values(state.graph.nodes)
    .filter((node) => node.id !== USER_LOCATION_ID)
    .filter((node) => {
      if (category === 'shop') {
        return isShopNode(node);
      }
      return Boolean(node.building);
    })
    .map((node) => ({ node, distance: nearestDistance(origin, node) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 8)
    .map((item) => item.node);

  state.highlightedSearchNodes = candidates.map((node) => node.id);
  renderSearchResults(candidates, category === 'shop' ? 'Nearby shops' : 'Nearby buildings');
  renderMap();
}

function isShopNode(node) {
  const text = `${node.label || ''} ${node.shortLabel || ''} ${node.building || ''}`.toLowerCase();
  const shopKeywords = ['shop', 'mall', 'food', 'restaurant', 'cafe', 'boutique', 'arcade', 'store', 'entrance'];
  return shopKeywords.some((keyword) => text.includes(keyword));
}

function renderSearchResults(results, headingText) {
  const container = getResultsContainer();
  container.innerHTML = '';
  const heading = document.createElement('div');
  heading.className = 'search-results-heading';
  heading.textContent = headingText;
  container.appendChild(heading);

  if (!results.length) {
    const empty = document.createElement('div');
    empty.textContent = 'No matching locations found.';
    container.appendChild(empty);
    return;
  }

  results.forEach((node) => {
    const item = document.createElement('div');
    item.className = 'search-result-item';

    const label = document.createElement('div');
    label.className = 'search-result-label';
    label.innerHTML = `<strong>${node.label}</strong><br><small>${node.code ? `Code ${node.code} · ` : ''}Floor L${node.level} · ${node.building || 'Unknown building'}${node.category ? ` · ${node.category}` : ''}</small>`;
    item.appendChild(label);

    const actions = document.createElement('div');
    actions.className = 'search-actions';

    const goButton = document.createElement('button');
    goButton.type = 'button';
    goButton.dataset.id = node.id;
    goButton.dataset.action = 'go';
    goButton.textContent = 'Route here';
    actions.appendChild(goButton);

    const startButton = document.createElement('button');
    startButton.type = 'button';
    startButton.dataset.id = node.id;
    startButton.dataset.action = 'start';
    startButton.textContent = 'Start';
    actions.appendChild(startButton);

    const endButton = document.createElement('button');
    endButton.type = 'button';
    endButton.dataset.id = node.id;
    endButton.dataset.action = 'end';
    endButton.textContent = 'End';
    actions.appendChild(endButton);

    item.appendChild(actions);
    const container = getResultsContainer();
    container.appendChild(item);
  });
}

function selectSearchLocation(nodeId, action) {
  const node = state.graph.nodes[nodeId];
  if (!node) {
    return;
  }

  if (action === 'start') {
    setFloorForNode(node);
    startSelect.value = nodeId;
    return;
  }

  if (action === 'end') {
    setFloorForNode(node);
    endSelect.value = nodeId;
    return;
  }

  if (action === 'go') {
    const startId = getSelectedStartId();
    if (!isValidStartId(startId)) {
      alert('Select a start location first or enable current location.');
      return;
    }
    if (startId === nodeId) {
      alert('Select a different start location first, or enable current location.');
      return;
    }

    setFloorForNode(node);
    endSelect.value = nodeId;
    const route = findRoute(state.graph, startId, nodeId, modeSelect.value);
    state.currentRoute = route;
    renderMap();
    renderRoute(route, modeSelect.value);
  }
}

function setFloorForNode(node) {
  state.currentFloor = normalizeDisplayFloor(node.level);
  setFloorButton(state.currentFloor);
  resetMapView();
  renderMap();
}

function getNearestNodesToUser(userNode, nodes, maxCount = 3, thresholdMeters = 150) {
  const candidates = nodes
    .filter((node) => node.id !== USER_LOCATION_ID)
    .map((node) => ({
      node,
      distance: nearestDistance(userNode, node),
    }))
    .sort((a, b) => a.distance - b.distance);

  const nearby = candidates.filter((item) => item.distance <= thresholdMeters).slice(0, maxCount);
  if (nearby.length > 0) {
    return nearby.map((item) => item.node);
  }

  return candidates.slice(0, maxCount).map((item) => item.node);
}

function nearestDistance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const pixelDistance = Math.sqrt(dx * dx + dy * dy);
  const lonRange = BRIDGE_AREA_BOUNDS.maxLon - BRIDGE_AREA_BOUNDS.minLon || 0.0001;
  const latRange = BRIDGE_AREA_BOUNDS.maxLat - BRIDGE_AREA_BOUNDS.minLat || 0.0001;
  const metersPerPixel = ((lonRange * 102000) + (latRange * 111000)) / 2 / MAP_DIMENSIONS.width;
  return Math.round(pixelDistance * metersPerPixel * 10) / 10;
}

function isBridgeInArea(node) {
  return (
    node.lon >= BRIDGE_AREA_BOUNDS.minLon &&
    node.lon <= BRIDGE_AREA_BOUNDS.maxLon &&
    node.lat >= BRIDGE_AREA_BOUNDS.minLat &&
    node.lat <= BRIDGE_AREA_BOUNDS.maxLat
  );
}

async function loadWeather() {
  if (!weatherSummary || !weatherAlert) {
    return;
  }

  const locationName = 'Hong Kong Park';
  const timeoutMs = 7000;

  weatherSummary.textContent = 'Loading current conditions…';
  weatherAlert.textContent = 'Fetching HKO alerts…';
  weatherAlert.className = 'weather-alert loading';

  try {
    const observationData = await fetchJsonWithTimeout(
      'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en',
      timeoutMs
    );

    const temperatureRecord = findPlaceRecord(observationData.temperature?.data, locationName);
    const humidityRecord = findPlaceRecord(observationData.humidity?.data, locationName);
    const rainfallRecord = findPlaceRecord(observationData.rainfall?.data, locationName);

    const temperatureValue = temperatureRecord?.value ?? null;
    const humidityValue = humidityRecord?.value ?? null;
    const rainValue = rainfallRecord?.max ?? rainfallRecord?.value ?? null;

    let status = 'Clear';
    if (rainValue && Number(rainValue) > 0) {
      status = 'Raining';
    } else if (humidityValue && Number(humidityValue) >= 90) {
      status = 'Humid';
    } else if (temperatureValue !== null && Number(temperatureValue) >= 30) {
      status = 'Hot';
    } else if (temperatureValue !== null && Number(temperatureValue) <= 18) {
      status = 'Cool';
    }

    weatherSummary.textContent = `Hong Kong Park: ${status}${temperatureValue !== null ? ` (${temperatureValue}°C)` : ''}`;
    setWeatherAlert('No active HKO weather alerts for Hong Kong Park.', 'safe');
  } catch (error) {
    weatherSummary.textContent = 'Hong Kong Park weather unavailable';
    const message = error.name === 'AbortError'
      ? 'Weather request timed out.'
      : `Unable to retrieve HKO weather information: ${error.message || 'unknown error'}`;
    setWeatherAlert(message, 'safe');
    console.warn('Weather load failed:', error);
  }
}

async function fetchJsonWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeoutPromise = new Promise((_, reject) => {
    const timerId = setTimeout(() => {
      controller.abort();
      reject(new Error('Fetch timeout'));
    }, timeoutMs);

    if (controller.signal) {
      controller.signal.addEventListener(
        'abort',
        () => clearTimeout(timerId),
        { once: true }
      );
    }
  });

  const response = await Promise.race([
    fetch(url, { signal: controller.signal }),
    timeoutPromise,
  ]);

  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }

  const responseBody = await response.text();
  try {
    return JSON.parse(responseBody);
  } catch (error) {
    throw new Error(`Invalid JSON response from ${url}: ${error.message}`);
  }
}

function findPlaceRecord(list, placeName) {
  if (!Array.isArray(list)) {
    return null;
  }
  return list.find((item) => item.place === placeName || item.place?.toLowerCase() === placeName.toLowerCase()) || null;
}

function parseHKOAlert(alertData) {
  if (!alertData) {
    return '';
  }

  if (typeof alertData.warningMessage === 'string' && alertData.warningMessage.trim()) {
    return alertData.warningMessage.trim();
  }

  const alertText = [];
  if (alertData.generalSituation) {
    alertText.push(alertData.generalSituation);
  }

  if (alertData.warningInformation) {
    alertText.push(JSON.stringify(alertData.warningInformation));
  }

  return alertText.join(' ').trim();
}

function setWeatherAlert(text, severity) {
  if (!weatherAlert) {
    return;
  }
  weatherAlert.textContent = text;
  weatherAlert.className = `weather-alert ${severity}`;
}

function assignBridgeCoordinates(nodes) {
  const bridgeNodes = nodes.filter((node) => node.lon !== undefined && node.lat !== undefined);
  if (!bridgeNodes.length) {
    return;
  }

  const width = 760;
  const height = 420;
  const padding = 20;

  const lonRange = BRIDGE_AREA_BOUNDS.maxLon - BRIDGE_AREA_BOUNDS.minLon || 0.0001;
  const latRange = BRIDGE_AREA_BOUNDS.maxLat - BRIDGE_AREA_BOUNDS.minLat || 0.0001;

  bridgeNodes.forEach((node) => {
    const xNorm = (node.lon - BRIDGE_AREA_BOUNDS.minLon) / lonRange;
    const yNorm = (BRIDGE_AREA_BOUNDS.maxLat - node.lat) / latRange;
    node.x = padding + xNorm * width;
    node.y = padding + yNorm * height;
  });
}

function lonLatToFloorplanPoint(lon, lat) {
  const n = Math.pow(2, FLOORPLAN_TILE_ZOOM);
  const xTile = ((lon + 180) / 360) * n;
  const latRad = (lat * Math.PI) / 180;
  const yTile = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  return {
    x: (xTile - FLOORPLAN_TILE_MIN.x) * FLOORPLAN_TILE_SIZE,
    y: (yTile - FLOORPLAN_TILE_MIN.y) * FLOORPLAN_TILE_SIZE,
  };
}

function renderFloorplanOverlay(floorIndex) {
  if (!floorplanOverlay) {
    return;
  }

  if (currentFloorplanFloor === floorIndex) {
    return;
  }

  floorplanOverlay.innerHTML = '';
  currentFloorplanFloor = floorIndex;
  const floorId = FLOORPLAN_FLOOR_ID[floorIndex];
  if (!floorId) {
    return;
  }

  const contentBounds = getFloorplanContentBounds(floorIndex);
  const wrapper = document.createElement('div');
  wrapper.style.position = 'absolute';
  wrapper.style.left = '50%';
  wrapper.style.top = '50%';
  wrapper.style.width = `${contentBounds.width}px`;
  wrapper.style.height = `${contentBounds.height}px`;
  wrapper.style.transformOrigin = 'center';
  wrapper.style.overflow = 'hidden';

  const viewportWidth = mapViewport?.clientWidth || contentBounds.width;
  const viewportHeight = mapViewport?.clientHeight || contentBounds.height;
  const scale = Math.min(1, viewportWidth / contentBounds.width, viewportHeight / contentBounds.height);
  wrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;

  const routeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  routeSvg.classList.add('floorplan-route-layer');
  routeSvg.setAttribute('viewBox', `0 0 ${contentBounds.width} ${contentBounds.height}`);
  routeSvg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
  routeSvg.style.position = 'absolute';
  routeSvg.style.left = '0';
  routeSvg.style.top = '0';
  routeSvg.style.width = '100%';
  routeSvg.style.height = '100%';
  routeSvg.style.zIndex = '2';
  routeSvg.style.pointerEvents = 'none';
  floorplanRouteSvg = routeSvg;
  wrapper.appendChild(routeSvg);

  FLOORPLAN_TILE_LAYOUT.forEach((tile) => {
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    img.src = `${FLOORPLAN_TILE_ROOT}/${floorId}/${FLOORPLAN_TILE_ZOOM}/${tile.x}/${tile.y}.jpg`;
    img.style.left = `${tile.left - FLOORPLAN_LAYOUT_BOUNDS.minLeft - contentBounds.minX}px`;
    img.style.top = `${tile.top - FLOORPLAN_LAYOUT_BOUNDS.minTop - contentBounds.minY}px`;
    img.alt = `${floorId} tile ${tile.x}/${tile.y}`;
    img.onload = () => {
      img.style.opacity = '1';
    };
    img.onerror = () => img.remove();
    wrapper.appendChild(img);
  });

  floorplanOverlay.appendChild(wrapper);
}

function getFloorGraphBounds(floorIndex) {
  if (FLOORPLAN_GRAPH_BOUNDS_CACHE[floorIndex]) {
    return FLOORPLAN_GRAPH_BOUNDS_CACHE[floorIndex];
  }

  const nodes = Object.values(state.graph.nodes).filter(
    (node) => node.level === floorIndex && node.x !== undefined && node.y !== undefined
  );

  const bounds = nodes.reduce(
    (result, node) => {
      result.minX = Math.min(result.minX, node.x);
      result.maxX = Math.max(result.maxX, node.x);
      result.minY = Math.min(result.minY, node.y);
      result.maxY = Math.max(result.maxY, node.y);
      return result;
    },
    {
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity,
    }
  );

  if (bounds.minX === Infinity || bounds.minY === Infinity) {
    bounds.minX = 0;
    bounds.minY = 0;
    bounds.maxX = MAP_DIMENSIONS.width;
    bounds.maxY = MAP_DIMENSIONS.height;
  }

  FLOORPLAN_GRAPH_BOUNDS_CACHE[floorIndex] = bounds;
  return bounds;
}

function mapGraphPointToFloorplan(point) {
  if (point.x === undefined || point.y === undefined) {
    return { x: undefined, y: undefined };
  }

  const contentBounds = getFloorplanContentBounds(point.level);

  return {
    x: (point.x / MAP_DIMENSIONS.width) * contentBounds.width,
    y: (point.y / MAP_DIMENSIONS.height) * contentBounds.height,
  };
}

function renderFloorplanRoute(route, floorIndex) {
  if (!floorplanRouteSvg) {
    return;
  }

  floorplanRouteSvg.innerHTML = '';
  if (!route || !Array.isArray(route.edges)) {
    renderFloorplanShops(floorIndex);
    return;
  }

  const manualSegments = route.floorplanSegments?.[floorIndex];
  if (Array.isArray(manualSegments) && manualSegments.length) {
    manualSegments.forEach((segment) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', segment.x1);
      line.setAttribute('y1', segment.y1);
      line.setAttribute('x2', segment.x2);
      line.setAttribute('y2', segment.y2);
      line.setAttribute('class', 'floorplan-route-line');
      floorplanRouteSvg.appendChild(line);
    });
    renderFloorplanShops(floorIndex);
    return;
  }

  route.edges.forEach((edge) => {
    const fromNode = state.graph.nodes[edge.from];
    const toNode = state.graph.nodes[edge.to];
    if (!fromNode || !toNode) {
      return;
    }

    if (fromNode.level !== floorIndex && toNode.level !== floorIndex) {
      return;
    }

    const fromPoint =
      fromNode.lon !== undefined && fromNode.lat !== undefined
        ? lonLatToFloorplanPoint(fromNode.lon, fromNode.lat)
        : mapGraphPointToFloorplan(fromNode);
    const toPoint =
      toNode.lon !== undefined && toNode.lat !== undefined
        ? lonLatToFloorplanPoint(toNode.lon, toNode.lat)
        : mapGraphPointToFloorplan(toNode);

    if (fromPoint.x === undefined || fromPoint.y === undefined || toPoint.x === undefined || toPoint.y === undefined) {
      return;
    }

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', fromPoint.x);
    line.setAttribute('y1', fromPoint.y);
    line.setAttribute('x2', toPoint.x);
    line.setAttribute('y2', toPoint.y);
    line.setAttribute('class', 'floorplan-route-line');
    floorplanRouteSvg.appendChild(line);
  });

  renderFloorplanShops(floorIndex);
}

function renderFloorplanShops(floorIndex) {
  if (!floorplanRouteSvg) {
    return;
  }

  const visibleLabels = FLOORPLAN_LABELS[floorIndex] || new Set();

  const shopNodes = Object.values(state.graph.nodes).filter(
    (node) => node.level === floorIndex && node.type === 'shop' && visibleLabels.has(node.shortLabel || node.label || node.id)
  );

  shopNodes.forEach((node) => {
    const point = mapGraphPointToFloorplan(node);
    if (point.x === undefined || point.y === undefined) {
      return;
    }

    const labelText = node.shortLabel || node.label || node.id;
    const labelLayout = FLOORPLAN_LABEL_LAYOUTS[floorIndex]?.[labelText] || {};

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const labelX = labelLayout.x !== undefined ? labelLayout.x : point.x + (labelLayout.dx || 0);
    label.setAttribute('x', labelX);
    label.setAttribute('y', labelLayout.y ?? point.y + (labelLayout.dy || 0));
    if (labelLayout.anchor) {
      label.setAttribute('text-anchor', labelLayout.anchor);
    }
    if (labelLayout.fontSize) {
      label.setAttribute('font-size', `${labelLayout.fontSize}px`);
    }
    if (labelLayout.textLength) {
      label.setAttribute('textLength', `${labelLayout.textLength}`);
      label.setAttribute('lengthAdjust', 'spacingAndGlyphs');
    }
    label.setAttribute('class', 'floorplan-shop-label');
    label.textContent = labelLayout.text || labelText;
    floorplanRouteSvg.appendChild(label);
  });
}

function populateLocations() {
  state.graph.locations = Object.values(state.graph.nodes);
  startSelect.innerHTML = '';
  endSelect.innerHTML = '';

  const createDisabledCurrentOption = () => {
    const option = document.createElement('option');
    option.value = USER_LOCATION_ID;
    option.textContent = 'Current location (click to enable)';
    option.disabled = true;
    return option;
  };

  startSelect.appendChild(createDisabledCurrentOption());
  endSelect.appendChild(createDisabledCurrentOption());

  const locationItems = state.graph.locations.map((node) => ({
    label: `${node.label} (L${node.level})`,
    value: node.id,
  }));

  locationItems.forEach((item) => {
    const startOption = document.createElement('option');
    startOption.value = item.value;
    startOption.textContent = item.label;
    startSelect.appendChild(startOption);

    const endOption = document.createElement('option');
    endOption.value = item.value;
    endOption.textContent = item.label;
    endSelect.appendChild(endOption);
  });

  if (state.graph.locations.length > 1) {
    startSelect.selectedIndex = 1;
    endSelect.selectedIndex = Math.min(2, endSelect.options.length - 1);
    if (endSelect.selectedIndex === startSelect.selectedIndex) {
      endSelect.selectedIndex = Math.max(0, startSelect.selectedIndex - 1);
    }
  } else if (state.graph.locations.length === 1) {
    startSelect.selectedIndex = 1;
  }
}

function setFloorButton(level) {
  const normalizedLevel = normalizeDisplayFloor(level);
  floorButtons.forEach((button) => {
    button.classList.toggle('active', Number(button.dataset.floor) === normalizedLevel);
  });
}

function renderMap() {
  state.currentFloor = normalizeDisplayFloor(state.currentFloor);
  mapSvg.innerHTML = '';
  const nodes = Object.values(state.graph.nodes).filter((node) => node.level === state.currentFloor);
  renderFloorplanOverlay(state.currentFloor);
  renderFloorplanRoute(state.currentRoute, state.currentFloor);
  updateMapTransform();

  const edges = state.graph.edges.filter((edge) => {
    const from = state.graph.nodes[edge.from];
    const to = state.graph.nodes[edge.to];
    return from && to && from.level === state.currentFloor && to.level === state.currentFloor;
  });

  const routeEdges = state.currentRoute?.edges || [];
  const routeEdgeIds = new Set(routeEdges.map((edge) => edge.id));
  const routeNodeIds = new Set(routeEdges.flatMap((edge) => [edge.from, edge.to]));
  const highlightedSearchIds = new Set(state.highlightedSearchNodes);

  const edgeFragment = document.createDocumentFragment();
  edges.forEach((edge) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', state.graph.nodes[edge.from].x);
    line.setAttribute('y1', state.graph.nodes[edge.from].y);
    line.setAttribute('x2', state.graph.nodes[edge.to].x);
    line.setAttribute('y2', state.graph.nodes[edge.to].y);
    line.classList.add('edge-line');
    if (routeEdgeIds.has(edge.id)) {
      line.classList.add('edge-route');
      line.setAttribute('stroke-width', 6);
      line.setAttribute('opacity', '1');
    } else if (edge.type === 'bridge_link') {
      line.classList.add('edge-bridge');
    } else if (edge.confidence === 'high') {
      line.classList.add('edge-high-confidence');
    } else {
      line.classList.add('edge-low-confidence');
    }
    edgeFragment.appendChild(line);
  });

  routeEdges
    .filter((edge) => {
      const fromNode = state.graph.nodes[edge.from];
      const toNode = state.graph.nodes[edge.to];
      if (!fromNode || !toNode) {
        return false;
      }
      return fromNode.level === state.currentFloor || toNode.level === state.currentFloor;
    })
    .forEach((edge) => {
      const fromNode = state.graph.nodes[edge.from];
      const toNode = state.graph.nodes[edge.to];
      if (!fromNode || !toNode) {
        return;
      }
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', fromNode.x);
      line.setAttribute('y1', fromNode.y);
      line.setAttribute('x2', toNode.x);
      line.setAttribute('y2', toNode.y);
      line.classList.add('edge-line', 'edge-route');
      line.setAttribute('stroke-width', 6);
      line.setAttribute('opacity', '1');
      edgeFragment.appendChild(line);
    });

  mapSvg.appendChild(edgeFragment);

  const nodeFragment = document.createDocumentFragment();
  nodes.forEach((node) => {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('transform', `translate(${node.x}, ${node.y})`);

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const isBridge = node.type === 'bridge';
    const isUser = node.type === 'user';
    const isRouteNode = routeNodeIds.has(node.id);
    const isHighlighted = highlightedSearchIds.has(node.id);
    circle.setAttribute('r', 12);
    circle.setAttribute('class', `node-circle ${isBridge ? 'bridge-node' : ''} ${isUser ? 'user-node' : ''} ${isRouteNode ? 'route-node' : ''}`);
    circle.setAttribute('fill', isUser ? '#bfdbfe' : isRouteNode ? '#fee2e2' : isBridge ? '#fde68a' : '#ffffff');
    circle.setAttribute('stroke', isUser ? '#2563eb' : isRouteNode ? '#b91c1c' : isBridge ? '#d97706' : '#0f172a');
    group.appendChild(circle);
    if (isHighlighted) {
      group.classList.add('search-highlight');
    }

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('y', -16);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', 'node-label');
    text.textContent = node.shortLabel;
    group.appendChild(text);

    nodeFragment.appendChild(group);
  });

  mapSvg.appendChild(nodeFragment);
}

function renderRoute(route, mode) {
  instructions.innerHTML = '';
  routeSummary.innerHTML = '';
  routeMeta.innerHTML = '';

  if (!route) {
    routeSummary.textContent = 'No route found.';
    return;
  }

  const distanceMeters = route.cost.distance.toFixed(0);
  const durationMinutes = (route.cost.time / 60).toFixed(1);

  routeSummary.innerHTML = `Route found: <strong>${distanceMeters} m</strong>, <strong>${durationMinutes} min</strong> (${mode}).`;

  const coveredCount = route.edges.filter((edge) => edge.covered).length;
  const coveredRate = ((coveredCount / route.edges.length) * 100).toFixed(0);

  const crowdedHints = route.edges
    .filter((edge) => edge.crowded)
    .map((edge) => `${edge.label} may be busy during peak hours`);

  routeMeta.innerHTML = `Weather: ${coveredRate}% covered route. ${crowdedHints.length ? crowdedHints.join(' ') : 'No crowdedness warnings for this route.'}`;

  route.edges.forEach((edge, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${edge.label}</strong>: ${edge.description} — ${edge.distance}m, ${edge.estimatedTime.toFixed(0)}s`;
    instructions.appendChild(li);
  });
}

function isShopNode(node) {
  return node?.type === 'shop';
}

function distanceBetweenPoints(pointA, pointB) {
  return Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y);
}

function hasGraphAdjacency(graph, nodeId) {
  return Boolean(graph.adjacency[nodeId]?.length);
}

function getRouteNodeLabel(node) {
  return node?.label || node?.shortLabel || node?.id || 'Location';
}

function getManualFloorplanPoint(node) {
  if (!node) {
    return null;
  }

  const labelKeys = [node.shortLabel, node.label].filter(Boolean);
  const layouts = FLOORPLAN_LABEL_LAYOUTS[node.level] || {};
  for (const key of labelKeys) {
    const layout = layouts[key];
    if (layout?.x !== undefined && layout?.y !== undefined) {
      return { x: layout.x, y: layout.y, precise: true };
    }
  }

  if (node.lon !== undefined && node.lat !== undefined) {
    const point = lonLatToFloorplanPoint(node.lon, node.lat);
    return { ...point, precise: true };
  }

  if (node.x !== undefined && node.y !== undefined) {
    const point = mapGraphPointToFloorplan(node);
    return { ...point, precise: false };
  }

  return null;
}

function findNearestCorridorNode(config, point) {
  let bestKey = null;
  let bestDistance = Infinity;

  Object.entries(config.corridorNodes).forEach(([key, corridorPoint]) => {
    const distance = distanceBetweenPoints(point, corridorPoint);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestKey = key;
    }
  });

  return bestKey;
}

function buildSyntheticIfcAccess(node, config, role) {
  const overrides = config.shopDoors?.[node.id];
  const label = getRouteNodeLabel(node);
  if (overrides) {
    return {
      x: overrides.x,
      y: overrides.y,
      corridorNode: overrides.corridorNode,
      exitLabel: overrides.exitLabel || `Exit ${label} to the mall corridor`,
      enterLabel: overrides.enterLabel || `Enter ${label} from the mall corridor`,
      precise: true,
    };
  }

  const point = getManualFloorplanPoint(node);
  if (!point || point.x === undefined || point.y === undefined) {
    return null;
  }

  const corridorNode = findNearestCorridorNode(config, point);
  if (!corridorNode) {
    return null;
  }

  const corridorPoint = config.corridorNodes[corridorNode];
  const usePoint = point.precise ? { x: point.x, y: point.y } : corridorPoint;
  const isShop = node.type === 'shop';
  const exitPrefix = isShop ? 'Exit' : 'Join';
  const enterPrefix = isShop ? 'Enter' : 'Reach';
  return {
    x: usePoint.x,
    y: usePoint.y,
    corridorNode,
    exitLabel: `${exitPrefix} ${label} to the mall corridor`,
    enterLabel: `${enterPrefix} ${label} from the mall corridor`,
    precise: point.precise,
  };
}

function buildIfcFloorRoute(graph, startId, endId, mode) {
  const startNode = graph.nodes[startId];
  const endNode = graph.nodes[endId];
  if (!startNode || !endNode || startNode.level !== endNode.level) {
    return null;
  }

  const config = IFC_FLOOR_ROUTE_CONFIG[startNode.level];
  if (!config) {
    return null;
  }

  const startDoor = buildSyntheticIfcAccess(startNode, config, 'start');
  const endDoor = buildSyntheticIfcAccess(endNode, config, 'end');
  if (!startDoor || !endDoor) {
    return null;
  }

  const corridorPath = findIfcCorridorPath(config, startDoor.corridorNode, endDoor.corridorNode);
  if (!corridorPath.length) {
    return null;
  }

  const floorplanSegments = [];
  const routeEdges = [];
  let totalDistance = 0;

  const pushSegment = (fromPoint, toPoint, label, description) => {
    const distance = distanceBetweenPoints(fromPoint, toPoint);
    totalDistance += distance;
    if (distance > 0.5) {
      floorplanSegments.push({ x1: fromPoint.x, y1: fromPoint.y, x2: toPoint.x, y2: toPoint.y });
    }
    routeEdges.push({
      id: `ifc_manual_${routeEdges.length}`,
      from: label,
      to: description,
      label,
      description,
      distance: distance.toFixed(0),
      estimatedTime: distance / 1.4,
      covered: true,
      crowded: false,
    });
  };

  const startCorridorPoint = config.corridorNodes[startDoor.corridorNode];
  const endCorridorPoint = config.corridorNodes[endDoor.corridorNode];

  pushSegment(startDoor, startCorridorPoint, startNode.label || startNode.shortLabel || 'Start', startDoor.exitLabel);

  for (let index = 0; index < corridorPath.length - 1; index += 1) {
    const fromKey = corridorPath[index];
    const toKey = corridorPath[index + 1];
    const fromPoint = config.corridorNodes[fromKey];
    const toPoint = config.corridorNodes[toKey];
    pushSegment(fromPoint, toPoint, 'Corridor', 'Follow the main corridor');
  }

  pushSegment(endCorridorPoint, endDoor, endNode.label || endNode.shortLabel || 'Destination', endDoor.enterLabel);

  return {
    edges: routeEdges,
    cost: {
      distance: totalDistance,
      time: totalDistance / 1.4,
    },
    floorplanSegments: {
      [startNode.level]: floorplanSegments,
    },
  };
}

function findIfcCorridorPath(config, startKey, endKey) {
  if (startKey === endKey) {
    return [startKey];
  }

  const adjacency = config.corridorEdges.reduce((map, [from, to]) => {
    map[from] = map[from] || [];
    map[to] = map[to] || [];
    map[from].push(to);
    map[to].push(from);
    return map;
  }, {});

  const queue = [[startKey]];
  const visited = new Set([startKey]);
  while (queue.length) {
    const path = queue.shift();
    const current = path[path.length - 1];
    for (const next of adjacency[current] || []) {
      if (visited.has(next)) {
        continue;
      }
      const nextPath = [...path, next];
      if (next === endKey) {
        return nextPath;
      }
      visited.add(next);
      queue.push(nextPath);
    }
  }

  return [];
}

function findRoute(graph, startId, endId, mode) {
  const startNode = graph.nodes[startId];
  const endNode = graph.nodes[endId];
  const canUseIfcFallback =
    startNode &&
    endNode &&
    startNode.level === endNode.level &&
    IFC_FLOOR_ROUTE_CONFIG[startNode.level] &&
    (!hasGraphAdjacency(graph, startId) || !hasGraphAdjacency(graph, endId));

  const ifcRoute = canUseIfcFallback ? buildIfcFloorRoute(graph, startId, endId, mode) : null;
  if (ifcRoute) {
    return ifcRoute;
  }

  const open = new PriorityQueue((a, b) => a.priority - b.priority);
  const costs = {};
  const cameFrom = {};

  costs[startId] = { distance: 0, time: 0 };
  open.enqueue({ id: startId, priority: heuristic(startNode, endNode, mode) });

  while (!open.isEmpty()) {
    const current = open.dequeue();
    if (current.id === endId) {
      return reconstructRoute(graph, cameFrom, endId, costs[endId]);
    }
    const neighbors = graph.adjacency[current.id] || [];
    neighbors.forEach((edge) => {
      const next = edge.to;
      const nextNode = graph.nodes[next];
      if (!nextNode) {
        return;
      }
      // Only allow shop nodes as start or destination; intermediate nodes should be corridors/waypoints.
      if (next !== endId && isShopNode(nextNode)) {
        return;
      }

      const costSoFar = costs[current.id];
      const candidate = {
        distance: costSoFar.distance + edge.distance,
        time: costSoFar.time + edge.estimatedTime,
      };
      const existing = costs[next];
      if (!existing || candidate[mode] < existing[mode]) {
        costs[next] = candidate;
        cameFrom[next] = edge;
        const priority = candidate[mode] + heuristic(nextNode, endNode, mode);
        open.enqueue({ id: next, priority });
      }
    });
  }

  return null;
}

function heuristic(nodeA, nodeB, mode) {
  const dx = nodeA.x - nodeB.x;
  const dy = nodeA.y - nodeB.y;
  const floorPenalty = Math.abs(nodeA.level - nodeB.level) * 25;
  const straightLine = Math.sqrt(dx * dx + dy * dy);
  if (mode === 'distance') {
    return straightLine + floorPenalty;
  }
  return straightLine * 1.1 + floorPenalty * 1.3;
}

function reconstructRoute(graph, cameFrom, endId, totalCost) {
  const edges = [];
  let current = endId;
  while (cameFrom[current]) {
    const edge = cameFrom[current];
    edges.push(edge);
    current = edge.from;
  }
  edges.reverse();
  return { edges, cost: totalCost };
}

class PriorityQueue {
  constructor(comparator) {
    this.items = [];
    this.comparator = comparator;
  }

  enqueue(value) {
    this.items.push(value);
    this.items.sort(this.comparator);
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}
