function updateSensorData() {
    fetch('/api/sensor-data')
    .then(response => response.json())
    .then(data => {
        console.log('Received data:', data);
        document.getElementById('turbidity').textContent = data.turbidity !== undefined ? data.turbidity : 'N/A';
        document.getElementById('distance').textContent = data.distance !== undefined ? data.distance + ' cm' : 'N/A';
    })
    .catch(error => {
        console.error('Error fetching sensor data:', error);
    });
}

setInterval(updateSensorData, 1000);

updateSensorData();