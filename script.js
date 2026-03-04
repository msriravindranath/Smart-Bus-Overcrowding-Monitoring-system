const API_URL = "https://script.google.com/macros/s/AKfycbzQ91OTWx9kiuN7oGs9xNBJoG8nkWPxLQzREiYLC2tXh2tVegZ1hb8Sp2VVHdJCPXCkgA/exec";

const LIVE_BUS = "APSRTC-EXP-01";

/* DATA STORAGE */

let routes = [];
let buses = [];

let simulatedPassengers = {};

let currentBus = null;


/* DASHBOARD ELEMENTS */

const filledSeatsDisplay = document.getElementById("filled-seats");
const availableSeatsDisplay = document.getElementById("available-seats");
const totalSeatsDisplay = document.getElementById("total-seats");

const statusBadge = document.getElementById("status-badge");
const statusIcon = document.getElementById("status-icon");

const lastEventDisplay = document.getElementById("last-event");
const lastEventTime = document.getElementById("last-event-time");

const clockDisplay = document.getElementById("clock");

const fromSelect = document.getElementById("from-select");
const toSelect = document.getElementById("to-select");

const routeResults = document.getElementById("route-results");

const busSelector = document.getElementById("bus-selector");
const busSelect = document.getElementById("bus-select");

const statsGrid = document.getElementById("stats-grid");


/* CLOCK */

function updateClock(){
clockDisplay.innerText = new Date().toLocaleTimeString();
}

setInterval(updateClock,1000);
updateClock();


/* LOAD DATA FROM BACKEND */

async function loadData(){

const response = await fetch(API_URL);

const data = await response.json();

routes = data.routes;
buses = data.liveData;

initializeSimulation();

buildRouteDropdowns();

buildBusSelector();

}

loadData();


/* UNIQUE CITY DROPDOWNS */

function buildRouteDropdowns(){

fromSelect.innerHTML = "";
toSelect.innerHTML = "";

let citySet = new Set();

routes.forEach(route=>{

if(route.from) citySet.add(route.from);
if(route.to) citySet.add(route.to);

});

let cities = Array.from(citySet).sort();

cities.forEach(city=>{

let option1 = document.createElement("option");
option1.value = city;
option1.text = city;

let option2 = option1.cloneNode(true);

fromSelect.appendChild(option1);
toSelect.appendChild(option2);

});

}


/* BUS SELECTOR */

function buildBusSelector(){

busSelect.innerHTML = "";

buses.forEach(bus=>{

let option = document.createElement("option");

option.value = bus.busNumber;
option.text = bus.busNumber;

busSelect.appendChild(option);

});

}


/* ROUTE SEARCH */

function searchRoutes(){

const from = fromSelect.value;
const to = toSelect.value;

routeResults.innerHTML = "";

const matches = routes.filter(route=>route.from===from && route.to===to);

if(matches.length === 0){

routeResults.innerHTML = "<p>No buses available.</p>";
return;

}

matches.forEach(route=>{

const card = document.createElement("div");

card.className = "bus-card";

card.innerHTML = `
<div class="bus-name">${route.busNumber}</div>
<div class="bus-detail">Departure: ${route.departure}</div>
<div class="bus-detail">Fare: ₹${route.fare}</div>
`;

card.onclick = ()=>selectBus(route.busNumber);

routeResults.appendChild(card);

});

}


/* BUS CARD CLICK */

function selectBus(busNumber){

currentBus = busNumber;

busSelector.style.display = "flex";
statsGrid.style.display = "grid";

busSelect.value = busNumber;

updateDashboard();

}


/* BUS DROPDOWN CHANGE */

busSelect.addEventListener("change",()=>{

currentBus = busSelect.value;

updateDashboard();

});


/* INITIALIZE SIMULATION */

function initializeSimulation(){

buses.forEach(bus=>{

simulatedPassengers[bus.busNumber] =
Math.floor(Math.random()*bus.totalSeats);

});

}


/* SIMULATED PASSENGER MOVEMENT */

function simulateBus(bus){

let passengers = simulatedPassengers[bus.busNumber];

let rand = Math.random();

let event = null;

if(passengers >= bus.totalSeats){

if(rand>0.4){

passengers--;
event = "Passenger Exited";

}

}

else if(passengers <= 0){

if(rand>0.4){

passengers++;
event = "Passenger Entered";

}

}

else{

if(rand>0.65){

passengers++;
event = "Passenger Entered";

}

else if(rand<0.35){

passengers--;
event = "Passenger Exited";

}

}

simulatedPassengers[bus.busNumber] = passengers;

return event;

}


/* DASHBOARD UPDATE */

function updateDashboard(){

if(!currentBus) return;

let bus = buses.find(b=>b.busNumber===currentBus);

if(!bus) return;

let totalSeats = bus.totalSeats;

let filledSeats;
let event = null;


/* LIVE BUS */

if(currentBus === LIVE_BUS){

filledSeats = parseInt(bus.filledSeats);

}


/* SIMULATED BUS */

else{

event = simulateBus(bus);

filledSeats = simulatedPassengers[bus.busNumber];

}


/* UPDATE UI */

let availableSeats = totalSeats - filledSeats;

filledSeatsDisplay.innerText = filledSeats;
availableSeatsDisplay.innerText = availableSeats;
totalSeatsDisplay.innerText = totalSeats;


/* STATUS */

if(availableSeats<=0){

statusBadge.innerText = "BUS FULL";
statusIcon.className = "fa-solid fa-triangle-exclamation";

}

else{

statusBadge.innerText = "Seats Available";
statusIcon.className = "fa-solid fa-check-circle";

}


/* EVENT DISPLAY */

if(event){

lastEventDisplay.innerText = event;
lastEventTime.innerText = new Date().toLocaleTimeString();

}

}


/* AUTO UPDATE */

setInterval(()=>{

if(!currentBus) return;

/* reload backend for live bus */

if(currentBus === LIVE_BUS){

loadData().then(updateDashboard);

}

else{

updateDashboard();

}

},3000);
