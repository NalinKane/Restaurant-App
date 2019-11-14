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

function initMap() {
  let location = new Object();
  navigator.geolocation.getCurrentPosition(function(pos) {
    location.lat = pos.coords.latitude;
    location.long = pos.coords.longitude;
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: location.lat, lng: location.long },
      zoom: 15
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
    console.log(restaurantLat)

    // restaurants.forEach((restaurant) => {
    let restaurantLocation = { lat: restaurantLat, lng: restaurantLong };
    console.log(restaurantLocation)
    let restaurantMarker = new google.maps.Marker({ position: restaurantLocation, map: map });
        
        
    let image = 'http://maps.google.com/mapfiles/kml/pal2/icon40.png'
        
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
}
const filterBy = document.querySelector("#filterBy");

filterBy.addEventListener("click", () => {
  const filterInput = document.querySelector("#filterValue");
  const cuisine = filterInput.value;

  const filtered = filterRestaurantBy(cuisine);
  console.log(`I've found ${filtered.length} ${cuisine} restaurants`, filtered);

  restaurantsReturned.innerHTML = "";
  createRestaurantsNodes(filtered);
});

function filterRestaurantBy(cuisine) {
  return allRestaurants.filter(({ restaurant }) => {
    const foundCuisine = restaurant.cuisines.toLowerCase();
    return foundCuisine.indexOf(cuisine.toLowerCase()) > -1;
  });
}