var LocationData = [
    [43.4630965,-80.52217417, "95 King Street South, Waterloo", "1" ], 
    [43.4770042,-80.544263216, "151 Columbia Street, Waterloo", "2" ], 
    [43.469249,-80.527782416, "109 King Street North, Waterloo", "3" ], 
    [43.4610515,-80.5561899, "200 University Avenue Lex, Waterloo", "4" ] 
];

var map = null;

function initialize()
{
    var mapOptions = {
    disableDefaultUI: true,
    scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    draggable: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    var bounds = new google.maps.LatLngBounds();
    var infowindow = new google.maps.InfoWindow();

     
    for (var i in LocationData)
    {
        var p = LocationData[i];
        var latlng = new google.maps.LatLng(p[0], p[1]);
        bounds.extend(latlng);
         
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: p[3]
        });
     
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(this.title);
            infowindow.open(map, this);
        });
    }
     
    map.fitBounds(bounds);
}

function loc_plot(place, lat, lon){
      var markers = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lon),
      map: map,
      title: place,
      icon: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png"
  });
}


google.maps.event.addDomListener(window, 'load', initialize);


