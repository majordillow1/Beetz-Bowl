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
socket.on('JoinOnId', function(id){
socket.emit('JoinRoom', id);
document.getElementById('RoomNameText').innerHTML = "Room name " + id;
console.log('shouldve got id');
});
  function CreateRoom(){
//in this function we want to change the elements on the page adding a "room code" text and add the "Queue list" both of these should just be empty then we will do
//a socket.on in which the server will relay info back to the client to fill this stuff in.
document.getElementById('Start_Room_Button').style.display = "none";
document.getElementById('Join_Room_Button').style.display = "none";
document.getElementById('Roomname').style.display = "inherit";
document.getElementById('Roomcode').style.display = "inherit";
document.getElementById('Create_Server_Button').style.display = "inherit";
  }
  function JoinRoom(){
//in this function we wont send any info to the server instead we will now change the page to ask for a username and a room code.
document.getElementById('Start_Room_Button').style.display = "none";
document.getElementById('Join_Room_Button').style.display = "none";
document.getElementById('UsernameText').style.display = "inherit";
document.getElementById('RoomNameText').style.display = "inherit";
document.getElementById('RoomCodeText').style.display = "inherit";
  }

  function ServerCreateRoom(){
//in this function we will actually create the server on the server side
var gameObject = {};
gameObject.id = null;
gameObject.creator = socket.id;
gameObject.code = "1234";
console.log('starting talk to server');
//Create a random code for the room name (server side will fill this in). (Math.random()+1).toString(36).slice(2, 18)
socket.emit('CreateRoom',gameObject);
//find room with the socket id, and return it's room id after its created. Then Join the room in the next function
socket.emit('retrieveRoom', gameObject.creator);
  }