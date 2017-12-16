$(document).ready(function(){

    //Establish global variables for API call token

    var clientID = 'f3a6bc6bafa647a1b773'
    var clientSecret = '301b70ba99405fc2273322fe97ae23d1'
    var tokenUrl = 'https://api.artsy.net/api/tokens/xapp_token?'
    var xappToken;

    function initializeQuery(){
        $.ajax({
            url: tokenUrl + "client_id=" + clientID + "&client_secret=" + clientSecret,
            method: "POST"
        }).done(function(res) {
            console.log(res.token)
            xappToken = res.token; 
        });
    }

    var url = "https://api.artsy.net/api/"

    var artistId;

    var imageArray = [];

//On click listener for arist search
    $("#submit").on("click", function(event){

        event.preventDefault();

        imageArray = []

        getArtistName();
        
    
    })

    function getArtistName(){

        var artistName = $("#artist-name").val().trim()
        
        var artistNameQuery = url + "search?q=" + artistName
        
        $.ajax({
            url: artistNameQuery,
            method: 'GET',
            beforeSend: function(xhr){xhr.setRequestHeader('X-Xapp-Token', xappToken);}
            }).done(function(data){
                console.log(data)

                var artistId = data._embedded.results.filter(function(item) {
                    return item.type === "artist" ;
                  })[0]._links.self.href.split("/").pop(); 
                    
                artistIdQueryFunc(artistId)
                console.log(artistId)
            })

    }
    
    function artistIdQueryFunc (id) {
        var artistIdQuery = url + "artworks?artist_id=" + id
        $.ajax({
                url: artistIdQuery,
                method: 'GET',
                beforeSend: function(xhr){xhr.setRequestHeader('X-Xapp-Token', xappToken);}
        }).done(function(results){
                console.log(results)

                for (var i=0; i < results._embedded.artworks.length; i++){
            
                var arrayId = results._embedded.artworks[i].id

                // collectingInstitution.push(results._embedded.artworks[i].collecting_institution)

                getArtwork(arrayId, i)
                }


            })
    }

    function getArtwork (id, counter) {
        var artworkQuery = url + "/artworks/" + id
        $.ajax({
            url: artworkQuery,
            method: 'GET',
            beforeSend: function(xhr){xhr.setRequestHeader('X-Xapp-Token', xappToken);}
        }).done(function(results){

            console.log(results)

            var image = results._links.thumbnail.href
            var collectingInstitution = results.collecting_institution
            var id = results.id
            var medium = results.medium
            var title = results.title

            imageArray.push({
                id: counter,
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


    function renderCarousel(array){

    $(".carousel").empty()

    $(array).each(function(key, value,) {

        var imgDiv = $("<img>")
        .attr("src", value.imgUrl)
        .attr("id", "carousel-image")
        .attr("data", value.id)
    

        var aDiv = $("<a>")
            .addClass("carousel-item")
            .html(imgDiv);
        
        $(".carousel").append(aDiv)
        
    })

    activateCarousel()
}

    function activateCarousel (){
        if ($(".carousel").hasClass("initialized")) {
            $(".carousel").removeClass("initialized")
            
        }
        $('.carousel').carousel();
    }

    $(".carousel").on("click", "#carousel-image", function (){

         
        var imgSrc = $(this).attr("src")
        var id = $(this).attr("data")

        renderImage(imgSrc)

    })

    function renderImage(img){

    $("#card-image").empty();

        var imgDiv = $("<img>")
            .attr("src", img)

    $("#card-image").html(imgDiv)

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