window.onload  = $(function(){

    var userMarker;
    var userLocation;
    var formattedAddress;
    var userLat;
    var userLng;
    var destination = {lat :28.661847, lng :77.089045};
    var mapProperties = {
        center:destination,
        zoom : 13,
        panControl: true,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        overviewMapControl: true,
        rotateControl: true
    };
    var map = new google.maps.Map(document.getElementById("mainMap"), mapProperties);

    var destinationMarkerProerties = {
        position : destination,
        animation: google.maps.Animation.BOUNCE,
        map:map
    }
    var destinationMarker = new google.maps.Marker(destinationMarkerProerties);
    // destinationMarker.setMap(map);

    var destinationInfoWindow = new google.maps.InfoWindow({
        content:"Banati Advocates"
    })

    google.maps.event.addListener(destinationMarker, 'mouseover', function(){
        destinationInfoWindow.open(map, destinationMarker);
    })
    google.maps.event.addListener(destinationMarker, 'mouseout', function(){
        destinationInfoWindow.close();
    })



    map.addListener('click', function (event) {
        userLocation =  event.latLng;
        if(userMarker){
            userMarker.setMap(null)
            userMarkerProperties = {
                position : event.latLng,
                map:map,
                animation: google.maps.Animation.DROP,
                draggable:true
            }
            userMarker = new google.maps.Marker(userMarkerProperties);
            var userInfoWindow = new google.maps.InfoWindow({
                content:"Your Location"
            });
            google.maps.event.addListener(userMarker, 'mouseover', function(){
                userInfoWindow.open(map, userMarker);
            })
            google.maps.event.addListener(userMarker, 'mouseout', function(){
                userInfoWindow.close();
            })
            getRoute();
        }
        else{
            userMarkerProperties = {
                position : event.latLng,
                animation: google.maps.Animation.DROP,
                draggable:true
            }

            userMarker = new google.maps.Marker(userMarkerProperties);
            userMarker.setMap(map);
            var userInfoWindow = new google.maps.InfoWindow({
                content:"Your Location"
            });
            google.maps.event.addListener(userMarker, 'mouseover', function(){
                userInfoWindow.open(map, userMarker);
            })
            google.maps.event.addListener(userMarker, 'mouseout', function(){
                userInfoWindow.close();
            })
            getRoute();

        }

        userLat = userMarker.getPosition().lat();
        userLng = userMarker.getPosition().lng();
        geocodeLatLng();
    })

    // Get Route
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    function getRoute() {
        var request = {
            origin:userLocation,
            destination:destination,
            travelMode:google.maps.TravelMode.DRIVING,
            unitSystem :google.maps.UnitSystem.METRIC
        }
        directionsService.route(request, function (result, status) {
            if(status == google.maps.DirectionsStatus.OK){
                resultPara = 'Great, you are just '+result.routes[0].legs[0].distance.text+' far from us. You can reach here in about '+result.routes[0].legs[0].duration.text
                directionsDisplay.setDirections(result);
            }
            else{
                resultPara = 'Sorry, unable to find your address, please try by clicking on the map'
            }
            $('#result').html(resultPara);


            // hide origin and destination markers

        })
    }

    var geocoder = new google.maps.Geocoder();

    var postcode;
    $('.get_directions_button').click(function(){
        if(userMarker) {
            userMarker.setMap(null)
        }
        var enteredLocation = document.getElementById('input_box').value;
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+enteredLocation+'&key=AIzaSyBGz3TWl1uAO8KwvCI8sPUVYhtPlOzDCWs'
        $.getJSON(url, function(data) {
             if(data.status == 'OK'){
                 userLocation = data.results[0].geometry.location;
                 formattedAddress = data.results[0].formatted_address;
                 $.each(data.results[0].address_components, function(index, element){
                     if(element.types[0] == "postal_code"){
                         postcode = element.long_name;
                         return false;
                     }
                 })
                 formattedAddressPrint = formattedAddress.split(', India')
                 $(".your_address").removeClass('hidden');
                 $(".your_address2").html(formattedAddressPrint)
                 getRoute();
             }
             else{
                 resultPara = 'Sorry, unable to find your address, please try by clicking on the map';
                 getRoute();
             }
        })
        // geocoder.geocode({'address':document.getElementById('input_box').value}, function(results, status) {
        //     if(status == google.maps.GeocoderStatus.OK){
        //         userLocation = results[0].geometry.location;
        //         getRoute();
        //     }
        //     else{
        //         resultPara = 'Sorry, unable to find your address, please try by clicking on the map';
        //         getRoute();
        //     }
        // })
    });

    //for reverse geocoding i.e. convert latitude and longitude to address
    function geocodeLatLng() {
        var latlng = {lat: userLat, lng: userLng};
        geocoder.geocode({'location': latlng}, function (results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    formattedAddress = results[0].formatted_address;
                    formattedAddressPrint = formattedAddress.split(', India')
                    $(".your_address").removeClass('hidden');
                    $(".your_address2").html(formattedAddressPrint);

                }
            }
        });
    }

    //get current location using Geolocation
     $('.getCurrentLocation').click(function () {
         if (navigator.geolocation) {
             navigator.geolocation.getCurrentPosition(showPosition);
         }
         else{
             window.alert("Geolocation is not supported by this browser.")
         }
     })
    function showPosition(position) {
        userLat = position.coords.latitude;
        userLng = position.coords.longitude;
        userLocation = {lat : userLat, lng :userLng};
        geocodeLatLng();
        if(userMarker){
            userMarker.setMap(null)
            userMarkerProperties = {
                position : {lat : userLat, lng :userLng} ,
                map:map,
                animation: google.maps.Animation.DROP,
                draggable:true
            }
            userMarker = new google.maps.Marker(userMarkerProperties);
            var userInfoWindow = new google.maps.InfoWindow({
                content:"Your Current Location"
            });
            google.maps.event.addListener(userMarker, 'mouseover', function(){
                userInfoWindow.open(map, userMarker);
            })
            google.maps.event.addListener(userMarker, 'mouseout', function(){
                userInfoWindow.close();
            })
            getRoute();
        }
        else{
            userMarkerProperties = {
                position : {lat : userLat, lng :userLng},
                animation: google.maps.Animation.DROP,
                draggable:true
            }

            userMarker = new google.maps.Marker(userMarkerProperties);
            userMarker.setMap(map);
            var userInfoWindow = new google.maps.InfoWindow({
                content:"Your Current Location"
            });
            google.maps.event.addListener(userMarker, 'mouseover', function(){
                userInfoWindow.open(map, userMarker);
            })
            google.maps.event.addListener(userMarker, 'mouseout', function(){
                userInfoWindow.close();
            })
            getRoute();

        }

        //geolocation errors
        function showError(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    window.alert("User denied the request for Geolocation.")
                    break;
                case error.POSITION_UNAVAILABLE:
                    window.alert("Location information is unavailable.")
                    break;
                case error.TIMEOUT:
                    window.alert("The request to get user location timed out.")
                    break;
                case error.UNKNOWN_ERROR:
                    window.alert("An unknown error occurred.")
                    break;
            }
        }
    }





    // Get Route
    //
    var input = document.getElementById('input_box');
    var inputOptions = {
        types:['(regions)']
    }
    var autocomplete = new google.maps.places.Autocomplete(input, inputOptions);

});
