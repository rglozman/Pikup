var map;
var markers = [];

function initialize() {
  var haightAshbury = [
  new google.maps.LatLng(43.4630965,-80.52217417),
  new google.maps.LatLng(43.4770042,-80.544263216),
  new google.maps.LatLng(43.469249,-80.527782416),
  new google.maps.LatLng(43.4610515,-80.5561899),
  ];

  var mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(43.4630965,-80.52217417),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  addMarker(haightAshbury);
}

function addMarker(location) {
  for (var i = 0; i <location.length; i++){
    var marker = new google.maps.Marker({
      position: location[i],
      map: map
    });
    markers.push(marker);
  }
}

// Sets the map on all markers in the array.
function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setAllMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setAllMap(map);
}

google.maps.event.addDomListener(window, 'load', initialize);
