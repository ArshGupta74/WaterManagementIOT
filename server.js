const express = require('express');
// const fs = require('fs').promises;
// const path = require('path');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const port = 3000;

app.use(express.static('public'));
let latestData = {};
let serialPort;

// async function updateLatestData() {
//     try {
//         const filePath = path.join(__dirname, 'sensor_data.json');
//         const data = await fs.readFile(filePath, 'utf8');
//         latestData = JSON.parse(data);
//         console.log("Updated latest data:", latestData);
//     } catch (err) {
//         if (err.code === 'ENOENT') {
//             console.log("sensor_data.json not found. Waiting for data...");
//         } else {
//             console.error("Error reading sensor data file:", err);
//         }
//     }
// }

async function listPorts() {
    const ports = await SerialPort.list();
    console.log("Available ports:");
    ports.forEach((port, index) => {
        console.log(`${index}: ${port.path}`);
    });
    console.log("Please enter the number of the port you want to use:");
    return ports;
}

function setupSerialPort(portPath) {
    console.log(`Attempting to open port: ${portPath}`);
    serialPort = new SerialPort({ path: portPath, baudRate: 9600 }, (err) => {
        if (err) {
            console.error('Error opening port:', err.message);
            return;
        }
        console.log('Port opened successfully');
    });

    const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

    parser.on('data', (data) => {
        console.log('Received data:', data);  // Log raw data
        try {
            latestData = JSON.parse(data);
            console.log('Parsed data:', latestData);  // Log parsed data
        } catch (error) {
            console.error('Error parsing data:', error);
        }
    });

    serialPort.on('error', (err) => {
        console.error('Serial port error:', err);
    });
}

async function init() {
    const ports = await listPorts();

    process.stdin.on('data', (data) => {
        const selection = parseInt(data.toString().trim());
        if (selection >= 0 && selection < ports.length) {
            setupSerialPort(ports[selection].path);
        } else {
            console.log("Invalid selection. Please try again.");
            listPorts();
        }
    });
}

app.get('/api/sensor-data', (req, res) => {
    console.log("Received GET request for /api/sensor-data");
    
    // Check if the request includes new sensor data
    if (req.query.turbidity !== undefined && req.query.distance !== undefined) {
        // Update latestData with the new sensor readings
        latestData = {
            turbidity: parseFloat(req.query.turbidity),
            distance: parseFloat(req.query.distance)
        };
        console.log("Updated data:", latestData);
    }
    
    console.log("Sending data:", latestData);
    res.json(latestData);
});

// setInterval(updateLatestData, 1000);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    init();
});