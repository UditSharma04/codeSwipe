import io from 'socket.io-client';

export const socket = io(process.env.REACT_APP_API_URL);

socket.on('connect', () => {
  console.log('Connected to socket server');
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
}); 