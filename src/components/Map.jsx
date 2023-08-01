import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import styles from "./Map.module.css";

//import countryFlagEmoji from "country-flag-emoji";
//import { DE } from "country-flag-icons/react/3x2";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useURLPosition } from "../hooks/useURLPosition";

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([48.864716, 2.349014]);
  const {
    isLoading: isLoadingPosition,
    position: geoPosition,
    getPosition,
  } = useGeolocation();

  const [mapLat, mapLng] = useURLPosition();

  // synchronise longatude and latitude state when it comes from the URL
  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  const thunderFTiles = [
    "atlas",
    "landscape",
    "neighbourhood",
    "outdoors",
    "pioneer",
    "mobile-atlas",
  ];
  const tfAPI = "2d6422de31704a078e8c2dc851e958bf";

  const mapTile1 = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";
  const mapTile2 = `https://tile.thunderforest.com/${thunderFTiles[1]}/{z}/{x}/{y}.png?apikey=${tfAPI}`;
  const mapTile3 = "http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png";
  const mapTile4 =
    "https://conze.pt/app/climate-data/data/meantemp/6/maptiles/{z}/{x}/{-y}.png";

  useEffect(
    function () {
      if (geoPosition) setMapPosition([geoPosition.lat, geoPosition.lng]);
    },
    [geoPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {!geoPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={mapTile1}
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCentre position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCentre({ position }) {
  // get the current instance of the map using Leaflet custom hook
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
