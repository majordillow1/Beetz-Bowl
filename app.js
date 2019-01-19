const express = require('express')
const app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
app.get('/', (req, res) => {
  res.sendFile(__dirname +'/index.html');
});
app.use('/static', express.static(__dirname + '/static'));
server.listen(process.env.PORT || 8888, () => {
  console.log('Example app listening on port 8000!')
});