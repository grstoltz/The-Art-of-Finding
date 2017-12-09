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

    var url = "https://api.artsy.net:443/api/artists/"

    var artistName = "4d8b92b34eb68a1b2c0003f4"

    var artistQuery = url + artistName

    console.log(artistQuery)

    //On click listener for arist search
    $("#submit").on("click", function(event){
        event.preventDefault();
    $.ajax({
        url: artistQuery,
        method: 'GET',
        beforeSend: function(xhr){xhr.setRequestHeader('X-Xapp-Token', xappToken);}
    }).done(function(results){
        console.log(results)
    })
    })
    
    
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