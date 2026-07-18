#include <WiFi.h>
#include <Wire.h>
#include <HTTPClient.h>
#include <LiquidCrystal_I2C.h>
#include <ESP32Servo.h>

constexpr uint8_t TRIG_A = 25;
constexpr uint8_t ECHO_A = 26;
constexpr uint8_t TRIG_B = 32;
constexpr uint8_t ECHO_B = 33;
constexpr uint8_t GREEN_LED = 14;
constexpr uint8_t RED_LED = 13;
constexpr uint8_t SERVO_PIN = 27;

constexpr int TRIGGER_DISTANCE_CM = 70;
constexpr unsigned long DETECTION_TIMEOUT_MS = 400;
constexpr int MAX_CAPACITY = 5;

LiquidCrystal_I2C lcd(0x27, 16, 2);
Servo doorServo;

const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

const String GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbytBGLfWm60o8DXNQeL0yl-OvDCl_nVxOKMfEXmFC9UTldDaX_5e7t_UyjQ9UDT4XnGlA/exec";
const String BUS_NUMBER = "APSRTC-EXP-01";

int passengerCount = 0;
int detectionState = 0;
unsigned long triggerTime = 0;

float readDistance(uint8_t trigPin, uint8_t echoPin) {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    long duration = pulseIn(echoPin, HIGH, 30000);

    if (duration == 0)
        return -1;

    return duration * 0.0343 / 2;
}

void controlDoor() {
    doorServo.write(passengerCount < MAX_CAPACITY ? 90 : 0);
}

void updateDisplay() {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Passengers:");
    lcd.print(passengerCount);

    lcd.setCursor(0, 1);

    if (passengerCount < MAX_CAPACITY) {
        lcd.print("Seats:");
        lcd.print(MAX_CAPACITY - passengerCount);
        digitalWrite(GREEN_LED, HIGH);
        digitalWrite(RED_LED, LOW);
    } else {
        lcd.print("BUS FULL");
        digitalWrite(GREEN_LED, LOW);
        digitalWrite(RED_LED, HIGH);
    }

    controlDoor();
}

void sendBusData() {
    if (WiFi.status() != WL_CONNECTED)
        return;

    HTTPClient http;
    http.begin(GOOGLE_SCRIPT_URL);
    http.addHeader("Content-Type", "application/json");

    String json = "{";
    json += "\"busNumber\":\"" + BUS_NUMBER + "\",";
    json += "\"totalSeats\":" + String(MAX_CAPACITY) + ",";
    json += "\"filledSeats\":" + String(passengerCount);
    json += "}";

    int responseCode = http.POST(json);

    Serial.print("HTTP Response: ");
    Serial.println(responseCode);

    http.end();
}

void connectWiFi() {
    WiFi.begin(ssid, password);

    lcd.clear();
    lcd.print("Connecting WiFi");

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    lcd.clear();
    lcd.print("WiFi Connected");
    delay(1500);
}

void setup() {
    Serial.begin(115200);

    pinMode(TRIG_A, OUTPUT);
    pinMode(ECHO_A, INPUT);
    pinMode(TRIG_B, OUTPUT);
    pinMode(ECHO_B, INPUT);

    pinMode(GREEN_LED, OUTPUT);
    pinMode(RED_LED, OUTPUT);

    lcd.init();
    lcd.backlight();

    doorServo.attach(SERVO_PIN);
    doorServo.write(90);

    connectWiFi();
    updateDisplay();
    sendBusData();
}

void loop() {
    float distanceA = readDistance(TRIG_A, ECHO_A);
    delay(20);
    float distanceB = readDistance(TRIG_B, ECHO_B);

    if (distanceA > 0 && distanceA < TRIGGER_DISTANCE_CM && detectionState == 0) {
        detectionState = 1;
        triggerTime = millis();
    }

    if (distanceB > 0 && distanceB < TRIGGER_DISTANCE_CM && detectionState == 0) {
        detectionState = 2;
        triggerTime = millis();
    }

    if (detectionState == 1) {
        if (distanceB > 0 && distanceB < TRIGGER_DISTANCE_CM) {
            if (passengerCount < MAX_CAPACITY) {
                passengerCount++;
                Serial.println("Passenger Entered");
            }

            updateDisplay();
            sendBusData();

            detectionState = 0;
            delay(250);
        } else if (millis() - triggerTime > DETECTION_TIMEOUT_MS) {
            detectionState = 0;
        }
    }

    if (detectionState == 2) {
        if (distanceA > 0 && distanceA < TRIGGER_DISTANCE_CM) {
            if (passengerCount > 0) {
                passengerCount--;
                Serial.println("Passenger Exited");
            }

            updateDisplay();
            sendBusData();

            detectionState = 0;
            delay(250);
        } else if (millis() - triggerTime > DETECTION_TIMEOUT_MS) {
            detectionState = 0;
        }
    }
}
