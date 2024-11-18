## esp32-V2(finger print without filtering)

# How Position is Calculated (Simple Steps)
1-Reference Points (Fingerprint Database):

You already have a set of known positions (x, y) with their corresponding RSSI values (signal strength).
Example:

Fingerprint Database:
- (50, 100) with RSSI = -60
- (100, 150) with RSSI = -62
- (150, 200) with RSSI = -65
- (200, 250) with RSSI = -67
- (250, 300) with RSSI = -70
