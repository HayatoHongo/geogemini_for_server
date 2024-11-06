let map;
let geocoder;
let userPin = null;
let searchMarker = null;

function initMap() {
  const mapContainer = document.getElementById('map-container');
  map = new google.maps.Map(mapContainer, {
    center: { lat: 0, lng: 0 },
    zoom: 2,
    mapTypeId: 'satellite'
  });
  
  geocoder = new google.maps.Geocoder();

  google.maps.event.addListener(map, 'click', (event) => {
    const latitude = event.latLng.lat();
    const longitude = event.latLng.lng();

    if (userPin) {
      userPin.setMap(null);
    }
    userPin = new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map
    });
  });

  document.getElementById('search-button').addEventListener('click', searchLocation);
}

async function searchLocation() {
  const address = document.getElementById('location-input').value;
  try {
    const response = await fetch(`/api/location?address=${encodeURIComponent(address)}`);
    const data = await response.json();

    if (data.results && data.results[0]) {
      const location = data.results[0].geometry.location;
      map.setCenter(location);

      if (searchMarker) {
        searchMarker.setMap(null);
      }
      searchMarker = new google.maps.Marker({
        map: map,
        position: location,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
          scaledSize: new google.maps.Size(32, 32)
        }
      });
    } else {
      alert('Location not found.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to search location.');
  }
}

window.onload = () => {
  if (typeof google !== 'undefined') {
    initMap();
  }
};
