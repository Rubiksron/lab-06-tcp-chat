'use strict';

// node modules
const net = require('net');
const EE = require('events');

// npm modules
// app modules
const Client = require('./model/client.js');

// env vars
const PORT = process.env.PORT || 3000;

// module constats
const pool = [];
const server = net.createServer();
const ee = new EE();



ee.on('\\dm', function(client, message){
  var targetClient = message.split(' ').shift();
  // console.log('pool',pool);
  // console.log('targetClient', targetClient);
  for(var i=0; i<pool.length; i++){
    if(targetClient.nickname === pool[i].socket.nickname){
      pool[i].socket.write(`${client.nickname}:direct message: ` + message);
      console.log(pool[i], targetClient);
    }
  }
  client.nickname = message.trim();
});




ee.on('\\nick', function(client, message){
  client.nickname = message.trim();
});


ee.on('\\all', function(client, message){
  pool.forEach( c => {
    c.socket.write(`${client.nickname}:direct message: ` + message);
  });
});

ee.on('default', function(client, message){
  client.socket.write('not a command');
});



/// module logic
server.on('connection', function(socket){
  var client = new Client(socket);
  pool.push(client);
  socket.on('data', function(data) {
    const command = data.toString().split(' ').shift().trim();
    console.log(command);
    if (command.startsWith('\\')) {
      var message = data.toString().split(' ').slice(1).join(' ');
      console.log(message);
      ee.emit(command, client, message);
      return;
    }
    ee.emit('default', client, data.toString());

  });



  socket.on('error', function(error){
    console.error('you shall not pass.');
  });


  socket.on('close', function(){
    for(var i=0; i<pool.length; i++){
      if(targetClient.nickname  === pool[i].socket.nickname)
      //i couldn't figure out the command to delete, this is a placeholder
        socket.user.id = BURN,BURN,BURN;
    }
  });
});


server.listen(PORT, function(){
  console.log('server running on port', PORT);
});
