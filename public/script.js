function updateSensorData() {
    fetch('/api/sensor-data')
    .then(response => response.json())
    .then(data => {
        console.log('Received data:', data);
        document.getElementById('turbidity').textContent = data.turbidity !== undefined ? data.turbidity : 'N/A';
        
        const distanceElement = document.getElementById('distance');
        const pumpStatusElement = document.getElementById('pump-status');

        console.log('Distance:', data.distance);
        
        if (data.distance !== undefined) {
            distanceElement.textContent = data.distance + ' cm';
            
            // Update pump status based on distance
            if (data.distance > 50) {
                pumpStatusElement.textContent = 'Pump is running';
                pumpStatusElement.style.color = 'black';
                pumpStatusElement.style.backgroundColor = '#83f28f';
                pumpStatusElement.style.fontWeight = 'bold';
            } else {
                pumpStatusElement.textContent = 'Pump is not running';
                pumpStatusElement.style.fontWeight = 'bold';
                pumpStatusElement.style.color = 'black';
                pumpStatusElement.style.backgroundColor = '#f94449';
            }
        } else {
            distanceElement.textContent = 'N/A';
            pumpStatusElement.textContent = 'Unknown';
            pumpStatusElement.style.color = 'gray';
        }
    })
    .catch(error => {
        console.error('Error fetching sensor data:', error);
    });
}

setInterval(updateSensorData, 1000);

updateSensorData();
