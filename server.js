var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(1111);
console.log('port no is 1111');
app.get('/',function(req,res){

    res.sendFile(__dirname + '/index.html');
});

var users = [];
var connections = [];

io.sockets.on('connection',function(socket){

    connections.push(socket);
    socket.on('New User',function(data,callback){
        callback(true);
        socket.username = data.name;
        socket.room = data.name;
        socket.join(socket.room);
        users.push(socket.username);
        socket.emit('joinmsg',{msg:'you are connected in'+ socket.username});
        updateuserroom();
    });
    function updateuserroom()
    {
        console.log(users);
        io.sockets.emit('Join Room',{temp:JSON.stringify(users)});
    }
    socket.on('connectroom',function(data){
        socket.cr = data.val; 
        
    });
    socket.on('send msg',function(data,x){
        console.log(data);
        console.log(socket.cr);
        console.log(x);
        socket.to(socket.cr).emit('new msg',{msg:data,x});
        socket.emit('ownmsg',{msg:data,x:x,y:socket.cr});
    });
});