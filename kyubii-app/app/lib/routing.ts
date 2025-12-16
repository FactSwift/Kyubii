// OSRM Routing Service for fetching actual road routes
// Uses the free OSRM demo server - for production, consider self-hosting or using a paid service

export interface RouteResult {
  coordinates: [number, number][];
  distance: number; // in meters
  duration: number; // in seconds
}

// Cache for route results to avoid repeated API calls
const routeCache = new Map<string, RouteResult>();

/**
 * Fetch route between multiple waypoints using OSRM
 * @param waypoints Array of [lat, lng] coordinates
 * @returns Promise with route geometry coordinates
 */
export async function fetchRoute(
  waypoints: [number, number][]
): Promise<RouteResult | null> {
  if (waypoints.length < 2) return null;

  // Create cache key from waypoints
  const cacheKey = waypoints.map((w) => `${w[0]},${w[1]}`).join("|");
  
  // Check cache first
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey)!;
  }

  try {
    // OSRM expects coordinates as lng,lat (opposite of Leaflet's lat,lng)
    const coordinatesStr = waypoints
      .map((wp) => `${wp[1]},${wp[0]}`)
      .join(";");

    // Use OSRM demo server - for production, use your own instance
    const url = `https://router.project-osrm.org/route/v1/driving/${coordinatesStr}?overview=full&geometries=geojson`;

    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn("OSRM request failed:", response.status);
      return null;
    }

    const data = await response.json();

    if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
      console.warn("OSRM returned no routes:", data.code);
      return null;
    }

    const route = data.routes[0];
    
    // Convert GeoJSON coordinates [lng, lat] to Leaflet [lat, lng]
    const coordinates: [number, number][] = route.geometry.coordinates.map(
      (coord: [number, number]) => [coord[1], coord[0]]
    );

    const result: RouteResult = {
      coordinates,
      distance: route.distance,
      duration: route.duration,
    };

    // Cache the result
    routeCache.set(cacheKey, result);

    return result;
  } catch (error) {
    console.error("Error fetching route:", error);
    return null;
  }
}

/**
 * Fetch route for a bus course (batches waypoints to avoid API limits)
 * OSRM has a limit on waypoints, so we may need to split long routes
 */
export async function fetchCourseRoute(
  waypoints: [number, number][]
): Promise<[number, number][]> {
  if (waypoints.length < 2) return waypoints;

  // OSRM demo server has a limit of ~100 waypoints
  // For longer routes, we batch requests
  const MAX_WAYPOINTS = 25;
  
  if (waypoints.length <= MAX_WAYPOINTS) {
    const result = await fetchRoute(waypoints);
    return result?.coordinates ?? waypoints;
  }

  // Split into batches with overlapping endpoints
  const allCoordinates: [number, number][] = [];
  
  for (let i = 0; i < waypoints.length - 1; i += MAX_WAYPOINTS - 1) {
    const batch = waypoints.slice(i, i + MAX_WAYPOINTS);
    
    if (batch.length < 2) break;
    
    const result = await fetchRoute(batch);
    
    if (result?.coordinates) {
      // Skip first point if not first batch (to avoid duplicates)
      const startIndex = i === 0 ? 0 : 1;
      allCoordinates.push(...result.coordinates.slice(startIndex));
    } else {
      // Fallback to straight lines for this segment
      const startIndex = i === 0 ? 0 : 1;
      allCoordinates.push(...batch.slice(startIndex));
    }
  }

  return allCoordinates.length > 0 ? allCoordinates : waypoints;
}

/**
 * Clear the route cache (useful when coordinates change)
 */
export function clearRouteCache(): void {
  routeCache.clear();
}

/**
 * Estimate travel time between two points based on straight-line distance
 * Uses a conservative estimate assuming average speed of 30 km/h in mountainous Nasu area
 * @param lat1 Starting latitude
 * @param lng1 Starting longitude
 * @param lat2 Ending latitude
 * @param lng2 Ending longitude
 * @returns Estimated travel time in minutes
 */
export function estimateTravelTime(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  // Haversine formula for distance
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineDistance = R * c;
  
  // Road distance is typically 1.3-1.5x straight line distance in mountainous areas
  const roadDistanceMultiplier = 1.4;
  const estimatedRoadDistance = straightLineDistance * roadDistanceMultiplier;
  
  // Average speed in Nasu (mountainous roads, traffic): 30 km/h
  const averageSpeedKmh = 30;
  
  // Convert to minutes
  const travelTimeMinutes = (estimatedRoadDistance / averageSpeedKmh) * 60;
  
  // Minimum 5 minutes for any trip (parking, etc.)
  return Math.max(5, Math.round(travelTimeMinutes));
}

/**
 * Fetch actual travel time between two points using OSRM
 * Falls back to estimation if API fails
 */
export async function fetchTravelTime(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): Promise<number> {
  const result = await fetchRoute([[lat1, lng1], [lat2, lng2]]);
  
  if (result) {
    // OSRM returns duration in seconds, convert to minutes
    return Math.ceil(result.duration / 60);
  }
  
  // Fallback to estimation
  return estimateTravelTime(lat1, lng1, lat2, lng2);
}

/**
 * Calculate total travel time for a sequence of spots
 * @param spots Array of spots with lat/lng coordinates
 * @returns Total estimated travel time in minutes
 */
export function calculateTotalTravelTime(
  spots: { lat: number; lng: number }[]
): number {
  if (spots.length < 2) return 0;
  
  let totalTime = 0;
  for (let i = 0; i < spots.length - 1; i++) {
    totalTime += estimateTravelTime(
      spots[i].lat, spots[i].lng,
      spots[i + 1].lat, spots[i + 1].lng
    );
  }
  
  return totalTime;
}
