const getLocationButton = document.querySelector(`#get-location`);
const searchButton = document.querySelector(`#search-by-location`);
const restaurantsReturned = document.querySelector(`#restaurant-returned`);
const restaurantInfoModal = document.querySelector("#modal-restaurant-info");
const modalToggle = document.querySelector("#open-modal");
const modalClose = document.querySelector("#close-modal");

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

function openModal(event) {
  const targetID = event.target.getAttribute("data-id");
  const restaurantCard = document.querySelector(`#${targetID}`);
  console.log(restaurantCard);

  const restaurantContent = restaurantCard.querySelector(
    ".inside-restaurant-info"
  ).cloneNode(true);
  const modalContent = document.querySelector("#modal-content");
    modalContent.append(restaurantContent);

  restaurantInfoModal.classList.add("modal-open");
}

function closeModal() {
  
  restaurantInfoModal.classList.remove("modal-open");
  const modalContent = document.querySelector("#modal-content");
  modalContent.innerHTML = "";
}

document.addEventListener("click", function(event) {
  if (!event.target.matches(".open-more-info")) return;
  event.preventDefault();
  openModal(event);
});

modalClose.addEventListener("click", function(event) {
  event.preventDefault();
  closeModal();
  
  
});

searchButton.addEventListener(`click`, event => {
  fetch(
    `https://developers.zomato.com/api/v2.1/search?lat=${userLatitude}&lon=${userLongitude}&apikey=969dccb114a560b6d4df35b25a8e6418`
  )
    .then(repsonse => repsonse.json())
    .then(({ restaurants }) => {
      console.log(restaurants);
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

        const restaurantNode = `
            <div class="restaurant-card" id="restaurant-${id}">
                <img src="${featured_image}" class="photo" title="Photo of ${name}" />
                <div class="content">
                    <h2>${name}</h2>
                    <p class="phone">Call on : ${phone_numbers}</p>
                    <p class="rating">Avg.Rating ${user_rating.aggregate_rating}</p>
                    <button class="open-more-info" data-id="restaurant-${id}">View more</button>
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
    });
});
