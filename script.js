const API_URL = "https://script.google.com/macros/s/AKfycbzQ91OTWx9kiuN7oGs9xNBJoG8nkWPxLQzREiYLC2tXh2tVegZ1hb8Sp2VVHdJCPXCkgA/exec";
const LIVE_BUS = "APSRTC-EXP-01";

const maxCapacity = 40;

let routeData = [];
let liveBusData = [];

let simulatedPassengers = {};

let currentBus = null;
let currentPassengers = 0;

/* DASHBOARD ELEMENTS */

const filledSeatsDisplay = document.getElementById("filled-seats");
const availableSeatsDisplay = document.getElementById("available-seats");
const maxCapacityDisplay = document.getElementById("max-capacity");

const statusCard = document.getElementById("status-card");
const statusBadge = document.getElementById("status-badge");
const statusIcon = document.getElementById("status-icon");

const lastEventDisplay = document.getElementById("last-event");
const lastEventTime = document.getElementById("last-event-time");

const clockDisplay = document.getElementById("clock");

const busSelector = document.getElementById("bus-selector");
const busSelect = document.getElementById("bus-select");

const statsGrid = document.getElementById("stats-grid");

maxCapacityDisplay.innerText = maxCapacity;


/* LOAD BACKEND DATA */

async function loadBackendData(){

try{

const response = await fetch(API_URL);
const data = await response.json();

routeData = data.routes;
liveBusData = data.liveData;

}catch(error){

console.log("API Error",error);

}

}


/* ROUTE SEARCH */

function searchRoutes(){

const from = document.getElementById("from-select").value;
const to = document.getElementById("to-select").value;

const results = document.getElementById("route-results");

results.innerHTML = "";

if(!from || !to){
results.innerHTML = "<p>Please select route locations.</p>";
return;
}

const matches = routeData.filter(route => route.from === from && route.to === to);

if(matches.length === 0){

results.innerHTML = "<p>No buses found on this route.</p>";
return;

}

matches.forEach(route=>{

const card = document.createElement("div");

card.className="bus-card";

card.innerHTML = `
<div class="bus-name">${route.busNumber}</div>
<div class="bus-detail">Departure: ${route.departure}</div>
<div class="bus-detail">Fare: ₹${route.fare}</div>
`;

card.onclick=()=>{
selectBus(route.busNumber);
};

results.appendChild(card);

});

}


/* BUS CARD CLICK */

function selectBus(busNumber){

currentBus = busNumber;

busSelect.value = busNumber;

busSelector.style.display = "flex";

statsGrid.style.display = "grid";

refreshSystem();

}


/* SIMULATION INIT */

function initializeSimulation(){

const buses = [
"APSRTC-INDRA-01",
"APSRTC-ULTRA-01",
"APSRTC-DELUXE-01",
"APSRTC-SL-03"
];

buses.forEach(bus=>{
simulatedPassengers[bus] = Math.floor(Math.random()*35);
});

}


/* SIMULATED SENSOR EVENTS */

function simulateSensorEvent(bus){

let rand = Math.random();

let eventType = null;

let passengers = simulatedPassengers[bus];

if(passengers >= maxCapacity){

if(rand > 0.4 && passengers > 0){
passengers--;
eventType = "Passenger Exited";
}

}

else if(passengers <= 0){

if(rand > 0.4){
passengers++;
eventType = "Passenger Entered";
}

}

else{

if(rand > 0.65){
passengers++;
eventType = "Passenger Entered";
}

else if(rand < 0.35){
passengers--;
eventType = "Passenger Exited";
}

}

simulatedPassengers[bus] = passengers;

return eventType;

}


/* FETCH LIVE BUS DATA */

async function fetchLiveBusData(){

try{

const response = await fetch(API_URL);
const data = await response.json();

liveBusData = data.liveData;

const bus = liveBusData.find(b=>b.busNumber === LIVE_BUS);

if(bus){

currentPassengers = parseInt(bus.filledSeats);

updateDashboardUI(null);

}

}catch(error){

console.log("Live Fetch Error",error);

}

}


/* DASHBOARD UPDATE */

function updateDashboardUI(eventType){

filledSeatsDisplay.innerText = currentPassengers;

availableSeatsDisplay.innerText = maxCapacity - currentPassengers;

if(currentPassengers >= maxCapacity){

statusCard.className="stat-card status danger animated danger-pulse";

statusBadge.innerText="BUS FULL";

statusIcon.className="fa-solid fa-triangle-exclamation";

}

else{

statusCard.className="stat-card status success animated";

statusBadge.innerText="Seats Available";

statusIcon.className="fa-solid fa-check-circle";

}

if(eventType){

lastEventDisplay.innerText = eventType;

lastEventTime.innerText = new Date().toLocaleTimeString();

}

}


/* MAIN SYSTEM REFRESH */

function refreshSystem(){

if(!currentBus) return;

if(currentBus === LIVE_BUS){

fetchLiveBusData();

}

else{

const eventType = simulateSensorEvent(currentBus);

currentPassengers = simulatedPassengers[currentBus];

updateDashboardUI(eventType);

}

}


/* CLOCK */

function updateClock(){

clockDisplay.innerText = new Date().toLocaleTimeString();

}


/* INIT */

initializeSimulation();

loadBackendData();

updateClock();

setInterval(updateClock,1000);

setInterval(refreshSystem,3000);


/* BUS SELECTOR CHANGE */

busSelect.addEventListener("change",()=>{

currentBus = busSelect.value;

refreshSystem();

});

