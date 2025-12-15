"use client";

import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import type { Spot, Course, Category } from "../data";
import { getCourseCoordinates } from "../data";
import { fetchCourseRoute } from "../lib/routing";

// Create custom icon using spot images
// Uses course-specific icon if a course is selected, otherwise uses _map icon
function createSpotIcon(spot: Spot, selectedCourse: Course | null): L.Icon {
  const spotId = String(spot.id).padStart(2, "0");
  
  // Determine which icon to use
  let iconFileName: string;
  if (selectedCourse) {
    // Use course-specific icon
    iconFileName = `${spotId}_course ${selectedCourse.id}.png`;
  } else {
    // Use default map icon
    iconFileName = `${spotId}_map.png`;
  }

  return L.icon({
    iconUrl: `/images/${iconFileName}`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
}

interface MapContentProps {
  spots: Spot[];
  selectedCourse: Course | null;
  onSpotClick?: (spot: Spot) => void;
  highlightedSpotId?: number | null;
}

export default function MapContent({
  spots,
  selectedCourse,
  onSpotClick,
  highlightedSpotId,
}: MapContentProps) {
  // Center map on Nasu area (based on real coordinates spread)
  const center: [number, number] = [37.058, 140.005];

  // Nasu Town map bounds - tightly restricted to tourism area only
  const nasuBounds: L.LatLngBoundsExpression = [
    [37.005, 139.955], // Southwest corner
    [37.110, 140.060], // Northeast corner
  ];

  // Filter spots to only show those in the selected course
  const visibleSpots = useMemo(() => {
    if (!selectedCourse) {
      // No course selected - show all spots
      return spots;
    }
    // Only show spots that are part of the selected course
    return spots.filter((spot) => selectedCourse.spotIds.includes(spot.id));
  }, [spots, selectedCourse]);

  // State for the actual routed path
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Get waypoint coordinates for selected course
  const courseWaypoints = selectedCourse
    ? getCourseCoordinates(selectedCourse)
    : [];

  // Fetch actual route when course changes
  useEffect(() => {
    if (!selectedCourse || courseWaypoints.length < 2) {
      setRouteCoordinates([]);
      return;
    }

    let cancelled = false;
    setIsLoadingRoute(true);

    fetchCourseRoute(courseWaypoints)
      .then((coords) => {
        if (!cancelled) {
          setRouteCoordinates(coords);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch route:", error);
        if (!cancelled) {
          // Fallback to straight lines if routing fails
          setRouteCoordinates(courseWaypoints);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingRoute(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedCourse?.id]); // Only re-fetch when course ID changes

  return (
    <MapContainer
      center={center}
      zoom={13}
      minZoom={12}
      maxZoom={18}
      maxBounds={nasuBounds}
      maxBoundsViscosity={1.0}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      attributionControl={false}
    >
      {/* 
        For English labels, use Mapbox with your access token:
        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
        
        Currently using OpenStreetMap with English-preferred rendering from OSM France
      */}
      {/* OpenStreetMap Standard - Most up-to-date OSM data, same source as OSRM routing */}
      <TileLayer
        attribution=""
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      {/* Render course polyline with actual road route */}
      {selectedCourse && routeCoordinates.length > 1 && (
        <Polyline
          positions={routeCoordinates}
          pathOptions={{
            color: selectedCourse.color,
            weight: 5,
            opacity: 0.85,
            lineCap: "round",
            lineJoin: "round",
          }}
        />
      )}

      {/* Show loading indicator as dashed line while route loads */}
      {selectedCourse && isLoadingRoute && courseWaypoints.length > 1 && (
        <Polyline
          positions={courseWaypoints}
          pathOptions={{
            color: selectedCourse.color,
            weight: 3,
            opacity: 0.4,
            dashArray: "5, 10",
          }}
        />
      )}

      {/* Render spot markers - only visible spots based on selected course */}
      {visibleSpots.map((spot) => (
        <Marker
          key={spot.id}
          position={[spot.lat, spot.lng]}
          icon={createSpotIcon(spot, selectedCourse)}
          eventHandlers={{
            click: () => onSpotClick?.(spot),
          }}
        >
          <Popup>
            <div className="min-w-[150px]">
              <h3 className="font-semibold text-sm">{spot.name}</h3>
              <p className="text-xs text-gray-500">#{spot.id}</p>
              {spot.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {spot.categories.map((cat) => (
                    <span
                      key={cat}
                      className="text-xs px-2 py-0.5 rounded-full capitalize"
                      style={{
                        backgroundColor:
                          cat === "gourmet"
                            ? "#fed7aa"
                            : cat === "activity"
                            ? "#bbf7d0"
                            : cat === "tourism"
                            ? "#bfdbfe"
                            : "#fecaca",
                        color:
                          cat === "gourmet"
                            ? "#c2410c"
                            : cat === "activity"
                            ? "#15803d"
                            : cat === "tourism"
                            ? "#1d4ed8"
                            : "#b91c1c",
                      }}
                    >
                      {cat === "hotspring" ? "Hot Spring" : cat}
                    </span>
                  ))}
                </div>
              )}
              {spot.isBusStop && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 mt-2 inline-block">
                  Bus Stop
                </span>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
