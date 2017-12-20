///////Google Maps API/////////

//Google Maps API global variables
var map;
var addressLng;
var addressLat;
var addressFormatted;
var LocationString;


//Initialize Map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: { lat: 32.2350428, lng: -110.9547842 }
    });

    addMarker(32.2350428, -110.9547842, 'U of A');
    $("#galleryName").text("");
    $("#galleryAddr").text("");
};

//Resets the map to the entire United States
function resetMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: { lat: 37.50, lng: -95.35 }
    });
    
    $("#galleryName").text("");
    $("#galleryAddr").text("");
};

//Add marker function for Google maps
function addMarker(locLat, locLng, locTitle) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(locLat, locLng),
        title: locTitle,
        map: map
    });
};

//Renders the map based off the string of a location
function displayMap(LocationString) {
    // Get the latitude and longitude of the Address from the Address String passes in.
    $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + LocationString + "&key=AIzaSyCSCJJqp5sR0Q6TMspPZ_SeqnTC7iLPnmE")
        .done(function (data) {
            var address = JSON.stringify(data);
            addressLng = data.results[0].geometry.location.lng;
            addressLat = data.results[0].geometry.location.lat;
            addressFormatted = data.results[0].formatted_address;
            // Create the map with the lat/lng retrieved from the API.
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 16,
                center: { lat: Number(addressLat), lng: Number(addressLng) },
            });
            addMarker(addressLat, addressLng, LocationString);
            $("#galleryName").text(LocationString);
            $("#galleryAddr").text(addressFormatted);
        });
}

//For the sticky nav
$(window).scroll(function () {
    if ($(window).scrollTop() >= 63) {
        $("#index-banner").addClass('fixed-header');
    }
    else {
        $("#index-banner").removeClass('fixed-header');
    }
});

$(document).ready(function () {

    //Allows modals to be triggered
    initializeModal();

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

        emptyCard();

        emptyCarousel();

        event.preventDefault();

        imageArray = []

        getArtistId();

    })

    //Queries the API to find the ID of the artist
    function getArtistId() {

        artistName = $("#artist-name").val().trim()

        var artistNameQuery = url + "search?q=" + artistName

        $.ajax({
            url: artistNameQuery,
            method: 'GET',
            beforeSend: function (xhr) { xhr.setRequestHeader('X-Xapp-Token', xappToken); }
        }).done(function (data) {

            var artistId = data._embedded.results.filter(function (item) {
                return item.type === "artist";
            })[0]._links.self.href.split("/").pop();

            artistIdQueryFunc(artistId)

            artistName = data._embedded.results.filter(function (item) {
                return item.type === "artist";
            })[0].title
        })

    }

    //Queries the API based on the artist ID, returns a list of all public artworks
    function artistIdQueryFunc(id) {
        var artistIdQuery = url + "artworks?artist_id=" + id
        $.ajax({
            url: artistIdQuery,
            method: 'GET',
            beforeSend: function (xhr) { xhr.setRequestHeader('X-Xapp-Token', xappToken); }
        }).done(function (results) {

            if (results._embedded.artworks.length == 0) {
                noArtFound();
            }

            for (var i = 0; i < results._embedded.artworks.length; i++) {

                var arrayId = results._embedded.artworks[i].id

                getArtwork(arrayId, i)
            }

        })
    }

    //Takes each artwork id, takes the details of each piece, adds to an object whcih is then pushed to the array
    function getArtwork(id, counter) {
        var artworkQuery = url + "/artworks/" + id
        $.ajax({
            url: artworkQuery,
            method: 'GET',
            beforeSend: function (xhr) { xhr.setRequestHeader('X-Xapp-Token', xappToken); }
        }).done(function (results) {

            var image = results._links.thumbnail.href
            var collectingInstitution = results.collecting_institution
            var id = results.id
            var medium = results.medium
            var title = results.title
            var date = results.date
            var category = results.category

            imageArray.push({
                arrayId: counter,
                imgId: id,
                imgUrl: image,
                title: title,
                institution: collectingInstitution,
                medium: medium,
                date: date,
                category: category

            })

            renderCarousel(imageArray)

            renderImage(imageArray[0].imgUrl, imageArray[0].title)

            if (!(imageArray[0].institution)) {
                resetMap();
            }
            else {
                displayMap(imageArray[0].institution);
            }

            renderContent(artistName, imageArray[0].title, imageArray[0].category, imageArray[0].date, imageArray[0].medium, imageArray[0].imgUrl)

        })

    }

    //Takes in the array of images and renders the images to the carousel
    function renderCarousel(array) {

        emptyCarousel();

        $(array).each(function (key, value, ) {

            var imgDiv = $("<img>")
                .attr("src", value.imgUrl)
                .attr("id", "carousel-image")
                .attr("data", value.arrayId)
                .css("width", "100%")
                .css("height", "100%")


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
        $('.carousel').carousel({padding: 50}, {shift: 50}, {dist: 0});
    }

    $(".carousel").on("click", "#carousel-image", function () {

        var imgSrc = $(this).attr("src")
        var clickId = parseInt($(this).attr("data"))

        var artLocation;
        var artTitle;
        var artCategory;
        var artMedium;
        var artDate;

        for (var i = 0; i < imageArray.length; i++) {

            if (imageArray[i].arrayId == clickId) {
                artLocation = imageArray[i].institution
                artTitle = imageArray[i].title
                artMedium = imageArray[i].medium
                artDate = imageArray[i].date
                artCategory = imageArray[i].category
            }
        }

        renderImage(imgSrc, artTitle)
        if (!(artLocation)) {
            resetMap();
        }
        else {
            displayMap(artLocation);
        }

        renderContent(artistName, artTitle, artCategory, artDate, artMedium, imgSrc)

    })

    function renderImage(img, title) {

        emptyCard();

        var imgDiv = $("<img>")
                    .attr("src", img)

        $("#card-image").html(imgDiv)

        $("#art-title").html(title + '<i class="material-icons right">more_vert</i>')
        $("#link").html('<a href=https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=' + "fine%20art%20" + encodeURI(title) + "%20" + encodeURI(artistName) + ' target="_blank">Find on Amazon</a>')

    }

    function renderContent(name, title, category, date, medium, img) {
        $(".card-reveal").empty();

        var wrapperDiv = $("<div>")
        var imgDiv = $("<img>").attr("src", img)

        wrapperDiv.append(imgDiv);

        wrapperDiv.append(
            '<span class="card-title grey-text text-darken-4">' + title + '<i class="material-icons right">close</i></span>' +
            '<div>' +
            '<p>' + "Category: " + category + '</p>' +
            '<p>' + "Medium: " + medium + '</p>' +
            '<p>' + "Date Created: " + date + '</p>' +
            '</div>'
        )

        $(".card-reveal").append(wrapperDiv);
    }

    function emptyCard() {
        $("#card-image").empty();
    }

    function initializeModal() {
        $('.modal').modal();
    }

    function noArtFound() {
        $('#modal1').modal('open')
        $('#modal1').css("z-index", 99999)
    }

    function emptyCarousel() {
        $(".carousel").empty()
    }

    initializeQuery();

})
