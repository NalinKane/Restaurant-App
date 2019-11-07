\const getLocationButton = document.querySelector(`#get-location`);
const searchButton = document.querySelector(`#search-by-location`);
const restaurantsReturned = document.querySelector(`#restaurant-returned`);
let userLatitude = ``;
let userLongitude = ``;

getLocationButton.addEventListener(`click`, event => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      userLatitude = position.coords.latitude;
      userLongitude = position.coords.longitude;
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLatitude},${userLongitude}&key=AIzaSyDUU-niRiyVVeS9DtXJswEOVHjiBJevfno`
      )
        .then(response => response.json())
        .then(data => {
          console.log(data);
        });
    });
  } else {
    getLocationButton.innerHTML = "N/A";
  }
});

searchButton.addEventListener(`click`, event => {
  fetch(
    `https://developers.zomato.com/api/v2.1/search?lat=${userLatitude}&lon=${userLongitude}&apikey=969dccb114a560b6d4df35b25a8e6418`
  )
    .then(repsonse => repsonse.json())
    .then(data => {
      console.log(data);

      data.restaurants.forEach(restaurant => {
        const fragment = document.createDocumentFragment();
        const restaurantCard = document.createElement(`div`);
        const restaurantName = document.createElement(`h2`);
        const restaurantCuisine = document.createElement(`p`);
        fragment.appendChild(restaurantCard);
        restaurantCard.appendChild(restaurantName);
        restaurantCard.appendChild(restaurantCuisine);
        // restaurantCard.setAttribute(`href=${}`)
        restaurantName.textContent = restaurant.restaurant.name;
        restaurantCuisine.textContent = restaurant.restaurant.cuisines;
        restaurantsReturned.appendChild(fragment);
        console.log(restaurant.restaurant);
      });
    });
});
