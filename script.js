const searchDistance = document.querySelector(`#search-by-location`);
const searchPrice = document.querySelector(`#search-by-price`);
const searchRating = document.querySelector(`#search-by-rating`);
const restaurantsReturned = document.querySelector(`#restaurant-returned`);
const restaurantInfoModal = document.querySelector("#modal-restaurant-info");
const modalToggle = document.querySelector("#open-modal");
const modalClose = document.querySelector("#close-modal");
const overlay = document.querySelector("#overlay");
let currentLat;
let currentLong;

let allRestaurants = [];
let restaurantMarkers = [];

function initMap() {

    let location = new Object();
    navigator.geolocation.getCurrentPosition(function(pos) {
        location.lat = pos.coords.latitude;
        location.long = pos.coords.longitude;
        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: location.lat, lng: location.long },
            zoom: 15,
        });
        currentLat = location.lat;
        currentLong = location.long;
        var currentLocation = { lat: location.lat, lng: location.long };
        const searchButton = document.querySelector("#search-by-location");
        var marker = new google.maps.Marker({
            position: currentLocation,
            map: map
        });
    });
}

function clearResults() {
    if (restaurantsReturned.hasChildNodes()) {
        while (restaurantsReturned.firstChild) {
            restaurantsReturned.removeChild(restaurantsReturned.firstChild);
        }
    }
    for (let i = 0; i < restaurantMarkers.length; i++) {
        restaurantMarkers[i].setMap(null);
    }
}

function openModal(event) {
    const targetID = event.target.getAttribute("data-id");
    const restaurantCard = document.querySelector(`#${targetID}`);

    overlay.classList.add("overlay-open");

    const restaurantContent = restaurantCard
        .querySelector(".inside-restaurant-info")
        .cloneNode(true);
    const modalContent = document.querySelector("#modal-content");
    modalContent.append(restaurantContent);

    restaurantInfoModal.classList.add("modal-open");
}

function closeModal(event) {
    event.preventDefault();
    restaurantInfoModal.classList.remove("modal-open");
    const modalContent = document.querySelector("#modal-content");
    modalContent.innerHTML = "";
    overlay.classList.remove("overlay-open");
}

document.addEventListener("click", function(event) {
    if (!event.target.matches(".open-more-info")) return;
    event.preventDefault();
    openModal(event);
});

modalClose.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

searchDistance.addEventListener(`click`, event => {
    clearResults();
    fetch(
            `https://developers.zomato.com/api/v2.1/search?lat=${currentLat}&lon=${currentLong}&apikey=969dccb114a560b6d4df35b25a8e6418&sort=real-distance`
        )
        .then(response => response.json())
        .then(({ restaurants }) => {
            allRestaurants = restaurants;
            createRestaurantsNodes(restaurants);
        });
});

searchPrice.addEventListener(`click`, () => {
    clearResults();
    fetch(
            `https://developers.zomato.com/api/v2.1/search?lat=${currentLat}&lon=${currentLong}&apikey=969dccb114a560b6d4df35b25a8e6418&sort=cost`
        )
        .then(response => response.json())
        .then(({ restaurants }) => {
            allRestaurants = restaurants;
            createRestaurantsNodes(restaurants);
        });
});

searchRating.addEventListener(`click`, () => {
    clearResults();
    fetch(
            `https://developers.zomato.com/api/v2.1/search?lat=${currentLat}&lon=${currentLong}&apikey=969dccb114a560b6d4df35b25a8e6418&sort=rating`
        )
        .then(response => response.json())
        .then(({ restaurants }) => {
            allRestaurants = restaurants;
            createRestaurantsNodes(restaurants);
        });
});

function createRestaurantsNodes(restaurants) {
    const filters = document.querySelector(".filters");
    let restaurantBounds = new google.maps.LatLngBounds();

    restaurants.map(({ restaurant }) => {
        const {
            name,
            featured_image,
            cuisines,
            average_cost_for_two,
            location,
            timings,
            phone_numbers,
            user_rating,
            id
        } = restaurant;

        function setMarkers(map, location) {

            let restaurantLat = Number(restaurant.location.latitude)
            let restaurantLong = Number(restaurant.location.longitude)

            let image = 'http://maps.google.com/mapfiles/kml/pal2/icon40.png';

            let restaurantLatLng = new google.maps.LatLng({ lat: restaurantLat, lng: restaurantLong });
            let restaurantMarker = new google.maps.Marker({ position: restaurantLatLng, map: map, icon: image });

            restaurantBounds.extend(restaurantLatLng);
            restaurantMarkers.push(restaurantMarker);
        };

        setMarkers(map, location);

        const restaurantNode = `
            <div class="restaurant-card" id="restaurant-${id}">
            <img src="${featured_image}" class="photo" title="Photo of ${name}" />
                <div class="content">
                    <h2 class="card-text card-title">${name}</h2>
                    <p class="card-text phone">Call on : ${phone_numbers}</p>
                    <p class="card-text rating">Avg.Rating ${user_rating.aggregate_rating}</p>
                    <button class="open-more-info button" data-id="restaurant-${id}">View more</button>
                </div>
                <div class="restaurant-info">
                    <div class="inside-restaurant-info">
                        <p class="couisine">Type: ${cuisines}</p>
                        <p class="cost-for-two">Avg. cost for two: ${average_cost_for_two}</p>
                        <p class="address">${location.address}</p>
                        <p class="timings">${timings}</p>
                    </div>
                </div>
            </div>
    `;
        restaurantsReturned.innerHTML += restaurantNode;
    });

    map.fitBounds(restaurantBounds);
    map.setCenter(restaurantBounds.getCenter());
    filters.classList.add("filters-open");
}

const filterBy = document.querySelector("#filterBy");

filterBy.addEventListener("click", () => {
    const filterInput = document.querySelector("#filterValue");
    const cuisine = filterInput.value;

    const filtered = filterRestaurantBy(cuisine);

    restaurantsReturned.innerHTML = "";
    createRestaurantsNodes(filtered);
});

function filterRestaurantBy(cuisine) {
    return allRestaurants.filter(({ restaurant }) => {
        const foundCuisine = restaurant.cuisines.toLowerCase();
        return foundCuisine.indexOf(cuisine.toLowerCase()) > -1;
    });
}

// weather events
let weatherBtn = document.querySelector(`#get-temp`);
let modalW = document.querySelector("#modal-content-weather");
let closeBtn = document.querySelector("#close-button-weather");

closeBtn.addEventListener("click", closeWeatherModal);

function closeWeatherModal() {
    modalW.style.display = "none";
}

weatherBtn.addEventListener("click", event => {
    event.preventDefault();

    fetch(
            `https://api.aerisapi.com/observations//observations/within?p=${currentLat},${currentLong}&radius=50mi&?&format=json&filter=allstations&limit=1&client_id=585ogEC4h46JkqCAispBp&client_secret=ZNE2lts94FU5sr2iMubHUpWAlwlUsiWZBXVmDBSO`
        )
        .then(response => response.json())
        .then(response => {

            const tempElement = document.querySelector(`#temperature`);
            const realFeel = document.querySelector("#real-feel");
            const weather = response.response.ob.tempC
            const climate = response.response.ob.weather.toLowerCase()
            const windChill = response.response.ob.windchillC;

            tempElement.textContent = ` Temperature : ${weather}°C.`;
            realFeel.textContent = `It is ${climate} and the RealFeel is ${windChill}°C.`;
            modalW.style.display = "block";

        });
});