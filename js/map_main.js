// Parse
// Initializ Parse
var PARSE_APP_ID = 'z362bJSnPdhoUiYUXSrkJQJYyVB0cBpJr0yzn54M';
var PARSE_JAVASCRIPT_KEY = 'rXsSDfP4KVR4AtV7vBh1HScKOx0mgjKj5MzKCJTI';

Parse.initialize(PARSE_APP_ID, PARSE_JAVASCRIPT_KEY);

// Classes
var Business = Parse.Object.extend("Business");
var Message = Parse.Object.extend("Message");
var Posting = Parse.Object.extend("Posting");
var Shelter = Parse.Object.extend("Shelter");

// Global variables
var geocoder = null;
var map = null;
var customerMarker = null;
var gmarkers = [];
var closest = [];

$(function() {
  // Load map
  initialize();

  // Get all current postings
  Parse.Cloud.run("currentPostings", {}, {
    success: function(result) {
      // Add the content.
      var html = ""

      for(var index = 0; index < result.length; index++) {
        html += '<div class="item">';
        html += '<div class="picture" style="background-image:url(' + result[index].get("business").get("photoUrl") + ');"></div>';
        html += '<div class="info">';
        html += '<div class="cell">';
        html += '<div class="name">' + result[index].get("business").get("name") + '</div>';
        html += '<div class="amount">' + result[index].get("amount") + '</div>';
        html += '<div class="address">';
        html += result[index].get("business").get("streetAddress");
        html += '<br />';
        html += result[index].get("business").get("city") + ', ' + result[index].get("business").get("state") + ' ' + result[index].get("business").get("zip");
        html += '</div>';
        html += '<div class="time"><i class="fa fa-clock-o"></i>2 hours ago</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="buttons">';
        html += '<div class="item">';
        html += '<i class="fa fa-check"></i>';
        html += '</div>';
        html += '<div class="item">';
        html += '<i class="fa fa-envelope"></i>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
      }

      $("#postings-list").html(html);

      // Add markers
      var infowindow = new google.maps.InfoWindow();      
      var marker;      
      var bounds = new google.maps.LatLngBounds();

      for (var index = 0; index < result.length; index++) {         
        var coordStr = result[index].get("business").get("latLng");
        var pt = new google.maps.LatLng(parseFloat(coordStr.latitude),parseFloat(coordStr.longitude));
        bounds.extend(pt);
        
        marker = new google.maps.Marker({         
          position: pt,         
          map: map,
          icon: "http://maps.google.com/mapfiles/ms/icons/blue.png",
          title: result[index].get('business').get('name'),
          html: result[index].get('business').get('name') + '<br /><br />' + result[index].get('business').get('streetAddress') + '<br />' + result[index].get('business').get('city') + ', ' + result[index].get('business').get('state') + ' ' + result[index].get('business').get('zip')
        });

        gmarkers.push(marker);
        google.maps.event.addListener(marker, 'click', (function(marker, index) {         

          return function() 
          {           
            infowindow.setContent(marker.html);
            infowindow.open(map, marker);         
          }       
        })

        (marker, index));     
      }

      map.fitBounds(bounds); 
    },
    error: function(error) {

    }
  })
}) 

// Get current position
function getCurrentPosition() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

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

// Initialize Map
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
  });  
}

// Geolocation error
function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  console.log(content);
}

// Map Code
// $(".pikup_actions").on("click", ".email_pikup", function() {
//   if ($(this).parent().parent().find('textarea').length == 0) {
//     $(this).parent().parent().append('<textarea placeholder="Type your message here...."></textarea>');
//   } else {
//     $(this).parent().parent().find('textarea').toggle();
//   }
// });

// $(".pikup_actions").on("click", ".book_pikup", function() {
//   console.log( $(this).parent().parent().css('background-color' , '#ECF1EF') );
// });
// 
// Geocode the entered address
// function codeAddress() {
//   var address = document.getElementById('address').value;
//   geocoder.geocode( { 'address': address}, function(results, status) {
//     if(status == google.maps.GeocoderStatus.OK) {
//       map.setCenter(results[0].geometry.location);
      
//       if(customerMarker) 
//         customerMarker.setMap(null);
      
//       customerMarker = new google.maps.Marker({
//         map: map,
//         position: results[0].geometry.location
//       });
    
//       closest = findClosestN(results[0].geometry.location,10);
//       closest = closest.splice(0,3);

//       calculateDistances(results[0].geometry.location, closest,3);
//     } else {
//       alert('Geocode was not successful for the following reason: ' + status);
//     }
//   });
// }
// 
// Init everything
// function init() {
// 	var address = document.getElementById('address').value;

//   geocoder.geocode( { 'address': address}, function(results, status) {
//     if(status == google.maps.GeocoderStatus.OK) {
//       map.setCenter(results[0].geometry.location);
      
//       if(customerMarker)
//         customerMarker.setMap(null);
      
//       customerMarker = new google.maps.Marker({
//         map: map,
//         position: results[0].geometry.location
//       });
      
//       closest = findClosestN(results[0].geometry.location,10);
//       closest = closest.splice(0,locations.length);
//       calculateDistances(results[0].geometry.location, closest, locations.length);
//     } else {
//       alert('Geocode was not successful for the following reason: ' + status);
//     }
//   });
// }

// // Find closest N postings
// function findClosestN(pt,numberOfResults) {
//  var closest = [];
//    for (var i=0; i<gmarkers.length;i++) {
//      gmarkers[i].distance = google.maps.geometry.spherical.computeDistanceBetween(pt,gmarkers[i].getPosition());
//      gmarkers[i].setMap(null);
//      closest.push(gmarkers[i]);
//    }
//    closest.sort(sortByDist);
//    return closest;
//  }

//  function sortByDist(a,b) {
//    return (a.distance- b.distance)
//  }

//  function calculateDistances(pt,closest,numberOfResults) {
//   var service = new google.maps.DistanceMatrixService();
//   var request =    {
//     origins: [pt],
//     destinations: [],
//     travelMode: google.maps.TravelMode.DRIVING,
//     unitSystem: google.maps.UnitSystem.METRIC,
//     avoidHighways: false,
//     avoidTolls: false
//   };
//   for (var i=0; i<closest.length; i++) request.destinations.push(closest[i].getPosition());
//     service.getDistanceMatrix(request, function (response, status) {
//       if (status != google.maps.DistanceMatrixStatus.OK) {
//         alert('Error was: ' + status);
//       } else {
//         var origins = response.originAddresses;
//         var destinations = response.destinationAddresses;
//         var outputDiv = $(document).find(".pikup_info");

//         var results = response.rows[0].elements;
//         for (var i = 0; i < numberOfResults; i++) {
// 		console.log(numberOfResults);
//           closest[i].setMap(map);
//           $( $(outputDiv[i]).find("h5")[2]).text(  results[i].distance.text + ' appoximately '
//           + results[i].duration.text );
//         }
//       }
//     });
// }

// function get_location() {

//   if(navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function(position) {
//       var pos = new google.maps.LatLng(position.coords.latitude,
//        position.coords.longitude);

//       var infowindow = new google.maps.InfoWindow({
//         map: map,
//         position: pos,
//         content: 'Your Location!'
//       });

//       marker = new google.maps.Marker({         
//         position: pos,         
//         map: map,
//         icon: "http://www.google.com/intl/en_us/mapfiles/ms/micons/orange-dot.png"
//       });    

//       map.setCenter(pos);
//     }, function() {
//       handleNoGeolocation(true);
//     });
//   } else {
//     handleNoGeolocation(false);
//   }
// }
// 
// google.maps.event.addDomListener(window, 'load', initialize);