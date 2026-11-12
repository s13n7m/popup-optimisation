export interface DataSource {
  id: string;
  name: string;
  role: string;
  cost: string;
  gives: string[];
  steps: string[];
  code?: { lang: string; text: string };
  catches: string[];
  docs: { label: string; url: string };
  feeds: string;
}

// Written from memory. Check each docs link for current endpoints, field names, limits and licence terms before relying on it.
export const dataSources: DataSource[] = [
  {
    id: 'overture', name: 'Overture Maps Places', role: 'Base venue list', cost: 'Free, open data',
    gives: ['Place id, name, category, address, coordinates', 'A confidence score per place', 'Global coverage in one schema'],
    steps: [
      'Install the command line tool: pip install overturemaps.',
      'Work out a bounding box (west, south, east, north) for each city in your markets table.',
      'Download places as geoparquet for that box.',
      'Open the file with pandas or DuckDB, inspect the schema (category field names change between releases) and keep malls, retail parks, supermarkets and car parks.',
      'Drop rows with low confidence and de-duplicate by name and distance.',
    ],
    code: { lang: 'bash', text: 'pip install overturemaps\noverturemaps download --bbox=-0.5,51.3,0.3,51.7 -f geoparquet --type=place -o london_places.parquet' },
    catches: ['No footfall, rating or price data.', 'Category names differ between releases, so read the schema first.'],
    docs: { label: 'docs.overturemaps.org', url: 'https://docs.overturemaps.org/' },
    feeds: 'venue_id, name, category, lat, lng',
  },
  {
    id: 'foursquare', name: 'Foursquare OS Places', role: 'Cross-check and categories', cost: 'Free, open data',
    gives: ['Name, address, coordinates', 'Detailed category labels', 'Country and region fields'],
    steps: [
      'Create a Hugging Face account and accept the dataset terms for foursquare/fsq-os-places.',
      'Download the parquet files for the latest release with huggingface_hub or the CLI.',
      'Filter by country and bounding box, then match to your Overture venues by name and distance.',
      'Use it to confirm a venue exists and to fill missing categories.',
    ],
    code: { lang: 'bash', text: 'pip install huggingface_hub\nhuggingface-cli login\nhuggingface-cli download foursquare/fsq-os-places --repo-type dataset --local-dir fsq' },
    catches: ['Optional. The base list works without it.', 'File layout changes with each release, so list the folder before filtering.'],
    docs: { label: 'Foursquare open source places', url: 'https://docs.foursquare.com/data-products/docs/fsq-places-open-source' },
    feeds: 'category, de-duplication',
  },
  {
    id: 'osm', name: 'OpenStreetMap via Overpass', role: 'Parking capacity and Tesla stores', cost: 'Free, share-alike licence',
    gives: ['Malls, retail parks and car parks with footprints', 'Parking capacity where mapped', 'Tesla showrooms tagged with brand=Tesla'],
    steps: [
      'Pick one city at a time and use its bounding box (south, west, north, east).',
      'Send the query below to the public Overpass endpoint.',
      'Save the json, then flatten tags into columns: name, capacity, brand.',
      'Keep the Tesla rows as your store list for the distance calculation.',
      'Credit OpenStreetMap contributors wherever you show the data.',
    ],
    code: { lang: 'text', text: '[out:json][timeout:90];\n(\n  nwr["shop"="mall"](51.3,-0.5,51.7,0.3);\n  nwr["amenity"="parking"]["capacity"](51.3,-0.5,51.7,0.3);\n  nwr["shop"="car"]["brand"="Tesla"](51.3,-0.5,51.7,0.3);\n);\nout center tags;\n\n# POST it as data=... to https://overpass-api.de/api/interpreter' },
    catches: ['Coverage varies by country. Check Tesla results against the real store list.', 'Keep requests small and polite. Do not query whole countries.'],
    docs: { label: 'Overpass API on the OSM wiki', url: 'https://wiki.openstreetmap.org/wiki/Overpass_API' },
    feeds: 'parking, store coordinates for dist_to_store_km',
  },
  {
    id: 'eurostat', name: 'Eurostat (and ONS for the UK)', role: 'Population density and income by area', cost: 'Free',
    gives: ['Population density by NUTS region', 'Household income by region', 'Region boundaries from GISCO'],
    steps: [
      'Download NUTS boundaries from Eurostat GISCO as geojson.',
      'Use geopandas to place each venue inside a NUTS3 region (point in polygon).',
      'Fetch density (dataset demo_r_d3dens) and household income (dataset nama_10r_2hhinc, a coarser NUTS2 level) from the Eurostat API and join on the region code.',
      'Eurostat has little current UK data after Brexit. Take UK density and income from ONS or Nomis and map them to the same columns.',
    ],
    code: { lang: 'text', text: 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_r_d3dens?format=JSON&lang=EN&time=2022' },
    catches: ['Income is regional, so every venue in a region shares a value. That is fine for a first model.', 'Dataset codes and parameters change. Confirm them in the Eurostat data browser.'],
    docs: { label: 'Eurostat web services', url: 'https://ec.europa.eu/eurostat/web/main/data/web-services' },
    feeds: 'pop_density, avg_income',
  },
  {
    id: 'osrm', name: 'OSRM or OpenRouteService', role: 'Drive distance to the nearest store', cost: 'Free demo server, key for ORS',
    gives: ['Drive distance and time between two points'],
    steps: [
      'Compute straight-line (haversine) distance to every Tesla store first.',
      'For the nearest one or two stores only, call the route service for drive distance.',
      'Store dist_to_store_km as the drive distance when you have it, otherwise the straight-line value.',
    ],
    code: { lang: 'bash', text: 'curl "http://router.project-osrm.org/route/v1/driving/-0.12,51.5;-0.2,51.51?overview=false"\n# coordinates are longitude,latitude' },
    catches: ['The public OSRM demo server is not for bulk use. Self-host it or use OpenRouteService with a key for large runs.'],
    docs: { label: 'Project OSRM', url: 'http://project-osrm.org/' },
    feeds: 'dist_to_store_km',
  },
  {
    id: 'ticketmaster', name: 'Ticketmaster Discovery API', role: 'Local events', cost: 'Free tier with rate limits',
    gives: ['Events near a point and date range', 'Venue and category for each event'],
    steps: [
      'Register on the Ticketmaster developer site and copy your API key.',
      'For each venue and week, ask for events within a few kilometres.',
      'Set local_event to 1 when at least one event falls in that week.',
      'Save responses so you never call twice for the same week and venue.',
    ],
    code: { lang: 'bash', text: 'curl "https://app.ticketmaster.com/discovery/v2/events.json?apikey=$TM_KEY&latlong=51.5,-0.12&radius=5&unit=km&startDateTime=2026-11-16T00:00:00Z&endDateTime=2026-11-23T00:00:00Z"' },
    catches: ['Coverage is uneven across EMEA countries.', 'Past events are limited, so your history weeks may need simulated events.'],
    docs: { label: 'Ticketmaster developer docs', url: 'https://developer.ticketmaster.com/' },
    feeds: 'local_event in weekly.parquet',
  },
  {
    id: 'besttime', name: 'BestTime.app', role: 'Footfall signal', cost: 'Paid, credit based',
    gives: ['Hourly busyness forecast for a named venue', 'Peak hours and quiet hours'],
    steps: [
      'Sign up and copy the private API key.',
      'Submit venue name and address for your shortlist only, because each new forecast uses credits.',
      'Collapse the weekly busyness curve into one footfall index from 0 to 100.',
      'Record where each footfall value came from.',
    ],
    code: { lang: 'bash', text: 'curl -X POST "https://besttime.app/api/v1/forecasts" \\\n  -d "api_key_private=$BESTTIME_KEY" \\\n  -d "venue_name=Example Shopping Centre" \\\n  -d "venue_address=1 Example Street, London"' },
    catches: ['Not every venue is covered.', 'Cost grows with venue count, so use it on the shortlist, not all 3,400.'],
    docs: { label: 'BestTime API docs', url: 'https://besttime.app/api/v1/docs' },
    feeds: 'footfall',
  },
  {
    id: 'google', name: 'Google Places API (New)', role: 'Ratings and review counts, runtime lookups', cost: 'Paid per request, with a free allowance',
    gives: ['Name, address, coordinates and types', 'Rating and review count', 'Opening hours'],
    steps: [
      'In Google Cloud, enable Places API (New) and create an API key.',
      'Restrict the key to that API and set a budget alert before first use.',
      'Always send a field mask, so you pay only for fields you use.',
      'Use review count and rating as a footfall proxy for shortlisted venues.',
      'Check current terms before storing results. Storing place ids is generally allowed, caching other fields is limited.',
    ],
    code: { lang: 'bash', text: 'curl -X POST https://places.googleapis.com/v1/places:searchNearby \\\n  -H "Content-Type: application/json" \\\n  -H "X-Goog-Api-Key: $GOOGLE_PLACES_KEY" \\\n  -H "X-Goog-FieldMask: places.id,places.displayName,places.location,places.rating,places.userRatingCount,places.types" \\\n  -d \'{"includedTypes":["shopping_mall"],"maxResultCount":20,"locationRestriction":{"circle":{"center":{"latitude":51.5,"longitude":-0.12},"radius":5000}}}\'' },
    catches: ['The API does not return popular-times data.', 'Terms limit storing and caching, so use it live on a shortlist, not as your base table.'],
    docs: { label: 'Places API documentation', url: 'https://developers.google.com/maps/documentation/places/web-service' },
    feeds: 'footfall proxy (rating, review count)',
  },
];

export const venueColumns: { column: string; source: string; note: string }[] = [
  { column: 'venue_id, name, lat, lng', source: 'Overture Maps', note: 'Cross-check with Foursquare OS Places' },
  { column: 'market', source: 'Your markets table', note: 'Country or city of the bounding box' },
  { column: 'footfall', source: 'BestTime, Google review count', note: 'Shortlist only for paid sources' },
  { column: 'pop_density', source: 'Eurostat, ONS for UK', note: 'Joined through NUTS3 region' },
  { column: 'avg_income', source: 'Eurostat, ONS for UK', note: 'Regional, so shared within a region' },
  { column: 'dist_to_store_km', source: 'OSM Tesla sites plus OSRM', note: 'Straight-line first, drive distance for the shortlist' },
  { column: 'cost_per_week', source: 'Your own estimate', note: 'No API provides it. Document the formula' },
  { column: 'local_event (weekly)', source: 'Ticketmaster', note: 'Cache by venue and week' },
  { column: 'completions (weekly)', source: 'Simulated', note: 'Generated from the real features with a hidden true rate' },
];
