var io = require('socket.io')();
var Document = require('./models/document');

//name spaces set to meetingdocument
//命名空间设置为meetingdocument
io.of('/meetingdocument').on('connection',function(socket){

    socket.on('join document',function (data){
        console.log(data);

        var DocumentId = data.documentid;

        var UserId = data.userid;

        //room's name based on documentid

        socket.room = 'document '+DocumentId;

        //add socket to room

        socket.join(socket.room);

        Document.findById(DocumentId,function (error,doc){

            if (error) {

                socket.emit('error',{error:'database error'});

            }
            else {


                var isadded = doc.addUser(UserId);

                //如果添加成功就更新客户端用户列表

                if (isadded) {

                   doc.save(function (error){

                    if (error) {

                        socket.emit('error',{error:'database error'});

                    }

                    else {

                        doc.populate('owner users',function (error,doc){


                            if (error) {

                                socket.emit('error',{error:'database error'});

                            }

                            else {

                                socket.to(socket.room).emit('userlist update',doc);

                                socket.emit('join document',doc);

                            }

                        })                       

                    }

                }); 


               }
               else {

                doc.populate('owner users',function (error,doc){


                    if (error) {

                        socket.emit('error',{error:'database error'});

                    }

                    else {

                        socket.emit('join document',doc);

                    }

                }) 
                
            }

        }

    });

})

socket.on('leave document',function (data){

    var DocumentId = data.documentid;

    var UserId = data.userid;

        //room's name based on documentid

        socket.room = 'document '+DocumentId;

        // socket leave room

        socket.leave(socket.room);

        Document.findById(DocumentId,function (error,doc){

            if (error) {

                socket.emit('error',{error:'database error'});

            }
            else {

                //remove user from database

                doc.removeUser(UserId);

                //save update

                doc.save(function (error){

                    if (error) {

                        socket.emit('error',{error:'database error'});

                    }

                    else {

                        doc.populate('owner users', function(error,doc){

                            if (error) {

                                socket.emit('error',{error:'database error'});

                            }

                            else {

                                socket.to(socket.room).emit('userlist update',doc);

                            }


                        })                      

                    }

                });

            }


        });

    })

socket.on('document update',function (data){

    console.log(data);

    var DocumentId = data.documentid;

    var Content = data.content;

    socket.room = 'document '+DocumentId;

    Document.findById(DocumentId)
    .populate('owner users')
    .exec(function (error,doc){

        if (error) {

            socket.emit('error',{error:'database error'});

        }
        else {

            doc.content = Content;

            doc.save(function (error){

                if (error) {

                    socket.emit('error',{error:'database error'});

                }

                else {

                    socket.to(socket.room).emit('document update',doc);

                    socket.emit('update success',doc);

                }

            });

        }


    });

})

socket.on('disconnect',function (){

    console.log('disconnect');

})


})

module.exports = io;