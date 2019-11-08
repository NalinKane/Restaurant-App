
const getLocationButton = document.querySelector(`#get-location`);
const searchButton = document.querySelector(`#search-by-location`);
const restaurantsReturned = document.querySelector(`#restaurant-returned`);
let userLatitude = ``;
let userLongitude = ``;

getLocationButton.addEventListener(`click`, event => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position){
        userLatitude = position.coords.latitude;
        userLongitude = position.coords.longitude;
        fetch (`https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLatitude},${userLongitude}&key=AIzaSyDUU-niRiyVVeS9DtXJswEOVHjiBJevfno`)
            .then(response => response.json())
            .then(data =>{
                console.log(data)
            });
        });
        } else { 
        getLocationButton.innerHTML = "N/A";
    };
});

searchButton.addEventListener(`click`, event => {
    fetch(`https://developers.zomato.com/api/v2.1/search?lat=${userLatitude}&lon=${userLongitude}&apikey=969dccb114a560b6d4df35b25a8e6418`)
        .then(repsonse => repsonse.json())
        .then(data => {
            console.log(data)
            data.restaurants.forEach(restaurant =>{
                const fragment = document.createDocumentFragment();
                const restaurantCard = document.createElement(`div`);
                const restaurantInfo = document.createElement(`div`);
                const restaurantName = document.createElement(`h2`);
                const restaurantCuisine = document.createElement(`p`);
                const restaurantPhoto = document.createElement(`img`);
                const averageCostForTwo = document.createElement(`p`);
                const address = document.createElement(`p`);
                const timings = document.createElement(`p`);
                const phoneNumber = document.createElement(`p`);
                const averageRating = document.createElement(`p`);
                fragment.appendChild(restaurantCard);
                restaurantCard.appendChild(restaurantName);
                restaurantCard.appendChild(restaurantPhoto);
                restaurantCard.appendChild(restaurantInfo);
                restaurantCard.appendChild(phoneNumber);
                restaurantCard.appendChild(averageRating);
                restaurantInfo.appendChild(restaurantCuisine);
                restaurantInfo.appendChild(averageCostForTwo);
                restaurantInfo.appendChild(address);
                restaurantInfo.appendChild(timings);
                restaurantName.textContent = restaurant.restaurant.name;
                restaurantPhoto.setAttribute(`src`, restaurant.restaurant.featured_image);
                phoneNumber.textContent = `Call on : ${restaurant.restaurant.phone_numbers}`;
                averageRating.textContent = `Avg.Rating ${restaurant.restaurant.user_rating.aggregate_rating}`;
                restaurantCuisine.textContent = `Type: ${restaurant.restaurant.cuisines}`;
                averageCostForTwo.textContent = `Avg. cost for two: ${restaurant.restaurant.average_cost_for_two}`;
                address.textContent = restaurant.restaurant.location.address;
                timings.textContent = restaurant.restaurant.timings;
                restaurantsReturned.appendChild(fragment);
            });
        });
});