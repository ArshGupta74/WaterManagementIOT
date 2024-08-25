
Flash this code to your arduino using arduino IDE
``` #include <Wire.h>
// Pin definitions
const int TBDPin = A0;
#define echoPin 2
#define trigPin 4
#define relayPin 7  // Define the pin connected to the relay

// Variables
int TBDValue = 0;
long duration, distance;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(relayPin, OUTPUT);  // Set the relay pin as an output
  digitalWrite(relayPin, LOW);  // Make sure the relay is off initially
  delay(1000);
}

void loop() {
  // Turbidity sensor reading
  TBDValue = analogRead(TBDPin);

  // Ultrasonic sensor reading
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  distance = duration / 58.2;

  // Print readings in JSON format
//  Serial.print("{\"turbidity\":");
//  Serial.print(TBDValue);
//  Serial.print(",\"distance\":");
//  Serial.println(distance);
//  Serial.println("}");
  char jsonBuffer[50];
  snprintf(jsonBuffer, sizeof(jsonBuffer), "{\"turbidity\":%d,\"distance\":%ld}", TBDValue, distance);
  Serial.println(jsonBuffer);

  // Control the water pump based on ultrasonic distance
  if (distance < 50) {  // Turn on pump if distance is greater than 50 cm
    digitalWrite(relayPin, HIGH);  // Turn on the relay (and the pump)
  } else {
    digitalWrite(relayPin, LOW);  // Turn off the relay (and the pump)
  }

  delay(1000);  // Delay for 1 second before the next reading
}
```


