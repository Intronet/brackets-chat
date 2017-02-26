var
   app = require('express')(),
   http = require('http').Server(app),
   io = require('socket.io')(http),
   conversation = [],
   users = [];

app.get('/', function (req, res) {
   res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

   socket.on('logout', function (msg) {
      if (users.indexOf(msg.user) !== -1) {
         var index = users.indexOf(msg.user);
         users.splice(index, 1);
         conversation.push(msg);
         io.emit('chat message', msg, JSON.stringify(conversation), JSON.stringify(users));
         //io.emit('logout', msg, JSON.stringify(conversation), JSON.stringify(users));
      }
   });
   
   socket.on('checkuser', function (msg) {
      if (users.indexOf(msg.user) !== -1) {
         msg = {
            "usersExists": true,
            user: msg.user,
            id: msg.id
         };
      } else {
         users.push(msg.user);       
      }
      io.emit('checkuser', msg, JSON.stringify(conversation), JSON.stringify(users));
   });

   socket.on('chat message', function (msg) {
      if (users.indexOf(msg.user) !== -1) {
         conversation.push(msg);
         if (conversation.length > 100){
            conversation.splice(0, conversation.length-100);
            }         
         io.emit('chat message', msg, JSON.stringify(conversation), JSON.stringify(users));
      } else {
         msg = {
            "invalid": true,
            user: msg.user,
            id: msg.id
         }
         io.emit('chat message', msg, JSON.stringify(conversation), JSON.stringify(users));
      } 
   });
  
});

http.listen(PORT,function () {
   console.log('listening on *:8888');
});