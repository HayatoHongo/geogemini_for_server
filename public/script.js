let map;
let geocoder;
let userPin = null;
let answerPin = null;
let userLocation = null;
let currentQuizNumber = null;
let totalDistance = 0;
let searchMarker = null;
let distanceCalculated = false;

async function loadGoogleMapsScript() {
    try {
      const response = await fetch('/api/getGoogleMapsApiKey');
      
      if (!response.ok) {
        throw new Error('Failed to fetch the API key.');
      }
  
      const data = await response.json();
      
      if (data.apiKey) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      } else {
        console.error("API key is missing");
      }
    } catch (error) {
      console.error("Failed to load Google Maps script:", error);
      alert("Error: Unable to load Google Maps API.");
    }
  }
  

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

function resetGame() {
  clearPins();
  userLocation = null;
  currentQuizNumber = null;
  distanceCalculated = false;
  document.getElementById('quiz-input').value = '';
  document.getElementById('current-distance').textContent = '';
  document.getElementById('total-distance').textContent = 'Total 0 km';
  totalDistance = 0;
  toggleButtons('init');
}

function restartGame() {
  resetGame();
  alert("Game restarted!");
}

function confirmQuizNumber() {
  const quizInput = document.getElementById('quiz-input').value;
  if (quizInput) {
    currentQuizNumber = quizInput;
    alert(`Quiz Number ${currentQuizNumber} selected.`);
    toggleButtons('quizSelected');
  } else {
    alert("Please enter a quiz number.");
  }
}

function confirmPin() {
  if (userLocation && currentQuizNumber) {
    // Replace this with actual answer location retrieval based on currentQuizNumber.
    const answerLocation = { lat: -33.8569, lng: 151.2153 }; // Example location: Sydney Opera House

    answerPin = new google.maps.Marker({
      position: answerLocation,
      map: map,
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: new google.maps.Size(32, 32)
      }
    });

    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      answerLocation.lat,
      answerLocation.lng
    );
    
    distanceCalculated = true;
    totalDistance += distance;
    document.getElementById('current-distance').textContent = `Distance: ${distance.toFixed(2)} km`;
    document.getElementById('total-distance').textContent = `Total ${totalDistance.toFixed(2)} km`;
    
    alert(`Your guess is ${distance.toFixed(2)} km away from the correct location.`);
    toggleButtons('answerConfirmed');
  } else {
    alert("Please select a quiz and place a pin.");
  }
}

function calculateDistance(userLat, userLng, answerLat, answerLng) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((answerLat - userLat) * Math.PI) / 180;
  const dLng = ((answerLng - userLng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((userLat * Math.PI) / 180) * Math.cos((answerLat * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toggleButtons(action) {
  const confirmPinButton = document.getElementById('confirm-pin-button');
  const okButton = document.getElementById('ok-button');
  const resetButton = document.getElementById('reset-button');

  switch (action) {
    case 'init':
      confirmPinButton.classList.add('inactive');
      confirmPinButton.disabled = true;
      okButton.classList.add('active');
      resetButton.disabled = false;
      break;
    case 'quizSelected':
      confirmPinButton.classList.remove('inactive');
      confirmPinButton.disabled = false;
      break;
    case 'answerConfirmed':
      confirmPinButton.classList.add('inactive');
      confirmPinButton.disabled = true;
      break;
    default:
      break;
  }
}

function clearPins() {
  if (userPin) {
    userPin.setMap(null);
    userPin = null;
  }
  if (answerPin) {
    answerPin.setMap(null);
    answerPin = null;
  }
  if (searchMarker) {
    searchMarker.setMap(null);
    searchMarker = null;
  }
}

window.onload = loadGoogleMapsScript;
