var io = require('socket.io')();

//name spaces set to meetingdocument
//命名空间设置为meetingdocument
io.of('/meetingdocument').on('connection',function(socket){
    //socket.emit('news',{hello: 'world'});
    socket.on('join document',function (data){
        console.log(data);

        socket.room = 'document '+data.documentid;

        socket.join(socket.room);

        socket.emit('join document',data);
    })

    socket.on('document update',function (data){
        console.log(data);

        socket.room = 'document '+data.documentid;

        console.log(socket.room);

        socket.to(socket.room).emit('document update',data.content);

        socket.emit('update success',data.content);

    })


})

module.exports = io;