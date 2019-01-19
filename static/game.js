var socket = io();
socket.on('connect', function(data) {

    //logs connection to the website. We will ask the person to either create a room, or join one.
    //The magic of javascript is we can change the element on the page without redirection of the user. So we can essentially change the pages layout and the elements
    //displayed using Javascript. 
  console.log("did connect");
  });