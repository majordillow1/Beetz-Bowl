var socket = io();
socket.on('connect', function(data) {

    //logs connection to the website. We will ask the person to either create a room, or join one.
    //The magic of javascript is we can change the element on the page without redirection of the user. So we can essentially change the pages layout and the elements
    //displayed using Javascript. 
  console.log("did connect");
  });

  //in functions to send commands to the server I will give out a list of commands you can use but you will use 
  //socket.emit('command', <argument>);
  //so say we want a "join game" from the player and the information he needs to send to join a room
  //serverid = document.getElementById("server-info").text;
  //socket.emit('join game', serverid);

  //receiving info from my commmands will look like this
  //socket.on('clientsidecommand', function(args){write code in here});
//join room that was returned
socket.on('JoinOnId', function(server){
  JoinInformation = {};
  JoinInformation.username = "Master";
  JoinInformation.name = server.id;
  JoinInformation.code = server.code;
  
//socket.emit('JoinRoom', JoinInformation);
document.getElementById('Roomname').innerHTML = "Room name " + server.id;
document.getElementById('Roomcode').innerHTML = "Room code " + server.code;
console.log('shouldve got id');
});
socket.on('wrongCode', function(){
alert("This is the wrong code. Please try again!");
document.getElementById('enterRoomButton').style.display = "inherit";
document.getElementById('UsernameText').style.display = "inherit";
document.getElementById('RoomNameText').style.display = "inherit";
document.getElementById('RoomCodeText').style.display = "inherit";
});
socket.on('RoomNotFound', function(){
alert("Room not found");
document.getElementById('enterRoomButton').style.display = "inherit";
document.getElementById('UsernameText').style.display = "inherit";
document.getElementById('RoomNameText').style.display = "inherit";
document.getElementById('RoomCodeText').style.display = "inherit";
});
socket.on('usedUsername' ,function(){
  alert("username in use");
  document.getElementById('enterRoomButton').style.display = "inherit";
  document.getElementById('UsernameText').style.display = "inherit";
  document.getElementById('RoomNameText').style.display = "inherit";
  document.getElementById('RoomCodeText').style.display = "inherit";
});
socket.on('addToPlayalist',function(usaname){
  var myNode = document.getElementById("playerList");
  while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
  }
  var userArray = usaname.split("--/");
  console.log("add " + userArray);
  for(var i in userArray){
  var playa =  document.createElement('p');
  var textnode = document.createTextNode(userArray[i]);         // Create a text node
playa.appendChild(textnode);

    document.getElementById('playerList').appendChild(playa);
  }
});
socket.on('RemovefromPlayaList',function(user){
console.log("remove "+user);
var myNode = document.getElementById("playerList");
while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
}

for(var i in user){
var playa =  document.createElement('p');
var textnode = document.createTextNode(user[i]);         // Create a text node
playa.appendChild(textnode);

  document.getElementById('playerList').appendChild(playa);
}

});
  function CreateRoom(){
//in this function we want to change the elements on the page adding a "room code" text and add the "Queue list" both of these should just be empty then we will do
//a socket.on in which the server will relay info back to the client to fill this stuff in.
document.getElementById('Start_Room_Button').style.display = "none";
document.getElementById('Join_Room_Button').style.display = "none";
document.getElementById('Roomname').style.display = "inherit";
document.getElementById('Roomcode').style.display = "inherit";
document.getElementById('Create_Server_Button').style.display = "inherit";
document.getElementById('roomPassword').style.display = "inherit";
  }
  function JoinRoom(){
//in this function we wont send any info to the server instead we will now change the page to ask for a username and a room code.
document.getElementById('Start_Room_Button').style.display = "none";
document.getElementById('Join_Room_Button').style.display = "none";
document.getElementById('UsernameText').style.display = "inherit";
document.getElementById('RoomNameText').style.display = "inherit";
document.getElementById('RoomCodeText').style.display = "inherit";
document.getElementById('enterRoomButton').style.display = "inherit";
document.getElementById('EnterVideo').style.display = "inherit";
document.getElementById('SubmitVideo').style.display = "inherit";
  }
function EnterRoom(){
  //lets send some info to the server
username = document.getElementById('UsernameText').value;
roomId = document.getElementById('RoomNameText').value;
roomCode = document.getElementById('RoomCodeText').value;
document.getElementById('enterRoomButton').style.display = "none";
document.getElementById('UsernameText').style.display = "none";
document.getElementById('RoomNameText').style.display = "none";
document.getElementById('RoomCodeText').style.display = "none";
var joinInfo = {};
joinInfo.username = username;
joinInfo.name = roomId;
joinInfo.code = roomCode;
socket.emit('JoinRoom', joinInfo);
}
  function ServerCreateRoom(){
//in this function we will actually create the server on the server side
document.getElementById('roomPassword').style.display = "none";
var gameObject = {};
gameObject.id = "test";
gameObject.creator = socket.id;
gameObject.code = document.getElementById('roomPassword').value;
console.log('starting talk to server');
//Create a random code for the room name (server side will fill this in). (Math.random()+1).toString(36).slice(2, 18)
socket.emit('CreateRoom',gameObject);
//find room with the socket id, and return it's room id after its created. Then Join the room in the next function
socket.emit('retrieveRoom', gameObject.creator);
document.getElementById('Create_Server_Button').style.display = "none";
  }
  var isMaster = false;
  socket.on('isMaster', function(){
    isMaster = true;
    });
  var VideoList = [];
  var player;
  socket.on('addVideo', function(videoKey){
    if(isMaster){
    VideoList.push(videoKey);
    
      document.getElementById('videolist').innerHTML = VideoList;
    
    
      
      PlayVideo(VideoList[0]);
    
  }else{
    VideoList.push(videoKey);
    
      document.getElementById('videolist').innerHTML = VideoList;
  }
      });
      function PlayVideo(VideoQueue){
        if(VideoList.length <= 1){
          document.getElementById('player').style.display = "inherit";
        player.loadVideoById(VideoList[0]);
        player.playVideo();
        }
      }
  function onYouTubeIframeAPIReady(){
   
    
        player = new YT.Player('player', {
          width: '640',
          height: '390',
          videoId: '',
          playerVars: {
            'autoplay': 0, 'controls':0
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
          }
        });
    

    // autoplay video
    
  }
  function onPlayerReady(event) {
    event.target.playVideo();
}

// when video ends
function onPlayerStateChange(event) {        
    if(event.data === 0) {          
        console.log("next video");
        //VideoList.pop();
        if(VideoList != null){
          
          
          
          VideoList.shift();
          var x = new String(VideoList[0])
          //PlayVideo(VideoList[0]);
          event.target.loadVideoById(x);
          console.log('video is now' + VideoList[0]);
          document.getElementById('videolist').innerHTML = VideoList;
        }
    }
}

function SubmitButton(){
  var videoInput = document.getElementById('EnterVideo').value;
  socket.emit('submitVideo',videoInput);
}