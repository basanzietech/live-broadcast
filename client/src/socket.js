import { io } from 'socket.io-client';
const socket = io('http://localhost:5000');
socket.on('connect', () => {
  console.log('Socket.io connected!', socket.id);
});
socket.on('connect_error', (err) => {
  console.error('Socket.io connection error:', err);
});
export default socket; 