
  var map;
  var markers = [];
  var addressLng;
  var addressLat;
  var addressFormatted;
  var addrMarker;
  var LocationString;

  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: {lat: 32.2350428, lng: -110.9547842 }
    });
    console.log("In initmap");
    addMarker( 32.2350428, -110.9547842, 'U of A' );
    $("#address").val( "Tucson, AZ" );
  };


  function addMarker( locLat, locLng, locTitle ){
    // var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    // image = 'bird.png';
    var marker = new google.maps.Marker({
      position : new google.maps.LatLng( locLat, locLng ),
      title : locTitle,
      // icon: image,
      map : map
    });
    markers.push(marker);
  };

  // Removes the markers from the map, but keeps them in the array.
  function clearMarkers() {
    setMapOnAll(null);
    markers = [];
  }
  // Sets the map on all markers in the array.
  function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  function displayMap( LocationString ){
    console.log("In displayMap");
    // Get the latitude and longitude of the Address from the Address String passes in.
      $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + LocationString + "&key=AIzaSyCSCJJqp5sR0Q6TMspPZ_SeqnTC7iLPnmE")
    .done(function(data){
    var address = JSON.stringify(data);
    console.log("Results - " + address );
    console.log("Data Lat- " + data.results[0].geometry.location.lat);
    console.log("Data Lng- " + data.results[0].geometry.location.lng);
    console.log("Short Name- " + data.results[0].address_components.short_name);
    addressLng = data.results[0].geometry.location.lng;
    addressLat = data.results[0].geometry.location.lat;
    addrMarker = data.results[0].address_components.short_name;
    addressFormatted = data.results[0].formatted_address;
    // Create the map with the lat/lng retrieved from the API.
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: {lat:Number(addressLat), lng:Number(addressLng) },
    });
    addMarker( addressLat, addressLng, addrMarker );
    $("#address").val( LocationString );
  });
 }

  $("#location").on("click", function(event){
    event.preventDefault();
    displayMap( "Österreichische Galerie Belvedere, Vienna" );
});

// "National+Gallery+of+Art,+Washington+D.C."
// "Musée du Louvre"
// "Santa Maria delle Grazie, Milan"
// "Österreichische Galerie Belvedere, Vienna"


