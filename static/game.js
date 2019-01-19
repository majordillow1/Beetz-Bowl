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