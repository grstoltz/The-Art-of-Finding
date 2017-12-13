$(document).ready(function(){


    

    //Establish global variables for API call token

    var clientID = 'f3a6bc6bafa647a1b773'
    var clientSecret = '301b70ba99405fc2273322fe97ae23d1'
    var apiUrl = 'https://api.artsy.net/api/tokens/xapp_token?'
    var xappToken;

    $.ajax({
        url: apiUrl + "client_id=" + clientID + "&client_secret=" + clientSecret,
        method: "POST"
    }).done(function(res) {
        console.log(res.token)
        xappToken = res.token; 
    });

    var url = "https://api.artsy.net/api/"

    var artistId;
    

    //On click listener for arist search
    $("#submit").on("click", function(event){
        event.preventDefault();

    var artistName = $("#artist-name").val().trim()

    var artistNameQuery = url + "search?q=" + artistName

$.ajax({
    url: artistNameQuery,
    method: 'GET',
    beforeSend: function(xhr){xhr.setRequestHeader('X-Xapp-Token', xappToken);}
    }).done(function(data){
        console.log(data)
        artistId = data._embedded.results[0]._links.self.href.split("/").pop();     
        artistIdQueryFunc()
        console.log(artistId)
    })
  
})
    
function artistIdQueryFunc () {
    var artistIdQuery = url + "artworks?artist_id=" + artistId
    $.ajax({
            url: artistIdQuery,
            method: 'GET',
            beforeSend: function(xhr){xhr.setRequestHeader('X-Xapp-Token', xappToken);}
    }).done(function(results){
            console.log(results)

            for (var i=0; i < results._embedded.artworks.length; i++){
           
            var arrayId = results._embedded.artworks[i].id
            
            getArtworkUrl(arrayId)
            }
    })
}

function getArtworkUrl (id) {
    var artworkQuery = url + "/artworks/" + id
    $.ajax({
        url: artworkQuery,
        method: 'GET',
        beforeSend: function(xhr){xhr.setRequestHeader('X-Xapp-Token', xappToken);}
    }).done(function(results){
        console.log(results)
        var image = results._links.thumbnail.href
        console.log("image is " + image);
        renderImages(image)

    })
}

function renderImages(img){

    var imgDiv = $("<img>")
    .attr("src", img)

    var aDiv = $("<a>")
        .addClass("carousel-item")
        .html(imgDiv);
    
    $(".carousel").append(aDiv)

    $('.carousel').carousel();
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


})