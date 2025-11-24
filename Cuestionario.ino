#include <Servo.h>

// Pines de LEDs
const int ledCorrecto = 7;
const int ledIncorrecto = 8;

// Servo
Servo miServo;
const int servoPin = 9;

String input = "";

void setup() {
  pinMode(ledCorrecto, OUTPUT);
  pinMode(ledIncorrecto, OUTPUT);
  digitalWrite(ledCorrecto, LOW);
  digitalWrite(ledIncorrecto, LOW);

  miServo.attach(servoPin); // Conectar servo al pin 9
  miServo.write(90);        // Posición inicial (centro)

  Serial.begin(9600);
}

void loop() {
  // Si hay datos en el puerto serie
  while (Serial.available() > 0) {
    char c = Serial.read();

    if (c == '\n') {
      processCommand(input);
      input = ""; // limpiar buffer
    } else {
      input += c;
    }
  }
}

void processCommand(String command) {
  command.trim(); // quitar espacios extra

  if (command == "correcto") {
    digitalWrite(ledCorrecto, HIGH);
    delay(1000);
    digitalWrite(ledCorrecto, LOW);
    Serial.println("✅ LED correcto encendido");
  }
  else if (command == "incorrecto") {
    digitalWrite(ledIncorrecto, HIGH);

    // Mover el servo de 0° a 180° y de vuelta
    for (int pos = 0; pos <= 180; pos += 5) {
      miServo.write(pos);
      delay(15);
    }
    for (int pos = 180; pos >= 0; pos -= 5) {
      miServo.write(pos);
      delay(15);
    }

    delay(500); // pequeña pausa
    digitalWrite(ledIncorrecto, LOW);
    Serial.println("❌ LED incorrecto encendido + Servo movido");
  }
  else {
    Serial.print("Comando desconocido: ");
    Serial.println(command);
  }
}

