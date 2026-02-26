const maxCapacity = 40;
let currentPassengers = 35; // Start near full capacity to quickly demonstrate the "BUS FULL" feature

const countDisplay = document.getElementById('passenger-count');
const statusCard = document.getElementById('status-card');
const statusBadge = document.getElementById('status-badge');
const statusIcon = document.getElementById('status-icon');
const lastEventDisplay = document.getElementById('last-event');
const lastEventTime = document.getElementById('last-event-time');
const clockDisplay = document.getElementById('clock');

// Automatically handle the mock events to simulate hardware updates
function refreshDashboardSensors() {
    simulateSensorEvent();
}

// Mock system that emulates ESP32/Ultrasonic sensor data changes
function simulateSensorEvent() {
    const rand = Math.random();
    let eventType = null;
    let eventOccurred = false;
    
    if (currentPassengers >= maxCapacity) {
        // High tendency to decrease if full
        if (rand > 0.4 && currentPassengers > 0) {
            currentPassengers--;
            eventType = 'Passenger Exited';
            eventOccurred = true;
        }
    } else if (currentPassengers <= 0) {
        // Only allow entry if empty
        if (rand > 0.4) {
            currentPassengers++;
            eventType = 'Passenger Entered';
            eventOccurred = true;
        }
    } else {
        // Randomly enter or exit
        if (rand > 0.65) {
            currentPassengers++;
            eventType = 'Passenger Entered';
            eventOccurred = true;
        } else if (rand < 0.35) {
            currentPassengers--;
            eventType = 'Passenger Exited';
            eventOccurred = true;
        }
    }
    
    if (eventOccurred) {
        updateDashboardUI(eventType);
    }
}

function updateDashboardUI(eventType) {
    // 1. Update Count Tracker
    const prevCount = parseInt(countDisplay.innerText);
    countDisplay.innerText = currentPassengers;
    
    // Add visual bounce animation on change
    if (prevCount !== currentPassengers) {
        countDisplay.classList.remove('update-anim');
        void countDisplay.offsetWidth; // trigger reflow
        countDisplay.classList.add('update-anim');
    }

    // 2. Update System Capacity Status badge and icon
    if (currentPassengers >= maxCapacity) {
        statusCard.className = 'stat-card status danger animated danger-pulse';
        statusBadge.innerText = 'BUS FULL';
        statusIcon.className = 'fa-solid fa-triangle-exclamation';
    } else {
        statusCard.className = 'stat-card status success animated';
        statusBadge.innerText = 'Seats Available';
        statusIcon.className = 'fa-solid fa-check-circle';
    }

    // 3. Update Last Detected Event logs
    if (eventType) {
        lastEventDisplay.innerText = eventType;
        const now = new Date();
        lastEventTime.innerText = now.toLocaleTimeString();
        
        lastEventDisplay.classList.remove('update-anim');
        void lastEventDisplay.offsetWidth;
        lastEventDisplay.classList.add('update-anim');
    }
}

// Keeps the system clock running
function updateClock() {
    const now = new Date();
    clockDisplay.innerText = now.toLocaleTimeString();
}

// Initialize on page load
document.getElementById('max-capacity').innerText = maxCapacity;
updateDashboardUI('System Initialized');
updateClock();

// Event hooks to establish automatic looping based on the timer configuration 
setInterval(updateClock, 1000); 

// Requirement: Auto-refresh every 2 seconds simulating new web data
setInterval(refreshDashboardSensors, 2000);
