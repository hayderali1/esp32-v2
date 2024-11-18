# esp32-V2(finger print without filtering)

## How Position is Calculated (Simple Steps)
1-Reference Points (Fingerprint Database):

You already have a set of known positions (x, y) with their corresponding RSSI values (signal strength).
Example:
Fingerprint Database:
- (50, 100) with RSSI = -60
- (100, 150) with RSSI = -62
- (150, 200) with RSSI = -65
- (200, 250) with RSSI = -67
- (250, 300) with RSSI = -70
  
2-Input RSSI:
When you receive an RSSI value (ex: -64), the system tries to estimate the position of the device that sent this RSSI by comparing it to the RSSI values in the fingerprint database.

3-Find How Close Each Reference Point Is:

For each reference point in the database, calculate how close the input RSSI is to the RSSI in the database.
The difference is calculated as:

Difference = |Input RSSI - Reference RSSI|

4-Assign Weight Based on Closeness:

The smaller the difference, the higher the weight.
Weight is calculated as:

Weight = 1 / Difference

This means
If the RSSI difference is small, the weight is large (this reference point is more relevant).
If the RSSI difference is large, the weight is small.
