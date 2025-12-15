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
