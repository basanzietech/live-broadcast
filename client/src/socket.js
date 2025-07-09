import { io } from 'socket.io-client';
const socket = io('https://live-broadcast-sb5d.onrender.com');
socket.on('connect', () => {
  console.log('Socket.io connected!', socket.id);
});
socket.on('connect_error', (err) => {
  console.error('Socket.io connection error:', err);
});
export default socket; 
