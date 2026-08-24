const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  let file = req.url === '/' ? '/index.html' : req.url;
  file = path.normalize(file).replace(/^\.\.(\/|\\)/, '');
  const filePath = path.join(__dirname, file);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    const types = { '.html':'text/html; charset=utf-8', '.json':'application/json; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8' };
    res.writeHead(200, { 'Content-Type': types[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
});

const wss = new WebSocket.Server({ server });
const rooms = new Map();

function send(ws, msg) { if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg)); }

wss.on('connection', ws => {
  ws.room = null;
  ws.on('message', raw => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }
    if (msg.type === 'join') {
      const room = String(msg.room || '').trim();
      if (!room) return send(ws, { type:'error', message:'Room name required' });
      if (!rooms.has(room)) rooms.set(room, new Set());
      const peers = rooms.get(room);
      if (peers.size >= 2) return send(ws, { type:'error', message:'Room is full' });
      ws.room = room;
      peers.add(ws);
      send(ws, { type:'joined', count: peers.size });
      if (peers.size === 2) {
        for (const peer of peers) if (peer !== ws) send(peer, { type:'peer-joined' });
      }
      return;
    }
    if (!ws.room) return;
    const peers = rooms.get(ws.room);
    if (!peers) return;
    for (const peer of peers) if (peer !== ws) send(peer, msg);
  });

  ws.on('close', () => {
    if (!ws.room) return;
    const peers = rooms.get(ws.room);
    if (!peers) return;
    peers.delete(ws);
    for (const peer of peers) send(peer, { type:'peer-left' });
    if (peers.size === 0) rooms.delete(ws.room);
  });
});

server.listen(PORT, () => console.log(`GLOBAL 804 running on port ${PORT}`));
