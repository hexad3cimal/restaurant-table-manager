
var connection;
export const socketConnection = () => {
   connection = new WebSocket(`ws://localhost:3000/events`);
   return connection;
}