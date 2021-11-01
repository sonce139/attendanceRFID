#include <ESP8266WiFi.h>
#include <Arduino_JSON.h>
#include <WiFiClientSecure.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

const char* ssid = "LHThanh";
const char* password = "14chuvanan";

const int httpsPort = 443;
const String host = "attendance-rfid.herokuapp.com";
const char fingerprint[] PROGMEM = "0c 39 35 5a 61 4b 02 6a 75 c6 1c 86 43 8e 61 86 07 8d 64 ae";

void setup() {
  // init step
  Serial.begin(115200);
  lcd.begin(16,2);
  lcd.init();
  lcd.backlight();

  // connect WIFI
  WiFi.begin(ssid, password); 
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  // lcd print
  lcd.setCursor(0, 0);
  lcd.print("Attendance RFID");
}

void loop() {
//  String payload = getStudent("19520158");
//  JSONVar student = JSON.parse(payload);
//
//  if (JSON.typeof(student) == "undifined") {
//    Serial.println("Student not exists");
//  }
//
//  Serial.println(student["name"]);
//  
//  for (int i = 0; i < student["classesEnrolled"].length(); i++) {
//    Serial.println(student["classesEnrolled"][i]["class_id"]);
//  }
//  
//  payload = postAttendance("CE224.M11", "19520158");
//  JSONVar attendance = JSON.parse(payload);
//
//  if (JSON.typeof(attendance) == "undifined") {
//    Serial.println("Attendance failed");
//  }
//  
//  Serial.println("Attendance succesed");
//  delay(500000);
  
}

String getStudent(String student_id) {
  String payload = "{}"; 

  WiFiClientSecure httpsClient;
  httpsClient.setFingerprint(fingerprint);
  httpsClient.setTimeout(2000);

  // connect
  Serial.println("HTTPS Connecting");
  if(!httpsClient.connect(host, httpsPort)) {
    return payload;
  }
  
  String url;
  url = "/students/" + student_id;

  Serial.print("requesting URL: ");
  Serial.println(host + url);

  // send request
  httpsClient.print(String("GET ") + url + " HTTP/1.1\r\n" +
                    "Host: " + host + "\r\n" +               
                    "Connection: close\r\n\r\n");

  // receive header
  while (httpsClient.connected()) {
    String header = httpsClient.readStringUntil('\n');
    if (header == "\r") {
      Serial.println("Receive header");
      break;
    }
  }

  // receive data
  while(httpsClient.available()){        
    payload = httpsClient.readStringUntil('\n');
  }
  httpsClient.stop();
  
  payload = payload.substring(1, payload.length()-1);
  return payload;
}

String postAttendance(String class_id, String student_id) {
  String payload = "{}"; 
  String time = "Mon Nov 01 2021 08:28:13 GMT+0700";
  
  WiFiClientSecure httpsClient;
  httpsClient.setFingerprint(fingerprint);
  httpsClient.setTimeout(2000);

  // connect
  Serial.println("HTTPS Connecting");
  if(!httpsClient.connect(host, httpsPort)) {
    return payload;
  }
  
  String body;
  body = "{\"class_id\":\"" + class_id + "\",\"student_id\":\"" + student_id + "\",\"time\":\"" + time + "\"}";

  // send request
  httpsClient.print(String("POST ") + "/attendances" + " HTTP/1.1\r\n" +
                    "Host: " + host + "\r\n" + 
                    "Content-Type: application/json\r\n"
                    "Content-Length: " + String(body.length()) + "\r\n\r\n" +
                    body + "\r\n");
  
  // receive header
  while (httpsClient.connected()) {
    String header = httpsClient.readStringUntil('\n');
    if (header == "\r") {
      Serial.println("Receive header");
      break;
    }
  }
  
  // receive data
  while(httpsClient.available()){        
    payload = httpsClient.readStringUntil('\n');
  }
  httpsClient.stop();
  
  payload = payload.substring(1, payload.length()-1);
  return payload;
}
