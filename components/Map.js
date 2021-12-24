import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

const myIcon = L.icon({
  iconUrl: '/icon-location.svg',
  iconSize: [46, 56],
  // iconAnchor: [22, 94],
  // popupAnchor: [-3, -76],
  // shadowUrl: 'my-icon-shadow.png',
  // shadowSize: [68, 95],
  // shadowAnchor: [22, 94]
});

// L.marker([50.505, 30.57], { icon: myIcon }).addTo(map);

function MyComponent({ userLocation, calcZoom }) {
  const map = useMap();
  map.flyTo(userLocation, calcZoom(), { duration: 5 });
  return null;
}

const Map = ({ currLocation: { lat, lon }, windowWidth }) => {
  const userLocation = [lat, lon];

  const calcZoom = () => {
    if (windowWidth >= 768 && windowWidth < 1368) return 16;
    // if (windowWidth >= 968 && windowWidth < 1200) return 19;
    // if (windowWidth >= 1200 && windowWidth < 1368) return 21;
    if (windowWidth >= 1368) return 17;
    return 14;
  };

  return (
    <MapContainer
      center={userLocation}
      zoom={calcZoom()}
      scrollWheelZoom={false}
      zoomControl={false}
      zoomAnimation={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2FsaTYzIiwiYSI6ImNrcmJrcXQ3dzR1YmYycG5scnc2em9lNDUifQ.YSx6RqdFFfMfj7aQFgZJ0A`}
        attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
      />
      <Marker
        position={userLocation}
        draggable={false}
        animate={true}
        icon={myIcon}
      ></Marker>
      <ZoomControl position='bottomright' />
      <MyComponent userLocation={userLocation} calcZoom={calcZoom} />
    </MapContainer>
  );
};

export default Map;
