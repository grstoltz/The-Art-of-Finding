///////Google Maps API/////////

//Google Maps API global variables
var map;
var markers = [];
var addressLng;
var addressLat;
var addressFormatted;
var addrMarker;
var LocationString;


//Initialize Map

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: { lat: 32.2350428, lng: -110.9547842 }
    });
    console.log("In initmap");
    addMarker(32.2350428, -110.9547842, 'U of A');
    $("#address").val("Tucson, AZ");
};


//Add marker function for Google maps
function addMarker(locLat, locLng, locTitle) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(locLat, locLng),
        title: locTitle,
        map: map
    });
    markers.push(marker);
};

//Clears markers on map
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


function displayMap(LocationString) {
    console.log("In displayMap");
    // Get the latitude and longitude of the Address from the Address String passes in.
    $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + LocationString + "&key=AIzaSyCSCJJqp5sR0Q6TMspPZ_SeqnTC7iLPnmE")
        .done(function (data) {
            var address = JSON.stringify(data);
            console.log("Results - " + address);
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
                center: { lat: Number(addressLat), lng: Number(addressLng) },
            });
            addMarker(addressLat, addressLng, addrMarker);
            $("#galleryName").text(LocationString);
            $("#galleryAddr").text(addressFormatted);
        });
}

$(window).scroll(function () {
    if ($(window).scrollTop() >= 80) {
        $("#index-banner").addClass('fixed-header');
    }
    else {
        $("#index-banner").removeClass('fixed-header');
    }
});

$(document).ready(function () {

    ////////ARTSY API//////////

    //Establish global variables for API call token

    var clientID = 'f3a6bc6bafa647a1b773'
    var clientSecret = '301b70ba99405fc2273322fe97ae23d1'
    var tokenUrl = 'https://api.artsy.net/api/tokens/xapp_token?'
    var xappToken;

    //Artsy API Token query
    function initializeQuery() {
        $.ajax({
            url: tokenUrl + "client_id=" + clientID + "&client_secret=" + clientSecret,
            method: "POST"
        }).done(function (res) {
            console.log(res.token)
            xappToken = res.token;
        });
    }

    var url = "https://api.artsy.net/api/"

    var artistId;

    var imageArray = [];

    var artistName

    //On click listener for arist search
    $("#submit").on("click", function (event) {

        event.preventDefault();

        imageArray = []

        getArtistName();


    })

    function getArtistName() {

        artistName = $("#artist-name").val().trim()

        var artistNameQuery = url + "search?q=" + artistName

        $.ajax({
            url: artistNameQuery,
            method: 'GET',
            beforeSend: function (xhr) { xhr.setRequestHeader('X-Xapp-Token', xappToken); }
        }).done(function (data) {
            console.log(data)

            var artistId = data._embedded.results.filter(function (item) {
                return item.type === "artist";
            })[0]._links.self.href.split("/").pop();

            artistIdQueryFunc(artistId)
            console.log(artistId)
        })

    }

    function artistIdQueryFunc(id) {
        var artistIdQuery = url + "artworks?artist_id=" + id
        $.ajax({
            url: artistIdQuery,
            method: 'GET',
            beforeSend: function (xhr) { xhr.setRequestHeader('X-Xapp-Token', xappToken); }
        }).done(function (results) {
            console.log(results)

            for (var i = 0; i < results._embedded.artworks.length; i++) {

                var arrayId = results._embedded.artworks[i].id

                // collectingInstitution.push(results._embedded.artworks[i].collecting_institution)

                getArtwork(arrayId, i)
            }


        })
    }

    function getArtwork(id, counter) {
        var artworkQuery = url + "/artworks/" + id
        $.ajax({
            url: artworkQuery,
            method: 'GET',
            beforeSend: function (xhr) { xhr.setRequestHeader('X-Xapp-Token', xappToken); }
        }).done(function (results) {

            console.log(results)

            var image = results._links.thumbnail.href
            var collectingInstitution = results.collecting_institution
            var id = results.id
            var medium = results.medium
            var title = results.title

            imageArray.push({
                arrayId: counter,
                imgId: id,
                imgUrl: image,
                title: title,
                institution: collectingInstitution,
                medium: medium

            })
            // console.log("image is " + image);

            console.log(imageArray)

            renderCarousel(imageArray)

        })


    }


    function renderCarousel(array) {

        $(".carousel").empty()

        $(array).each(function (key, value, ) {

            var imgDiv = $("<img>")
                .attr("src", value.imgUrl)
                .attr("id", "carousel-image")
                .attr("data", value.arrayId)


            var aDiv = $("<a>")
                .addClass("carousel-item")
                .html(imgDiv);

            $(".carousel").append(aDiv)

        })

        activateCarousel()
    }

    function activateCarousel() {
        if ($(".carousel").hasClass("initialized")) {
            $(".carousel").removeClass("initialized")

        }
        $('.carousel').carousel();
    }

    $(".carousel").on("click", "#carousel-image", function () {

        var imgSrc = $(this).attr("src")
        var clickId = parseInt($(this).attr("data"))

        var artLocation;
        var artTitle;
        var artMedium;

        for (var i = 0; i < imageArray.length; i++) {

            if (imageArray[i].arrayId == clickId) {
                artLocation = imageArray[i].institution
                artTitle = imageArray[i].title
                artMedium = imageArray[i].medium
            }

        }

        renderImage(imgSrc, artTitle, artMedium)
        displayMap(artLocation)

    })

    function renderImage(img, title, medium) {

        $("#card-image").empty();

        var imgDiv = $("<img>").attr("src", img)
        var smallerImg = $('<img>').attr('src', img)

        $("#card-image").html(imgDiv)
        $("#infoPic").html(smallerImg);

        $("#art-title").text(title)
        $("#link").html('<a href=https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=' + "fine%20art%20" + encodeURI(title) + "%20" + encodeURI(artistName) + '>Find on Amazon</a>')

    }

    //queries API for artist ID

    //Create API pull based off artist name

    //Create array of images with properties of location

    //Render images to slider div

    //On click listener for image


    //Use Google Maps API to show location

    //Query API to convert location to coordinates

    //render Google maps with current location

    //Render image to lefthand div

    initializeQuery();



})