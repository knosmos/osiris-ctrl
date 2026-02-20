import time, threading

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import serial
import serial.tools.list_ports

""" == SERVER SETUP == """

POLL_INTERVAL = 0.05

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

""" == SERIAL SETUP == """

ports = serial.tools.list_ports.comports()
print("AVAILABLE PORTS:")
for port, desc, hwid in sorted(ports):
    print("{}: {} [{}]".format(port, desc, hwid))
if len(ports) > 1:
    port = input("SELECT PORT > ")
    if port == "":
        port = sorted(ports)[0][0]
else:
    ports = []
    while len(ports) == 0:
        ports = serial.tools.list_ports.comports()
    port = ports[0][0]
print(f"SELECTED PORT: {port}")
serial_port = serial.Serial(port, baudrate=115200, timeout=1)

""" == P&ID CONFIGURATION == """

SENSOR_STATE = {
    "FPT1": 0,
    "FPT2": 0,
    "FPT3": 0,
    "CPT1": 0,
    "NPT1": 0,
    # "LC3": 0,
    # "LC2": 0,
    # "TC2": 0, # not for hotfire 1
    "FPT4": 0,
    "CPT2": 0,
    # "TC1": 0, # not for hotfire 1
    "OPT1": 0,
    # "LC1": 0,
    "OPT4": 0,
    "FPT5": 0,
    # "OPT2": 0, # not for hotfire 1
    # "OPT3": 0, # not for hotfire 1
    "OPT0": 0,
}

VALVE_STATE = {
    "FVV-1": 0,
    "FDV-1": 0,
    "FPV-1": 0,
    "FTV-1": 0,
    "NFV-1": 0,
    "FFV-1": 0,
    "OFV-2": 0,
    "NVV-1": 0,
    "OPV-1": 0,
    "OTV-1": 0,
    "OVV-1": 0,
    "ODV-1": 0,
    "OIV-2": 0,
    "OFV-1": 0,
    "OKVA-1": 0,
    "OIV-1": 0,
    "NIV-1": 0,
    "FIV-1": 0,
    "OVV-2": 0,
    "SP-1": 0,
}

couplings = {
    "OIV-1": ["OFV-1"],
    "NIV-1": ["OPV-1", "FPV-1"],
    "FIV-1": ["FDV-1"]
}

""" == TESTING LOGIC == """

ctr_valve = 0
ctr_sensor = 0
def dummy_update_thread():
    global SENSOR_STATE, VALVE_STATE, ctr_valve, ctr_sensor
    while True:
        time.sleep(0.1)
        ctr_valve = (ctr_valve + 1) % len(VALVE_STATE)
        ctr_sensor = (ctr_sensor + 1) % len(SENSOR_STATE)
        VALVE_STATE[list(VALVE_STATE.keys())[ctr_valve]] = 1 - VALVE_STATE[list(VALVE_STATE.keys())[ctr_valve]]
        #SENSOR_STATE[list(SENSOR_STATE.keys())[ctr_sensor]] = (SENSOR_STATE[list(SENSOR_STATE.keys())[ctr_sensor]] + 1) % 100
        for sensor in SENSOR_STATE.keys():
            SENSOR_STATE[sensor] = (SENSOR_STATE[sensor] + 1) % 100
# t = threading.Thread(target=dummy_update_thread, daemon=True)
# t.start()

" == SERIAL LOGIC =="

def send_command(command: str):
    global serial_port
    serial_port.write(bytes(command + "\n", 'utf-8'))

def receive_data():
    if serial_port.in_waiting > 0:
        line = str(serial_port.readline())
        if line != "b''":
            return line[2:-5]
    return False

def setup_sensor_sweep():
    for sensor in SENSOR_STATE.keys():
        send_command(f"time every {POLL_INTERVAL} pt get {sensor}") # CHANGE

def update_thread():
    send_command("!reset")
    setup_sensor_sweep()
    while True:
        data = receive_data()
        if data:
            try:
                if " = " not in data:
                    continue
                name, val = data.split(" = ")
                if name in SENSOR_STATE:
                    SENSOR_STATE[name] = float(val)
                if name in VALVE_STATE:
                    VALVE_STATE[name] = int(val)
                    if name in couplings:
                        for coupled_valve in couplings[name]:
                            VALVE_STATE[coupled_valve] = int(val)
            except Exception as e:
                print(f"Error parsing data: {data} ({e})")
        time.sleep(POLL_INTERVAL)

t = threading.Thread(target=update_thread, daemon=True)
t.start()

" == SERVER ROUTING == "

@app.get("/data")
def get_data():
    global SENSOR_STATE, VALVE_STATE
    sensor_state_pretty = {}
    for k, v in SENSOR_STATE.items():
        if k.startswith("FPT") or k.startswith("CPT") or k.startswith("NPT") or k.startswith("OPT"):
            sensor_state_pretty[k] = f"{v} PSI"
        elif k.startswith("LC"):
            sensor_state_pretty[k] = f"{v} N"
        elif k.startswith("TC"):
            sensor_state_pretty[k] = f"{v} °C"
        else:
            sensor_state_pretty[k] = v
    return {
        "sensors": sensor_state_pretty,
        "valves": VALVE_STATE,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)