# osiris-ctrl
P&ID visualizer dashboard for a thrust-vectoring throttle-controlled liquid-fueled nitrous/IPA rocket engine for the MIT Rocket Team.
Several design criteria must be satisfied:

- The system must display the open/closed state of all controlled valves on Osiris. It must display the current sensor readings from all thermocouples, pressure transducers, and load cells.
- The system should display the current throttle levels and program stage.
- The system should give general indications of the health of particular subsystems.
- The system may provide an interface through which to directly control valve states or initiate program stages.
- The system must look cool, for aura points :D

<img width="1982" height="1190" alt="image" src="https://github.com/user-attachments/assets/f7cba2e2-3a10-44b0-8dbb-85f7c816f296" />

## Usage
- Backend
    - `cd backend`
    - `pip install -r requirements.txt`
    - `uvicorn server:app --reload`
- Frontend
    - `cd frontend`
    - `npm install`
    - `npm run build`
    - `npm run start`
