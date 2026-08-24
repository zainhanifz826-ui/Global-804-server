# GLOBAL 804

A mobile-friendly international video/audio calling prototype using WebRTC and WebSocket signaling.

## Run
1. Install Node.js 18+.
2. `npm install`
3. `npm start`
4. Open the HTTPS deployment URL on two devices and enter the same room name.

## Important for real production calls
Use HTTPS/WSS and configure a TURN server for reliable connections across mobile networks/NATs. The included Google STUN server is for prototype use only.
