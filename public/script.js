let map;
let geocoder;
let userPin = null;
let answerPin = null;
let userLocation = null;
let currentQuizNumber = null;
let totalDistance = 0;
let searchMarker = null;
let distanceCalculated = false;

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

    userLocation = { lat: latitude, lng: longitude };
  });

  document.getElementById('reset-button').addEventListener('click', resetGame);
  document.getElementById('restart-button').addEventListener('click', restartGame);
  document.getElementById('ok-button').addEventListener('click', confirmQuizNumber);
  document.getElementById('confirm-pin-button').addEventListener('click', confirmPin);
  document.getElementById('search-button').addEventListener('click', searchLocation);
  
  toggleButtons('init');
  const locationInput = document.getElementById('location-input');
  locationInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      searchLocation();
    }
  });
  document.getElementById('quiz-input').addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      confirmQuizNumber();
    }
  });
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

function resetGame() { /* 省略：リセットの機能 */ }
function restartGame() { /* 省略：再スタートの機能 */ }
function confirmQuizNumber() { /* 省略：クイズ番号を確認する機能 */ }
function confirmPin() { /* 省略：ピンを確認する機能 */ }
function calculateDistance(userLat, userLng, answerLat, answerLng) { /* 省略：距離計算の機能 */ }
function toggleButtons(action) { /* 省略：ボタンの有効・無効設定 */ }
function clearPins() { /* 省略：ピンの削除 */ }

window.onload = initMap;
