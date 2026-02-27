const API_URL = "https://script.google.com/macros/s/AKfycbzQ91OTWx9kiuN7oGs9xNBJoG8nkWPxLQzREiYLC2tXh2tVegZ1hb8Sp2VVHdJCPXCkgA/exec";
const LIVE_BUS = "APSRTC-EXP-01";

const maxCapacity = 40;

let simulatedPassengers = {};
let currentPassengers = 0;

const filledSeatsDisplay = document.getElementById('filled-seats');
const availableSeatsDisplay = document.getElementById('available-seats');
const maxCapacityDisplay = document.getElementById('max-capacity');

const statusCard = document.getElementById('status-card');
const statusBadge = document.getElementById('status-badge');
const statusIcon = document.getElementById('status-icon');

const lastEventDisplay = document.getElementById('last-event');
const lastEventTime = document.getElementById('last-event-time');
const clockDisplay = document.getElementById('clock');

const busSelect = document.getElementById('bus-select');

maxCapacityDisplay.innerText = maxCapacity;

/* ----------------------------- */
/* SIMULATION FOR OTHER BUSES    */
/* ----------------------------- */

function initializeSimulation() {
    const buses = [
        "APSRTC-INDRA-01",
        "APSRTC-ULTRA-01",
        "APSRTC-DELUXE-01"
    ];

    buses.forEach(bus => {
        simulatedPassengers[bus] = Math.floor(Math.random() * 35);
    });
}

function simulateSensorEvent(bus) {

    let rand = Math.random();
    let eventType = null;

    let passengers = simulatedPassengers[bus];

    if (passengers >= maxCapacity) {
        if (rand > 0.4 && passengers > 0) {
            passengers--;
            eventType = "Passenger Exited";
        }
    } else if (passengers <= 0) {
        if (rand > 0.4) {
            passengers++;
            eventType = "Passenger Entered";
        }
    } else {
        if (rand > 0.65) {
            passengers++;
            eventType = "Passenger Entered";
        } else if (rand < 0.35) {
            passengers--;
            eventType = "Passenger Exited";
        }
    }

    simulatedPassengers[bus] = passengers;

    return eventType;
}

/* ----------------------------- */
/* LIVE BUS FETCH                */
/* ----------------------------- */

async function fetchLiveBusData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const bus = data.find(b => b.busNumber === LIVE_BUS);

        if (bus) {
            currentPassengers = parseInt(bus.filledSeats);
            updateDashboardUI(null);
        }
    } catch (error) {
        console.log("Live fetch error:", error);
    }
}

/* ----------------------------- */
/* UI UPDATE FUNCTION            */
/* ----------------------------- */

function updateDashboardUI(eventType) {

    const prevCount = parseInt(filledSeatsDisplay.innerText);
    filledSeatsDisplay.innerText = currentPassengers;
    availableSeatsDisplay.innerText = maxCapacity - currentPassengers;

    if (prevCount !== currentPassengers) {
        filledSeatsDisplay.classList.remove('update-anim');
        void filledSeatsDisplay.offsetWidth;
        filledSeatsDisplay.classList.add('update-anim');
    }

    if (currentPassengers >= maxCapacity) {
        statusCard.className = 'stat-card status danger animated danger-pulse';
        statusBadge.innerText = 'BUS FULL';
        statusIcon.className = 'fa-solid fa-triangle-exclamation';
    } else {
        statusCard.className = 'stat-card status success animated';
        statusBadge.innerText = 'Seats Available';
        statusIcon.className = 'fa-solid fa-check-circle';
    }

    if (eventType) {
        lastEventDisplay.innerText = eventType;
        lastEventTime.innerText = new Date().toLocaleTimeString();

        lastEventDisplay.classList.remove('update-anim');
        void lastEventDisplay.offsetWidth;
        lastEventDisplay.classList.add('update-anim');
    }
}

/* ----------------------------- */
/* MAIN REFRESH LOGIC            */
/* ----------------------------- */

function refreshSystem() {

    const selectedBus = busSelect.value;

    if (selectedBus === LIVE_BUS) {
        fetchLiveBusData();
    } else {
        const eventType = simulateSensorEvent(selectedBus);
        currentPassengers = simulatedPassengers[selectedBus];
        updateDashboardUI(eventType);
    }
}

/* ----------------------------- */
/* CLOCK                         */
/* ----------------------------- */

function updateClock() {
    clockDisplay.innerText = new Date().toLocaleTimeString();
}

/* ----------------------------- */
/* INIT                          */
/* ----------------------------- */

initializeSimulation();
updateClock();
updateDashboardUI("System Initialized");

setInterval(updateClock, 1000);
setInterval(refreshSystem, 3000);

busSelect.addEventListener("change", () => {
    refreshSystem();
});
