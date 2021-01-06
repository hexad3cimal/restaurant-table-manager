
var connection;
export const socketConnection = () => {
   connection = new WebSocket(`ws://localhost:8090/events`);
   return connection;
}