# Fingerprint without filtering


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

5-Combine the Positions Using the Weights:

Use the weights to calculate the average position.
For each reference point, its contribution to the position is based on its weight:

Weighted X = (Weight1 * X1 + Weight2 * X2 + ...) / (Sum of Weights)

Weighted Y = (Weight1 * Y1 + Weight2 * Y2 + ...) / (Sum of Weights)

Result:
The weighted average gives the estimated position of the mobile device on the canvas.

## Example Calculation
Input:
RSSI received from the mobile device: -64

Reference Points:

- (50, 100) with RSSI = -60
- (100, 150) with RSSI = -62
- (150, 200) with RSSI = -65
- (200, 250) with RSSI = -67
- (250, 300) with RSSI = -70

Step-by-Step Calculation:

1-Find the Difference:

- | -64 - (-60) | = 4
- | -64 - (-62) | = 2
- | -64 - (-65) | = 1
- | -64 - (-67) | = 3
- | -64 - (-70) | = 6

2-Calculate Weights:

- Weight for (50, 100) = 1 / 4 = 0.25
- Weight for (100, 150) = 1 / 2 = 0.5
- Weight for (150, 200) = 1 / 1 = 1
- Weight for (200, 250) = 1 / 3 ≈ 0.33
- Weight for (250, 300) = 1 / 6 ≈ 0.17
Normalize Weights (Optional):

- Total Weight = 0.25 + 0.5 + 1 + 0.33 + 0.17 = 2.25
- Normalize:
- Normalized Weight for (50, 100) = 0.25 / 2.25 ≈ 0.11
- Normalized Weight for (100, 150) = 0.5 / 2.25 ≈ 0.22
- Normalized Weight for (150, 200) = 1 / 2.25 ≈ 0.44
- Normalized Weight for (200, 250) = 0.33 / 2.25 ≈ 0.15
- Normalized Weight for (250, 300) = 0.17 / 2.25 ≈ 0.08

3-Calculate Weighted Position:

X = (0.11 * 50) + (0.22 * 100) + (0.44 * 150) + (0.15 * 200) + (0.08 * 250)
  ≈ 5.5 + 22 + 66 + 30 + 20 = 143.5

Y = (0.11 * 100) + (0.22 * 150) + (0.44 * 200) + (0.15 * 250) + (0.08 * 300)
  ≈ 11 + 33 + 88 + 37.5 + 24 = 193.5
  
Final Position:

(X, Y) = (143.5, 193.5)




