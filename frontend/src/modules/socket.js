import io from 'socket.io-client';

export const socketConnection = () => {
   return io("/",{
        path: '/events',
        transports: ['websocket'],
   })
}