const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// Enable CORS for frontend access
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
}));

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Stationary ESP32 position
const stationaryDevice = { x: 50, y: 50 }; // Top-left corner

// Expanded fingerprint database with finer granularity
const fingerprintDatabase = [
  { x: 50, y: 100, rssi: -60 },
  { x: 100, y: 150, rssi: -62 },
  { x: 150, y: 200, rssi: -65 },
  { x: 200, y: 250, rssi: -67 },
  { x: 250, y: 300, rssi: -70 },
  { x: 300, y: 350, rssi: -72 },
  { x: 350, y: 400, rssi: -75 },
  { x: 400, y: 450, rssi: -77 },
  { x: 450, y: 500, rssi: -80 },
  { x: 500, y: 550, rssi: -82 },
  { x: 550, y: 600, rssi: -85 },
];

// Function to calculate weighted position from fingerprint database
function calculateWeightedPosition(rssi, k = 3) {
  // Step 1: Compute weights based on RSSI difference
  const weightedPositions = fingerprintDatabase.map((fingerprint) => {
    const weight = 1 / Math.abs(fingerprint.rssi - rssi); // Inverse of the difference
    return {
      x: fingerprint.x,
      y: fingerprint.y,
      weight: weight,
    };
  });

  // Step 2: Sort by weight (highest weight = closest match)
  weightedPositions.sort((a, b) => b.weight - a.weight);

  // Step 3: Take the top-k closest fingerprints
  const topK = weightedPositions.slice(0, k);

  // Step 4: Calculate the weighted average position
  let totalWeight = 0;
  let weightedX = 0;
  let weightedY = 0;

  topK.forEach((pos) => {
    totalWeight += pos.weight;
    weightedX += pos.x * pos.weight;
    weightedY += pos.y * pos.weight;
  });

  return {
    x: weightedX / totalWeight,
    y: weightedY / totalWeight,
  };
}

// BLE signal strength data
let bleData = {};
const INACTIVITY_THRESHOLD = 10000; // 10 seconds for device inactivity

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle incoming RSSI data
app.post('/update-location', (req, res) => {
  const { device, rssi, esp32_address } = req.body;

  if (!device || !rssi || !esp32_address) {
    return res.status(400).send('Missing required fields: device, rssi, or esp32_address');
  }

  console.log(`Received data: Device=${device}, RSSI=${rssi}, ESP32=${esp32_address}`);

  if (!bleData[device]) {
    bleData[device] = { rssi: [], position: null, lastUpdateTime: Date.now() };
  }

  bleData[device].rssi.push(Number(rssi));
  bleData[device].lastUpdateTime = Date.now();

  if (bleData[device].rssi.length > 10) bleData[device].rssi.shift();

  const avgRssi = bleData[device].rssi.reduce((sum, value) => sum + value, 0) / bleData[device].rssi.length;
  const position = calculateWeightedPosition(avgRssi);

  if (position) {
    bleData[device].position = position;
    console.log(`Updated position for ${device}: (${position.x}, ${position.y})`);
  } else {
    console.log(`No matching fingerprint found for ${device}`);
  }

  io.emit('updateCanvas', { stationaryDevice, bleData });
  res.sendStatus(200);
});

// Periodically clean up inactive devices
setInterval(() => {
  const currentTime = Date.now();
  for (const device in bleData) {
    if (currentTime - bleData[device].lastUpdateTime > INACTIVITY_THRESHOLD) {
      console.log(`Removing inactive device: ${device}`);
      delete bleData[device];
    }
  }
  io.emit('updateCanvas', { stationaryDevice, bleData });
}, 1000);

// Handle client connections
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.emit('updateCanvas', { stationaryDevice, bleData });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
