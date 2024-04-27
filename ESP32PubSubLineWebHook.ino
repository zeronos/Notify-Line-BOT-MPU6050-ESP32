#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>
#include <Audio.h>

Adafruit_MPU6050 mpu;
//---- WiFi settings
const char* ssid = "";
const char* password = "";
//---- MQTT Broker settings
const char* mqtt_server = ""; // replace with your broker url
const char* mqtt_username = "";
const char* mqtt_password = "";
const int mqtt_port = ;

#define I2S_DOUT     25
#define I2S_BCLK     27
#define I2S_LRC      26
#define BUZZER_PIN   5

Audio audio;
int volume = 20;

WiFiClientSecure espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;

#define MSG_BUFFER_SIZE (50)
char msg[MSG_BUFFER_SIZE];

const char* sensor1_topic= "sensor1";

static const char *root_ca PROGMEM = R"EOF(

)EOF";

void setup(void) {
  Serial.begin(115200);
  while (!Serial)
    delay(10); // will pause Zero, Leonardo, etc until serial console opens
  
  pinMode(BUZZER_PIN,OUTPUT);
  digitalWrite(BUZZER_PIN,LOW); //close buzzer

  Serial.print("\nConnecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
  delay(500);
  Serial.print(".");
  }

  randomSeed(micros());
  Serial.println("\nWiFi connected\nIP address: ");
  Serial.println(WiFi.localIP());


  // Try to initialize!
  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip");
    while (1) {
      delay(10);
    }
  }

  Serial.println("MPU6050 Found!");
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
 
  Serial.println("");
  delay(100);

  audio.setPinout(I2S_BCLK, I2S_LRC, I2S_DOUT);
  audio.setVolume(volume);
  audio.forceMono(true);  // change stereo to mono

  espClient.setCACert(root_ca);
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  /* Get new sensor events with the readings */
  audio.loop();

  if (!client.connected()) reconnect();
  client.loop();

  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  /*Serial.print("Acceleration X: ");
  Serial.print(a.acceleration.x);
  Serial.println(" m/s^2");*/

  if( a.acceleration.x >= 9.39 && a.acceleration.x <= 10.39 )
  {
      Serial.println("Publish Message topic");
      digitalWrite(BUZZER_PIN,HIGH);  //open buzzer
      publishMessage(sensor1_topic,String("fall"),true);
  }
  //delay(500);
}

void reconnect() {
// Loop until we’re reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection…");
    String clientId = "ESP32Client-"; // Create a random client ID
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
          Serial.println("connected");

          client.subscribe("webHookPubilsh");   // subscribe the topics here
          //client.subscribe(command2_topic);   // subscribe the topics here
    } else {
          Serial.print("failed, rc=");
          Serial.print(client.state());
          Serial.println(" try again in 5 seconds");   // Wait 5 seconds before retrying
          delay(5000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  String          incommingMessage = "";
  const String    domainHosting = "";
  String          format_txt = "";
  const char*     audioPlay;
  for (int i = 0; i < length; i++) 
    incommingMessage+=(char)payload[i];

  Serial.println("Message arrived ["+String(topic)+"]"+incommingMessage);

  incommingMessage += ".aac";

  format_txt = domainHosting+incommingMessage;
  audioPlay = format_txt.c_str();
  
  Serial.println(audioPlay);

  audio.connecttohost(audioPlay);
  //audio.stopSong();
}

void publishMessage(const char* topic, String payload , boolean retained){
  if (client.publish(topic, payload.c_str(), true))
    Serial.println("Message publised ["+String(topic)+"]: "+payload);
}
