#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {

  // The begin call takes the width and height. This
  // Should match the number provided to the constructor.
  lcd.begin(16,2);
  lcd.init();

  // Turn on the backlight.
  lcd.backlight();

  // Move the cursor characters to the right and
  // zero characters down (line 1).
  lcd.setCursor(5, 0);

  // Print HELLO to the screen, starting at 5,0.
  lcd.print("HELLO");

  // Move the cursor to the next line and print
  // WORLD.
  lcd.setCursor(6, 1);      
  lcd.print("BRO");
}

void loop() {
}
