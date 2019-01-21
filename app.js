const express = require('express')
const app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
app.get('/',function(req,res,next){
  res.sendFile(__dirname+'/index.html');
});
app.use('/static', express.static(__dirname + '/static'));
server.listen(process.env.PORT || 8888, () => {
  console.log('Example app listening on port 8000!')
});
//all of our servers, we need to keep track of them so we can delete a room when nobody is using it.
var servers = [];
var Test = {};
Test.id = "test";
Test.creator = "test";
Test.code = "test";
servers.push(Test);
setInterval(
  function(){

    for(var i = 0;i<servers.length;i++){
      //use this to send messages to players in rooms
      //io.sockets.in('room' + games[i].id).emit('hi', games[i].id);

      var clients = io.sockets.adapter.rooms[servers[i].id];
      console.log(servers[i].id);
      if(clients == null){
        console.log("removing game " + servers[i].id);
        servers.splice(i,1);
        
      }

    }
 },
 10000);
//var servers = [];
io.on('connection', function(client){
  console.log('Client Connected....');
  client.on('disconnecting', function(){
  });
    //handle a disconnect
    //to send to specific rooms io.sockets.in(rooms).emit('RemovefromPlayaList',removeArray);
    client.on('CreateRoom', function(g){
      
        g.id = (Math.random()+1).toString(36).slice(2, 18);
        console.log('creating room' + "id: " + g.id + "creator: " + g.creator);
        servers.push(g);

    });
     //client join room
     client.on('JoinRoom', function(serverinfo){
       
       client.username = serverinfo.username;
      console.log('joining person to room');
      for(var t = 0;t<servers.length;t++){
        
        console.log('checked list');
        if(serverinfo.name == servers[t].id){
          console.log('find if code matches');
          if(serverinfo.code == servers[t].code){
            console.log('sending join info');
            client.join(serverinfo.name);
          }else{
            console.log('Wrong code');
            client.emit('wrongCode');
          }
          
        }
      }
    });
    client.on('retrieveRoom', function(creatorId){
      console.log('received ask for id');
      for(var i = 0;i<servers.length;i++){
        //use this to send messages to players in rooms
        //io.sockets.in('room' + games[i].id).emit('hi', games[i].id);
        var clientsID = servers[i].creator;
        console.log('checked list' + clientsID + " " + creatorId);
        if(clientsID == creatorId){
          client.emit('JoinOnId', servers[i]);
          console.log('sending join id');
          client.join(servers[i].id);
        }
      }
    });
   
  });
 