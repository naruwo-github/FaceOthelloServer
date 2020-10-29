module.exports = (io) => {

    // sessionにroom_idが保存されていなかったらsocket.io通信を開始しない
    io.use(function(socket, next){
        if(!socket.handshake.session.room_id){
            console.log('session not found');
        }else{
            next();
        }
    });

    io.on('connection', (socket) => {

        // sessionからroom_idを取得し、ルームに入室
        if(socket.handshake.session.room_id){
            console.log("connect:"+socket.handshake.session.room_id);
            socket.join(socket.handshake.session.room_id);
            io.of('/').in(socket.handshake.session.room_id).clients((error, clients) => {
                io.to(socket.handshake.session.room_id).emit('enter', clients.length);
            });
        }

        socket.on('put stone', (data) => {
            socket.to(socket.handshake.session.room_id).emit('put stone', data);
        });

        socket.on('send image', (image) => {
            socket.to(socket.handshake.session.room_id).emit('send image', image);
        });

        socket.on('disconnect', (msg) => {
            socket.leave(socket.handshake.session.room_id);
            console.log(msg);
            socket.to(socket.handshake.session.room_id).emit('exit', 'Other player exit the room');
        });

    });
}