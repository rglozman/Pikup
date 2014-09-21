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
  if(Parse.User.current()) {
    $("#loginButton").hide();
  }

  // Load map
  initialize();

  // Get current location
  getCurrentPosition();

  // Form submit
  $("#login_form").submit(function(event) {
    event.preventDefault();
    var email = $("#login_form #email").val();
    var password = $("#login_form #password").val();

    Parse.User.logIn(email, password, {
      success: function() {
        $("#myModal").modal('hide');
        $("#loginButton").hide();
        $("#logoutButton").show();
      },
      error: function(error) {
        alert("Invalid credentials. Please try again.");
      }
    })
  })

  // Logout user
  $("#logoutButton a").click(function(event) {
    event.preventDefault();
    Parse.User.logOut();
    $("#logoutButton").hide();
    $("#loginButton").show();
  })

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
        html += '<div class="time"><i class="fa fa-clock-o"></i>' + moment(result[index].createdAt).fromNow() + '</div>';
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
          html: result[index].get('business').get('name') + '<br/>' + result[index].get('amount') + '<br /><br />' + result[index].get('business').get('streetAddress') + '<br />' + result[index].get('business').get('city') + ', ' + result[index].get('business').get('state') + ' ' + result[index].get('business').get('zip')
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

  Parse.Cloud.run("claimedPostings", {}, {
    success: function(result) {

    },
    error: function(error) {

    }
  });
}) 

// Get current position
function getCurrentPosition() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
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