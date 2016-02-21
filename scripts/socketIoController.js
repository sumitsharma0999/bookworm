function manageSocketIo(io) {
    io.on('connection', function(socket){
        console.log('a user connected');

        socket.on('chat message', function(msg){
            socket.broadcast.emit('chat message', msg);
        });

        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
    });
}



module.exports = manageSocketIo;
