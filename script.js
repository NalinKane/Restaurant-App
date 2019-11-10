function initMap() {
    let location = new Object();
    navigator.geolocation.getCurrentPosition(function(pos) {
        location.lat = pos.coords.latitude;
        location.long = pos.coords.longitude;
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: location.lat, lng: location.long },
            zoom: 15
        });

        console.log(location)
            // get the location;


    });
}