from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time, threading

POLL_INTERVAL = 0.05

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SENSOR_STATE = {
    "FPT1": 0,
    "FPT2": 0,
    "FPT3": 0,
    "CPT1": 0,
    "NPT1": 0,
    "LC3": 0,
    "LC2": 0,
    "TC2": 0, # no
    "FPT4": 0,
    "CPT2": 0,
    "TC1": 0, # no
    "OPT1": 0,
    "LC1": 0,
    "OPT4": 0,
    "FPT5": 0,
    "OPT2": 0, # no
    "OPT3": 0, # no
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

ctr_valve = 0
ctr_sensor = 0
def dummy_update_thread():
    global SENSOR_STATE, VALVE_STATE, ctr_valve, ctr_sensor
    while True:
        time.sleep(0.2)
        ctr_valve = (ctr_valve + 1) % len(VALVE_STATE)
        ctr_sensor = (ctr_sensor + 1) % len(SENSOR_STATE)
        VALVE_STATE[list(VALVE_STATE.keys())[ctr_valve]] = 1 - VALVE_STATE[list(VALVE_STATE.keys())[ctr_valve]]
        SENSOR_STATE[list(SENSOR_STATE.keys())[ctr_sensor]] = (SENSOR_STATE[list(SENSOR_STATE.keys())[ctr_sensor]] + 1) % 100
t = threading.Thread(target=dummy_update_thread, daemon=True)
t.start()


def send_command(command: str):
    pass

def receive_data():
    pass

def setup_sensor_sweep():
    for sensor in SENSOR_STATE.keys():
        send_command(f"time every {POLL_INTERVAL} pt get {sensor}")

def startup():
    send_command("!reset")
    setup_sensor_sweep()

def receive_data_handler():
    pass

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