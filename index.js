import { express } from './config/config'
import { createServer } from 'http'
import app from './app'
const server = createServer(app)

function normalizePort(val) {
  const portNumber = parseInt(val, 10);
  if (isNaN(portNumber)) {
    // named pipe
    return val;
  }

  if (portNumber >= 0) {
    // portNumber number
    return portNumber;
  }

  return false;
}

const port = normalizePort(express.port);
app.set('port', port);

server.listen(port, () => {
    console.log('App Running in localhost:'+port)
})
