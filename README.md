# GLOBAL 804

A mobile-friendly international audio/video calling prototype using WebRTC and WebSocket signaling.

## Run

1. Install Node.js 18+.
2. Run:
   npm install
3. Start the server:
   npm start
4. Open the server URL on two devices.
5. Enter the same room name on both devices to connect.

## Important

For production calls, use HTTPS/WSS and configure a TURN server for reliable connections across mobile networks and NAT.

The included Google STUN server is intended for prototype use only.
