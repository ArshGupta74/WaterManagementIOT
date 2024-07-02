import serial
import json
import time
import os
import requests

def read_arduino_data():
    ser = serial.Serial('COM5', 9600, timeout=1) 
    ser.flushInput()  
    
    # script_dir = os.path.dirname(os.path.abspath(__file__))
    # parent_dir = os.path.dirname(script_dir)
    # file_path = os.path.join(parent_dir, 'sensor_data.json')
    buffer= ''
    while True:
        try:
            if ser.in_waiting:
                new_data = ser.read(ser.in_waiting).decode('utf-8', errors='replace')
                buffer += new_data

                if '\n' in buffer:
                    lines = buffer.split('\n')
                    for line in lines[:-1]: 
                        line = line.strip()
                        print(f"Processing line: {line}")
                        try:
                            data = json.loads(line)
                            print(f"Parsed data: Turbidity: {data['turbidity']}, Distance: {data['distance']}")
                            
                            # Send data to the server using GET request
                            response = requests.get('http://localhost:3000/api/sensor-data', params=data)
                            if response.status_code == 200:
                                print("Data sent to server successfully")
                            else:
                                print(f"Failed to send data to server. Status code: {response.status_code}")
                        
                        except json.JSONDecodeError as e:
                            print(f"JSON Error: {e}")
                    buffer = lines[-1]
                    
        except serial.SerialException as e:
            print(f"Serial error: {e}")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")
        
        time.sleep(0.1) 

if __name__ == "__main__":
    read_arduino_data()