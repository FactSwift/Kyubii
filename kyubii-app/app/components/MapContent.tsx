"use client";

import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import type { Spot, Course, Category } from "../data";
import { getCourseCoordinates } from "../data";

// Fix Leaflet default icon issue with Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Category-colored custom markers using divIcon
function createCustomIcon(spot: Spot): L.DivIcon {
  const primaryCategory = spot.categories[0] as Category | undefined;
  const colorClass = spot.isBusStop
    ? "bus-stop"
    : primaryCategory || "";

  return L.divIcon({
    className: "custom-marker-wrapper",
    html: `<div class="custom-marker ${colorClass}">${spot.id}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
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
  const center: [number, number] = [37.055, 140.005];

  // Get polyline coordinates for selected course
  const courseCoordinates = selectedCourse
    ? getCourseCoordinates(selectedCourse)
    : [];

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      {/* 
        For English labels, use Mapbox with your access token:
        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
        
        Currently using OpenStreetMap with English-preferred rendering from OSM France
      */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />

      {/* Render course polyline */}
      {selectedCourse && courseCoordinates.length > 1 && (
        <Polyline
          positions={courseCoordinates}
          pathOptions={{
            color: selectedCourse.color,
            weight: 4,
            opacity: 0.8,
            dashArray: selectedCourse.id === "A" ? undefined : "10, 5",
          }}
        />
      )}

      {/* Render spot markers */}
      {spots.map((spot) => (
        <Marker
          key={spot.id}
          position={[spot.lat, spot.lng]}
          icon={createCustomIcon(spot)}
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
