fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLatitude},${userLongitude}&key=AIzaSyBs0DXvW7g88kD3-OS7i4HXHzl_oPAP1LQ`
    )
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });


function initMap() {
    let location = new Object();
    navigator.geolocation.getCurrentPosition(function(pos) {
        location.lat = pos.coords.latitude;
        location.long = pos.coords.longitude;
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: location.lat, lng: location.long },
            zoom: 15
        });
        getRestaurants(location);

    });
}

function getRestaurants(location) {
    var pyrmont = new google.maps.LatLng(location.lat, location.long);
    var request = {
        location: pyrmont,
        radius: '1500',
        type: ['restaurant']
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServicesStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var palce = results[i];
            let price = createPrice(place.price_level);
            let content = `${place.name} ${plca.vicinity} `
            console.log(results)
        }
    }
}