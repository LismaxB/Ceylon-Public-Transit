import React, { useEffect, useState } from "react";
import L, { LatLngExpression } from "leaflet";
import "leaflet-routing-machine";

interface RoutingProps {
  map: L.Map | null;
  waypoints: L.LatLng[];
}

interface RouteSummary {
  distance: number; // in meters
  duration: number; // in seconds
  steps: Array<{ instructions: string; distance: number }>;
}

const markericon = L.icon({
  iconUrl: "./images/icons/marker.webp",
  iconSize: [30, 30],
});

const RoutingPanel: React.FC<RoutingProps> = ({ map, waypoints }) => {
  const [summary, setSummary] = useState<RouteSummary | null>(null);

  useEffect(() => {
    if (!map || waypoints.length === 0) return;

    const routingControl = L.Routing.control({
      waypoints: waypoints,
      routeWhileDragging: false,
      addWaypoints: false,
      showAlternatives: false,
      show: false,
      lineOptions: {
        styles: [{ color: "#FF6666", weight: 4 }],
      },
      createMarker: function (
        i: number,
        waypoint: { latLng: LatLngExpression },
        nWps: number
      ) {
        let icon;
        if (i === 0 || i === nWps - 1) {
          // Start and end marker
          icon = markericon;
        } else {
          // Intermediate stop markers
          icon = L.icon({
            iconUrl: "./images/icons/stop.webp",
            iconSize: [15, 15], // Adjust icon size if needed
          });
        }
        return L.marker(waypoint.latLng, {
          draggable: false,
          icon: icon,
        });
      },
    }).addTo(map);

    routingControl.on("routesfound", function (e: any) {
      const route = e.routes[0];
      const steps = route.instructions.map((step: any) => ({
        instructions: step.text,
        distance: step.distance,
      }));

      setSummary({
        distance: route.summary.totalDistance,
        duration: route.summary.totalTime,
        steps: steps,
      });
    });

    return () => {
      if (routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, waypoints]);

  if (!summary) {
    return <div>No Route Found</div>;
  }

  const formatDistance = (meters: number) => {
    return (meters / 1000).toFixed(2) + " km";
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <div className="routing-panel max-w-[600px]">
      <h2>Route Summary</h2>
      <p>Distance: {formatDistance(summary.distance)}</p>
      <p>Duration: {formatDuration(summary.duration)}</p>
      <h3>Steps:</h3>
      <ul>
        {summary.steps.map((step, index) => (
          <li key={index}>
            {step.instructions} ({formatDistance(step.distance)})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoutingPanel;
