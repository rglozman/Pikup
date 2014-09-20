var LocationData = [
    [43.4630965,-80.52217417, "95 King Street South, Waterloo" ], 
    [43.4770042,-80.544263216, "151 Columbia Street, Waterloo" ], 
    [43.469249,-80.527782416, "109 King Street North, Waterloo" ], 
    [43.4610515,-80.5561899, "200 University Avenue Lex, Waterloo" ] 
];
 
function initialize()
{
    var map = 
        new google.maps.Map(document.getElementById('map-canvas'));
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
            title: p[2]
        });
     
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(this.title);
            infowindow.open(map, this);
        });
    }
     
    map.fitBounds(bounds);
}

google.maps.event.addDomListener(window, 'load', initialize);


