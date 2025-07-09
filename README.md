# Live Broadcast System

## Features
- Live video broadcast (WebRTC, peer-to-peer)
- Group chat (real-time, Socket.io)
- Responsive modern UI/UX
- Animated LIVE badge
- WhatsApp contact button

## Project Structure
```
live-broadcast/
├── client/   # React frontend (Vercel)
├── server/   # Node.js backend (Render/Heroku)
```

## Local Development

### 1. Backend (Node.js)
```bash
cd server
npm install
node index.js
```
Server runs on [http://localhost:5000](http://localhost:5000)

### 2. Frontend (React)
```bash
cd client
npm install
npm start
```
Frontend runs on [http://localhost:3000](http://localhost:3000)

---

## Deployment

### Frontend (Vercel)
1. Push `client/` folder to a Github repo.
2. Go to [vercel.com](https://vercel.com), import the repo, set root directory to `client`.
3. Build command: `npm run build`  Output: `build`

### Backend (Render/Heroku)
1. Push `server/` folder to a Github repo.
2. On [render.com](https://render.com) or [heroku.com](https://heroku.com), create a new Node.js web service.
3. Set root directory to `server`.
4. Set build/start command: `npm install && node index.js`
5. Set environment variable: `PORT=5000` (or as required by platform)

### Important Files to Push
- `client/` (entire React app)
- `server/` (entire Node.js backend)
- `README.md` (this file)

---

## Notes
- **Frontend** must connect to deployed backend URL (edit `client/src/socket.js` if needed).
- **No database**: Chat is real-time only, not persistent.
- For production, use HTTPS and secure WebSocket.

---

## Contact
WhatsApp: [+255657779003](https://wa.me/255657779003) 