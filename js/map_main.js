var locations = [
[ "Tim Hortons","no","95 King Street South, Waterloo","<Polygon><outerBoundaryIs><LinearRing><coordinates>43.4630965,-80.52217417</coordinates></LinearRing></outerBoundaryIs></Polygon>","43.4630965,-80.52217417","http://maps.google.com/mapfiles/ms/icons/blue.png"],

[ "Tim Hortons","no","151 Columbia Street, Waterloo","<Polygon><outerBoundaryIs><LinearRing><coordinates>43.4770042,-80.544263216</coordinates></LinearRing></outerBoundaryIs></Polygon>","43.4770042,-80.544263216","http://maps.google.com/mapfiles/ms/icons/blue.png"],

[ "Starbucks","no","109 King Street North, Waterloo","<Polygon><outerBoundaryIs><LinearRing><coordinates>43.469249,-80.527782416</coordinates></LinearRing></outerBoundaryIs></Polygon>","43.469249,-80.527782416","http://maps.google.com/mapfiles/ms/icons/blue.png"],

[ "University of Waterloo","no","200 University Avenue Lex, Waterloo","<Polygon><outerBoundaryIs><LinearRing><coordinates>43.4610515,-80.5561899</coordinates></LinearRing></outerBoundaryIs></Polygon>","43.4610515,-80.5561899","http://maps.google.com/mapfiles/ms/icons/blue.png"]
];

var geocoder = null;
var map = null;
var customerMarker = null;
var gmarkers = [];
var closest = [];

function initialize() {
  geocoder = new google.maps.Geocoder();
  map = new google.maps.Map(document.getElementById('map'), 
  {       
    zoom: 9,       
    center: new google.maps.LatLng(52.6699927, -0.7274620),       
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true,
    scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: true,
    draggable: false
  });   

  var infowindow = new google.maps.InfoWindow();      
  var marker, i;      
  var bounds = new google.maps.LatLngBounds();
  //document.getElementById('info').innerHTML = "Found "+locations.length+" Locations<br>";
  for (i = 0; i < locations.length; i++) {         
    var coordStr = locations[i][4];
    var coords = coordStr.split(",");
    var pt = new google.maps.LatLng(parseFloat(coords[0]),parseFloat(coords[1]));
    bounds.extend(pt);
    marker = new google.maps.Marker({         
      position: pt,         
      map: map,
      icon: locations[i][5],
      address: locations[i][2],
      title: locations[i][0],
      html: locations[i][0]+"<br>"+locations[i][2]
    });                              
    gmarkers.push(marker);
    google.maps.event.addListener(marker, 'click', (function(marker, i) {         

      return function() 
      {           infowindow.setContent(marker.html);
        infowindow.open(map, marker);         
      }       
    })
    (marker, i));     
  }
  map.fitBounds(bounds);   
  init();
}

function codeAddress() {
  var address = document.getElementById('address').value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      if (customerMarker) customerMarker.setMap(null);
      customerMarker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
      closest = findClosestN(results[0].geometry.location,10);
            // get driving distance
            closest = closest.splice(0,3);
            calculateDistances(results[0].geometry.location, closest,3);
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
}


function init() {
  var address = "145 university avenue west, waterloo";
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      if (customerMarker) customerMarker.setMap(null);
      customerMarker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
      closest = findClosestN(results[0].geometry.location,10);
            // get driving distance
            closest = closest.splice(0,locations.length);
            console.log( closest)
            calculateDistances(results[0].geometry.location, closest, locations.length);
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
}


function findClosestN(pt,numberOfResults) {
 var closest = [];
   for (var i=0; i<gmarkers.length;i++) {
     gmarkers[i].distance = google.maps.geometry.spherical.computeDistanceBetween(pt,gmarkers[i].getPosition());
     gmarkers[i].setMap(null);
     closest.push(gmarkers[i]);
   }
   closest.sort(sortByDist);
   return closest;
 }

 function sortByDist(a,b) {
   return (a.distance- b.distance)
 }

 function calculateDistances(pt,closest,numberOfResults) {
  var service = new google.maps.DistanceMatrixService();
  var request =    {
    origins: [pt],
    destinations: [],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false
  };
  for (var i=0; i<closest.length; i++) request.destinations.push(closest[i].getPosition());
    service.getDistanceMatrix(request, function (response, status) {
      if (status != google.maps.DistanceMatrixStatus.OK) {
        alert('Error was: ' + status);
      } else {
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;
        var outputDiv = document.getElementById('side_bar');
        outputDiv.innerHTML = '';

        var results = response.rows[0].elements;
        for (var i = 0; i < numberOfResults; i++) {
          closest[i].setMap(map);
          outputDiv.innerHTML += "<a href='javascript:google.maps.event.trigger(closest["+i+"],\"click\");'>"+closest[i].title + '</a><br>' + closest[i].address+"<br>"
          + results[i].distance.text + ' appoximately '
          + results[i].duration.text + '<br><hr>';
        }
      }
    });
}

function get_location(){
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
       position.coords.longitude);

      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'Your Location!'
      });

      marker = new google.maps.Marker({         
        position: pos,         
        map: map,
        icon: "http://www.google.com/intl/en_us/mapfiles/ms/micons/orange-dot.png"
      });    

      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    handleNoGeolocation(false);
  }
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }
  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };
  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

google.maps.event.addDomListener(window, 'load', initialize);