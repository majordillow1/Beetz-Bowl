const express = require('express')
const app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
app.get('/',function(req,res,next){
  res.sendFile(__dirname+'/index.html');
});
app.use('/static', express.static(__dirname + '/static'));
server.listen(process.env.PORT || 8888, () => {
  console.log('Example app listening on port 8888!')
});
//all of our servers, we need to keep track of them so we can delete a room when nobody is using it.
var servers = [];
var Test = {};
Test.id = "test";
Test.creator = "test";
Test.code = "test";
servers.push(Test);
var clientsUsernames = [];
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
var usernamesperRoom = {};
io.on('connection', function(client){
  console.log('Client Connected....');
  client.on('disconnecting', function(){
    if(usernamesperRoom != null){
    if(client.username != null){
      //find room
      clientsUsernames.splice(clientsUsernames.indexOf(client.username), 1);
      let rooms = Object.keys(client.rooms)[1];
      //console.log(rooms + " disconnected from " + client.username);
      //this is the array of the string rigtht
      var removeArray = usernamesperRoom[rooms].split("--/");
      for(var i in removeArray){
        //console.log("array now" + i);
      }
      //go through and find it and delete it
      var index = removeArray.indexOf(client.username);
      removeArray.splice(index,1);
      //console.log("array becomes " + i);
      //send it with new...oh
      io.sockets.in(rooms).emit('RemovefromPlayaList',removeArray);
      usernamesperRoom[rooms] = null;
      for(var replacestring in removeArray){
        if(usernamesperRoom[rooms] == null){
          console.log("room was empty add" + removeArray[replacestring]);
          usernamesperRoom[rooms] = removeArray[replacestring];
        }else{

          usernamesperRoom[rooms] = usernamesperRoom[rooms] + "--/" + removeArray[replacestring];
          console.log("adding" + removeArray[replacestring] + "to string");
        }

      }

    }
  }
  //  console.log("disconnect");
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
       
       for(var c = 0;c<clientsUsernames.length;c++){
         console.log("Checking username " + clientsUsernames[c]);
         if(serverinfo.username == clientsUsernames[c]){
           console.log("found matching username");
           client.emit("usedUsername");
           return;
         }
       }
       //client.username = serverinfo.username;
      console.log('joining person to room');
      for(var t = 0;t<servers.length;t++){
        
        console.log('checked list');
        if(serverinfo.name == servers[t].id){
          console.log('find if code matches');
          if(serverinfo.code == servers[t].code){
            console.log('sending join info');
            client.join(serverinfo.name);
            //emit to update the player room list
      let rooms = serverinfo.name;
      client.username = serverinfo.username;
      clientsUsernames.push(client.username);
      //console.log("added " + usernames);
     // [ <socket.id>, 'room 237' ]
     //set this rooms username list to get bigger
     if(usernamesperRoom[rooms]==null){
       usernamesperRoom[rooms] = serverinfo.username;
     }else{
       usernamesperRoom[rooms] = usernamesperRoom[rooms] + "--/" +serverinfo.username;
     }
    //  console.log("your room sir " + rooms + " "+ usernamesperRoom[rooms]);
      io.sockets.in(rooms).emit('addToPlayalist',usernamesperRoom[rooms]);
        return;  
      }else{
            console.log('Wrong code');
            client.emit('wrongCode');
            return;
          }
        }
      }
      client.emit('RoomNotFound');
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
 