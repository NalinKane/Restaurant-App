function initMap() {
    let location = new Object();
    navigator.geolocation.getCurrentPosition(function(pos) {
        location.lat = pos.coords.latitude;
        location.long = pos.coords.longitude;
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: location.lat, lng: location.long },
            zoom: 15
        });

        var currentLat = location.lat
        var currentLong = location.long
        console.log(currentLat)
        console.log(currentLong)
        var currentLocation = { lat: location.lat, lng: location.long };
        const searchButton = document.querySelector('#search-by-location');
        var marker = new google.maps.Marker({ position: currentLocation, map: map });
    });
}