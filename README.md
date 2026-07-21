# Smart Bus Overcrowding Monitoring System

## Project Overview

The Smart Bus Overcrowding Monitoring System is an IoT-based solution that monitors bus occupancy in real time using an ESP32 microcontroller and displays the occupancy status through a responsive web interface. The objective of this project is to improve passenger convenience by providing live occupancy information before boarding a bus.

---

## Features

* Real-time bus occupancy monitoring
* Live bus status dashboard
* Route search functionality
* Responsive web interface
* ESP32-based data acquisition
* Automatic data updates
* Occupancy status visualization

---

## Technologies Used

### Hardware

* ESP32 Development Board
* Sensors (as applicable)
* LCD Display (if applicable)
* Servo Motor (if applicable)

### Software

* Arduino IDE
* HTML5
* CSS3
* JavaScript
* Git
* GitHub

---

## Project Structure

```text
Smart-Bus-Overcrowding-Monitoring-System/
│
├── firmware/
│   └── esp32/
│       ├── smart_bus_monitor.ino
│       └── libraries.txt
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── hardware/
│   └── wiring_diagram.png
│
├── images/
│   ├── dashboard.png
│   ├── route_planner.png
│   └── esp32_setup.jpg
│
├── documentation/
│   └── Project_Report.pdf
│
├── README.md
├── LICENSE
└── .gitignore
```

---

## How It Works

1. The ESP32 monitors passenger occupancy using connected hardware.
2. The collected data is processed by the microcontroller.
3. Occupancy information is transmitted to the web application.
4. The frontend displays the current bus status.
5. Users can search routes and check occupancy before traveling.

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/msriravindranath/Smart-Bus-Overcrowding-Monitoring-System.git
```

### Firmware

1. Open `smart_bus_monitor.ino` using the Arduino IDE.
2. Install the required libraries listed in `libraries.txt`.
3. Update the Wi-Fi credentials if necessary.
4. Upload the code to the ESP32 board.

### Frontend

1. Open the `frontend` folder.
2. Launch `index.html` in any modern web browser.

---

## Screenshots

Add screenshots of the following components inside the `images` folder:

* Dashboard
* Route Search
* Live Bus Status
* ESP32 Hardware Setup

---

## Future Improvements

* GPS-based live bus tracking
* Cloud database integration
* Mobile application
* User authentication
* Push notifications
* Historical occupancy analytics
* AI-based passenger demand prediction
* Admin dashboard
* Multiple bus support

---

## Learning Outcomes

This project strengthened my understanding of:

* Embedded Systems
* ESP32 Programming
* Frontend Web Development
* Real-Time Monitoring Systems
* Git and GitHub
* Project Organization
* Problem Solving
* Software-Hardware Integration

---

## Contributing

Contributions, suggestions, and improvements are welcome.

To contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Commit your work.
5. Submit a Pull Request.

---

## License

This project is licensed under the MIT License.

---

## Author

**M. Sree Ravindranath**

Final-Year B.Tech in Electronics and Communication Engineering (ECE)

Interested in Embedded Systems, IoT, Software Development, and building practical real-world solutions.
