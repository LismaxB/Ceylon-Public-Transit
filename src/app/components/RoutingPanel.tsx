import React, { useEffect, useState } from "react";
import L, { LatLngExpression } from "leaflet";
import "leaflet-routing-machine";
import { supabase } from "../supabaseClient";

//Styles
import { Separator } from "@/components/ui/separator";
import styles from "./styles/Map.module.css";

interface RoutingProps {
  map: L.Map | null;
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

const RoutingPanel: React.FC<RoutingProps> = ({ map }) => {
  const [summary, setSummary] = useState<RouteSummary | null>(null);
  const [routes, setRoutes] = useState<
    {
      route_id: string;
      route_name: string;
      AtoBstops: { latitude: number; longitude: number }[];
    }[]
  >([]);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [waypoints, setWaypoints] = useState<L.LatLng[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch routes from Supabase
    const fetchRoutes = async () => {
      const { data, error } = await supabase.from("Routes").select("*");

      if (error) {
        console.error("Error fetching routes:", error);
      } else {
        setRoutes(data);
      }
      setLoading(false);
    };

    fetchRoutes();
  }, []);

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
          icon = markericon;
        } else {
          icon = L.icon({
            iconUrl: "./images/icons/stop.webp",
            iconSize: [15, 15],
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

  const handleRouteChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const routeId = event.target.value;
    setSelectedRoute(routeId);

    // Find the selected route in the fetched routes
    const selected = routes.find((route) => route.route_id === routeId);
    if (selected && selected.AtoBstops) {
      const newWaypoints = selected.AtoBstops.map(
        (stop: { latitude: number; longitude: number }) => {
          return L.latLng(stop.latitude, stop.longitude);
        }
      );
      setWaypoints(newWaypoints);
    }
  };

  return (
    <div className={styles.routingPanel}>
      <div className={styles.routingPanelCard}>
        <h2 className="font-bold">Select a route</h2>
        <select value={selectedRoute || ""} onChange={handleRouteChange}>
          <option value="" disabled>
            Select a route
          </option>
          {routes.map((route) => (
            <option key={route.route_id} value={route.route_id}>
              {route.route_name}
            </option>
          ))}
        </select>
      </div>

      {summary && (
        <div className={styles.routeSummaryCard}>
          <h2 className="font-bold">Route Summary</h2>
          <p className={styles.routeBadge}>
            Distance: {formatDistance(summary.distance)}
          </p>
          <p className={styles.routeBadge}>
            Duration: {formatDuration(summary.duration)}
          </p>
          <div className="h-80 overflow-y-scroll">
            <h3>Steps:</h3>
            <ul>
              {summary.steps.map((step, index) => (
                <li key={index}>
                  {step.instructions} ({formatDistance(step.distance)})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {!summary && !loading && selectedRoute && <div>No Route Found</div>}
      <div className={styles.routingPanelFooter}>
        <Separator />
        <a href="https://github.com/LismaxB/Ceylon-Public-Transit/releases/tag/v0.5.1-beta">
          v0.5.1-beta
        </a>
      </div>
    </div>
  );
};

const formatDistance = (meters: number) => {
  return (meters / 1000).toFixed(2) + " km";
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor((seconds / 60) * 2);
  return `${minutes} min`;
};

export default RoutingPanel;
