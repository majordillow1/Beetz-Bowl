mainPage();

var socket = io();

socket.on('connect', function (data) {

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
socket.on('JoinOnId', function (server) {
  JoinInformation = {};
  JoinInformation.username = "Master";
  JoinInformation.name = server.id;
  JoinInformation.code = server.code;

  //socket.emit('JoinRoom', JoinInformation);
  document.getElementById('Roomname').innerHTML = "Room name: " + server.id;
  document.getElementById('Roomcode').innerHTML = "Room code: " + server.code;
  console.log('shouldve got id');
});
//error handling area
socket.on('RoomCodeErrors', function (CodeError) {
  switch (CodeError) {
    case 0:
      alert('Sorry, The room password you have entered is too long');
      CreateServerPage();
      break;
    case 1:
      alert('Sorry, room password cannot be blank. Please enter a valid password. Passwords can be 1-16 characters');
      CreateServerPage();
      break;
  }
});
socket.on('UpdateQueue', function (VideoQueue) {
  document.getElementById('videolist').innerHTML = VideoQueue;
  VideoList = VideoQueue;
});
socket.on('wrongCode', function () {
  alert("This is the wrong code. Please try again!");

  JoinInfoPage();
});
//socket on badusername 0 = empty 1 = too long
socket.on('BadUsername', function(ErrorCode){
switch(ErrorCode){
  case 0:
    alert('Username cannot be empty');
    JoinInfoPage();
    break;
  case 1:
    alert('Username cannot be longer than 16 characters');
    JoinInfoPage();
    break;

}
});
socket.on('RoomNotFound', function () {
  alert("Room not found");

  JoinInfoPage();
});
socket.on('usedUsername', function () {
  alert("username in use");

  JoinInfoPage();
});
//gets player updates and changes them when players join servers
socket.on('addToPlayalist', function (usaname) {
  var myNode = document.getElementById("playerList");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
  var userArray = usaname.split("--/");
  console.log("add " + userArray);
  for (var i in userArray) {
    var playa = document.createElement('p');
    var textnode = document.createTextNode(userArray[i]);         // Create a text node
    playa.appendChild(textnode);

    document.getElementById('playerList').appendChild(playa);
  }
});
socket.on('RemovefromPlayaList', function (user) {
  console.log("remove " + user);
  var myNode = document.getElementById("playerList");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }

  for (var i in user) {
    var playa = document.createElement('p');
    var textnode = document.createTextNode(user[i]);         // Create a text node
    playa.appendChild(textnode);

    document.getElementById('playerList').appendChild(playa);
  }

});
//this socket.on creates the list of buttons for videos got back from server,
var videos = [];
socket.on('searchResults', function (SearchResults) {
  console.log(SearchResults);
  var myNode = document.getElementById("buttons");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
  console.log("shouldve got something");
  console.log(videos);
  videos = SearchResults;
  var doc = document, docFrag = document.createDocumentFragment();
  if (videos.length >= 1) {
    for (var i = 0; i < videos.length; i++) {
      if (videos[i].kind == "youtube#channel") {
        continue;
      }
      var test = videos[i].id;
      var span = document.createElement('span');
      span.innerHTML = '<input type="button" id="' + test + '"  onclick="SendVideoID(\'' + test + '\')"  value = "' + videos[i].title + '">';
      var divin = document.getElementById("buttons");
      divin.appendChild(span);
      console.log("should add button for" + test[i].id);
    }
  }
});
function CreateRoom() {
  //in this function we want to change the elements on the page adding a "room code" text and add the "Queue list" both of these should just be empty then we will do
  //a socket.on in which the server will relay info back to the client to fill this stuff in.

  CreateServerPage();
}
function JoinRoom() {
  //in this function we wont send any info to the server instead we will now change the page to ask for a username and a room code.

  JoinInfoPage();
}
function EnterRoom() {
  //lets send some info to the server
  username = document.getElementById('UsernameText').value;
  roomId = document.getElementById('RoomNameText').value;
  roomCode = document.getElementById('RoomCodeText').value;

  ParticipantPage();
  var joinInfo = {};
  joinInfo.username = username;
  joinInfo.name = roomId;
  joinInfo.code = roomCode;
  socket.emit('JoinRoom', joinInfo);
}
function ServerCreateRoom() {
  //in this function we will actually create the server on the server side
  //document.getElementById('roomPassword').style.display = "none";
  var gameObject = {};
  gameObject.id = "test";
  gameObject.creator = socket.id;
  gameObject.code = document.getElementById('roomPassword').value;
  console.log('starting talk to server');
  //Create a random code for the room name (server side will fill this in). (Math.random()+1).toString(36).slice(2, 18)
  socket.emit('CreateRoom', gameObject);
  //find room with the socket id, and return it's room id after its created. Then Join the room in the next function
  socket.emit('retrieveRoom', gameObject.creator);

  ServerMasterPage();
}
var isMaster = false;
socket.on('isMaster', function () {
  isMaster = true;
});
var VideoList = [];
var player;
socket.on('addVideo', function (videoKey) {
  if (isMaster) {
    VideoList.push(videoKey);
    document.getElementById('videolist').innerHTML = VideoList;
    PlayVideo(0);
    socket.emit('UpdateQueueList', VideoList);
  } else {
    VideoList.push(videoKey);
    document.getElementById('videolist').innerHTML = VideoList;
    socket.emit('UpdateQueueList', VideoList);
  }
});
function PlayVideo(Sending) {
  if (VideoList.length <= 1) {
    //document.getElementById('player').style.display = "inherit";
    validVideoId(VideoList[0]);
    player.loadVideoById(VideoList[0]);
    player.playVideo();
    return;
  }
  if (Sending == 1) {
    // document.getElementById('player').style.display = "inherit";
    validVideoId(VideoList[0]);
    player.loadVideoById(VideoList[0]);
    player.playVideo();
    return;
  }
}
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    width: '640',
    height: '390',
    videoId: '',
    playerVars: {
      'autoplay': 0, 'controls': 0
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
  if (event.data === 0) {
    console.log("next video");
    //VideoList.pop();
    if (VideoList != null) {



      VideoList.shift();
      document.getElementById('videolist').innerHTML = VideoList;
      validVideoId(VideoList[0]);
      var x = new String(VideoList[0])
      //PlayVideo(VideoList[0]);
      event.target.loadVideoById(x);
      console.log('video is now' + VideoList[0]);
      socket.emit('UpdateQueueList', VideoList);
    }
  }
}

function SubmitButton() {
  var videoInput = document.getElementById('EnterVideo').value;
  socket.emit('submitVideo', videoInput);
}
function SendVideoID(VideoID) {
  //var videoInput = document.getElementById('EnterVideo').value;
  socket.emit('submitVideo', VideoID);
  var myNode = document.getElementById("buttons");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
}
function validVideoId(id) {
  var img = new Image();
  img.src = "https://img.youtube.com/vi/" + id + "/mqdefault.jpg";
  img.onload = function () {
    checkThumbnail(this.width);
  }
}

function checkThumbnail(width) {
  //HACK a mq thumbnail has width of 320.
  //if the video does not exist(therefore thumbnail don't exist), a default thumbnail of 120 width is returned.
  if (width === 120) {
    if (VideoList.length >= 1) {
      VideoList.shift();
      PlayVideo(1);
      console.log("shifted");
    }
    document.getElementById('videolist').innerHTML = VideoList;

  }
}
//sends search information up to server to get search info back
function SearchVideos() {
  var VideoSearchInput = document.getElementById('EnterVideo').value;
  socket.emit('SearchVideo', VideoSearchInput);
}
//gonna act like we got pages
//list of divs include MainPageInfo CreateRoomPage JoinRoomInfoPage clientSideInfo player SharedServerInfo
function mainPage() {
  document.getElementById('Content').style.display = "inherit";
  document.getElementById('MainPageInfo').style.display = "inherit";
  document.getElementById('CreateRoomPage').style.display = "none";
  document.getElementById('JoinRoomInfoPage').style.display = "none";
  document.getElementById('clientSideInfo').style.display = "none";
  document.getElementById('player').style.display = "none";
  document.getElementById('SharedServerInfo').style.display = "none";
  document.getElementById('ServerMasterInfo').style.display = "none"
}
function CreateServerPage() {
  document.getElementById('MainPageInfo').style.display = "none";
  document.getElementById('CreateRoomPage').style.display = "inherit";
  document.getElementById('JoinRoomInfoPage').style.display = "none";
  document.getElementById('clientSideInfo').style.display = "none";
  document.getElementById('player').style.display = "none";
  document.getElementById('SharedServerInfo').style.display = "none";
  document.getElementById('ServerMasterInfo').style.display = "none"
}
function ServerMasterPage() {
  document.getElementById('MainPageInfo').style.display = "none";
  document.getElementById('CreateRoomPage').style.display = "none";
  document.getElementById('JoinRoomInfoPage').style.display = "none";
  document.getElementById('clientSideInfo').style.display = "none";
  document.getElementById('player').style.display = "inherit";
  document.getElementById('SharedServerInfo').style.display = "inherit";
  document.getElementById('ServerMasterInfo').style.display = "inherit"
}
function JoinInfoPage() {
  document.getElementById('MainPageInfo').style.display = "none";
  document.getElementById('CreateRoomPage').style.display = "none";
  document.getElementById('JoinRoomInfoPage').style.display = "inherit";
  document.getElementById('clientSideInfo').style.display = "none";
  document.getElementById('player').style.display = "none";
  document.getElementById('SharedServerInfo').style.display = "none";
  document.getElementById('ServerMasterInfo').style.display = "none"
}
function ParticipantPage() {
  document.getElementById('MainPageInfo').style.display = "none";
  document.getElementById('CreateRoomPage').style.display = "none";
  document.getElementById('JoinRoomInfoPage').style.display = "none";
  document.getElementById('clientSideInfo').style.display = "inherit";
  document.getElementById('player').style.display = "none";
  document.getElementById('SharedServerInfo').style.display = "inherit";
  document.getElementById('ServerMasterInfo').style.display = "none"
}