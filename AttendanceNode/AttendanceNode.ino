#include <SPI.h>
#include <MFRC522.h>
#include <LiquidCrystal_I2C.h>
#include <ESP8266WiFi.h>
#include <Arduino_JSON.h>
#include <WiFiClientSecure.h>
#include "time.h"
#include <AsyncElegantOTA.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>

#define RST_PIN         D0
#define SS_PIN          D8
#define BT_FORWARD      D4

AsyncWebServer server(80);

LiquidCrystal_I2C lcd(0x27, 16, 2);

MFRC522 mfrc522(SS_PIN, RST_PIN);
MFRC522::MIFARE_Key key;

const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 25200;   
const int   daylightOffset_sec = 0;

const char* ssid = "Phuong";
const char* password = "12341234";

const int httpsPort = 443;
const String host = "attendance-rfid.herokuapp.com";
const char fingerprint[] PROGMEM = "0c 39 35 5a 61 4b 02 6a 75 c6 1c 86 43 8e 61 86 07 8d 64 ae";

enum STT {
  READY, //cho quet the
  WAIT,  // he thong dang xu ly
  INVALID_ID, //mssv khong co tren he thong
  FAILED,       // diem danh that bai
  INVALID_CLASS, // sinh vien khong co o lop nay
  SUCCESS  //Diem danh thanh cong
};

String Class_arr[2] = {"CE224.M11", "CE213.M11"};
String Class;
int    pos = 0;

//Chuyen lop
void ICACHE_RAM_ATTR FORWARD_CLASS() {
  while ((digitalRead(BT_FORWARD) == 0));
  pos++;
  if (pos > 1) pos = 0;
  Serial.println("Interrupt");
  sendLCD(STT::READY);
  return;
}
void setup() {
  Serial.begin(9600);
  lcd.begin(16, 2);
  lcd.init();
  lcd.backlight();
  SPI.begin();

  //WIFI
  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
  
  AsyncElegantOTA.begin(&server, "19522142", "1");    // Start ElegantOTA
  server.begin();
  Serial.println("\nHTTP server started");

  for (byte i = 0; i < 6; i++)
    key.keyByte[i] = 0xFF;
    
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  String TimeUpdate();
  //Interrupt for forward class
  attachInterrupt(digitalPinToInterrupt(BT_FORWARD), FORWARD_CLASS, FALLING);
}

void loop() {
  mfrc522.PCD_Init();
  
  //SAN SANG DIEM DANH
  sendLCD(STT::READY);
  
  while ( ! mfrc522.PICC_IsNewCardPresent())  ;
  
  while ( ! mfrc522.PICC_ReadCardSerial()) ;
    
  //Serial.println("Waitting for card");
  JSONVar student, attendance;
  String  payload;
  String student_id;
  
  if ((student_id = ReadRFID()) == "" )
    return;

  //DOC DUOC MSSV
  sendLCD(STT::WAIT);
  payload = getStudent(student_id);
  student = JSON.parse(payload);

  if (JSON.typeof(student) == "undefined") {       //Neu sinh vien khong co tren database
    sendLCD(STT::INVALID_ID);
    return;
  }

  if (!isValidClass(student)) {     // Viet ham isValidClass, kiem tra class_id[index] co nam trong mang lop cua goi JSON
    sendLCD(STT::INVALID_CLASS);
    return;
  }

  payload = postAttendance(Class_arr[pos], student_id);       //Diem danh tren web
  attendance = JSON.parse(payload);

  //Serial.println("Uploading....");

  // attendance failed
  if (JSON.typeof(attendance) == "undifined") {
    sendLCD(STT::FAILED);
    return;
  }
  Serial.println("Done Upload");
  sendLCD(STT::SUCCESS);
}

String TimeUpdate() {
  time_t rawtime;
  struct tm * timeinfo;
  time (&rawtime);
  timeinfo = localtime (&rawtime);
  return (String)asctime(timeinfo);
}

// Doc RFID
String ReadRFID() {
  String returnID = "";
  int blockNum = 2;
  byte readBlockData[18];
  byte bufferLen = 18;

  /* Authenticating the desired data block for Read access using Key A */
  byte status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, blockNum, &key, &(mfrc522.uid));

  if (status != MFRC522::STATUS_OK)
  {
    return returnID;
  }
//  else
//  {
//    Serial.println("Authentication success");
//  }

  /* Reading data from the Block */
  status = mfrc522.MIFARE_Read(blockNum, readBlockData, &bufferLen);
  if (status != MFRC522::STATUS_OK)
  {
    ;//Serial.print("Reading failed: ");
  }
  else
  {
    for (int i = 0 ; i < bufferLen; i++)
      returnID += (char)readBlockData[i];
    returnID = returnID.substring(0, 8);
    //Serial.println("Block was read successfully");
  }
  //Serial.println(returnID);
  return returnID;
}

bool isValidClass(JSONVar student) {
  //Serial.println(Class_arr[pos]);

  for (int i = 0; i < student["classesEnrolled"].length(); i++) {
    //Serial.println(student["classesEnrolled"][i]);

    if (Class_arr[pos] == student["classesEnrolled"][i]) {
      //Serial.println("Equal");
      return true;
    }
    //Serial.println("Don't compare") ;
  }
  return false;
}

String getStudent(String student_id) {
  String payload = "{}";

  WiFiClientSecure httpsClient;
  httpsClient.setFingerprint(fingerprint);
  httpsClient.setTimeout(2000);

  // connect
  //Serial.println("HTTPS Connecting");
  if (!httpsClient.connect(host, httpsPort)) {
    return payload;
  }

  String url;
  url = "/students/" + student_id;

  //Serial.print("requesting URL: ");
  //Serial.println(host + url);

  // send request
  httpsClient.print(String("GET ") + url + " HTTP/1.1\r\n" +
                    "Host: " + host + "\r\n" +
                    "Connection: close\r\n\r\n");

  // receive header
  while (httpsClient.connected()) {
    String header = httpsClient.readStringUntil('\n');
    if (header == "\r") {
      //Serial.println("Receive header");
      break;
    }
  }

  // receive data
  while (httpsClient.available()) {
    payload = httpsClient.readStringUntil('\n');
  }
  httpsClient.stop();

  payload = payload.substring(1, payload.length() - 1);
 // Serial.println("Receive data susscess");
  return payload;
}

String postAttendance(String class_id, String student_id) {
  Serial.println(class_id);
  Serial.println(student_id);
  String payload = "{}";
  String currenttime = TimeUpdate();
  currenttime.trim();
  //Serial.print(currenttime);

  WiFiClientSecure httpsClient;
  httpsClient.setFingerprint(fingerprint);
  httpsClient.setTimeout(2000);

  // connect
  //Serial.println("HTTPS Connecting");
  if (!httpsClient.connect(host, httpsPort)) {
    return payload;
  }

  String body;
  body = "{\"class_id\":\"" + class_id + "\",\"student_id\":\"" + student_id + "\",\"time\":\"" + currenttime + "\"}";
  Serial.println(body);
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
      //Serial.println("Receive header");
      break;
    }
  }
  // receive data
  while (httpsClient.available()) {
    payload = httpsClient.readStringUntil('\n');
  }
  httpsClient.stop();

  payload = payload.substring(1, payload.length() - 1);
  return payload;
}

void sendLCD(STT s) {
  switch (s) {
    case STT::READY: {
        lcd.clear();

        lcd.setCursor(4, 0);
        lcd.print(Class_arr[pos]);
        lcd.setCursor(2, 1);
        lcd.print("MOI QUET THE");
        break;
      }
    case STT::WAIT: {
        lcd.clear();
        lcd.setCursor(4, 0);
        lcd.print("HE THONG");
        lcd.setCursor(3, 1);
        lcd.print("DANG XU LY");
        break;
      }

    case STT::INVALID_ID: {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("THE KHONG HOP LE");
        delay(5000);
        break;
      }

    case STT::FAILED: {
        lcd.clear();
        lcd.setCursor(4, 0);
        lcd.print("THAT BAI!");
        lcd.setCursor(2, 1);
        lcd.print("QUET THE LAI");
        delay(5000);
        break;
      }

    case STT::INVALID_CLASS: {
        lcd.clear();
        lcd.setCursor(1, 0);
        lcd.print("BAN KHONG THUOC");
        lcd.setCursor(5, 1);
        lcd.print("LOP NAY");
        delay(5000);
        break;
      }

    case STT::SUCCESS: {
        lcd.clear();
        lcd.setCursor(3, 0);
        lcd.print("DIEM DANH");
        lcd.setCursor(3, 1);
        lcd.print("THANH CONG");
        delay(5000);
        break;
      }
  }
}
