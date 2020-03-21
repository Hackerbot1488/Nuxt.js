const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const users = require('./users')()

const m = (name, text, id) => ({name, text, id})


io.on('connection', socket => {
   

    socket.on('userJoined', (data,cb) => {
        if(!data.name || !data.room){
            return cb('Invalid data');
        }

        socket.join(data.room)

        users.remove(socket.id)

        users.add({
            id: socket.id,
            name: data.name,
            room: data.room
        })
        cb({ userId: socket.id })
        io.to(data.room).emit('updateUsers',users.getByRoom(data.room))
        socket.emit('newMessage', m('admin',`Welcome ${data.name}!`))
        //socket.emit('newMessage', m('qwerty',`Welcome`))
        socket.broadcast
            .to(data.room)
            .emit('newMessage',m('admin',`${data.name} joined.`))
    })

    socket.on('createMessage', (data,cb) => {
        if (!data.text) {
            return cb("Empty text!");
        }
        const user = users.get(data.id);
        if (user) {
            io.to(user.room).emit('newMessage', m(user.name, data.text, data.id))
        }
        cb()
    }) 
    socket.on('userLeft', (id,cb) => {
        const user = users.remove(id)
        if (user) {
            io.to(user.room).emit('updateUsers',users.getByRoom(user.room))
            io.to(user.room).emit('newMessage', m('admin',`${user.name} left chat`))
        }
        cb()
    })
    socket.on('disconnect', () => {
        const user = users.remove(socket.id)
        if (user) {
            io.to(user.room).emit('updateUsers',users.getByRoom(user.room))
            io.to(user.room).emit('newMessage', m('admin',`${user.name} left chat`))
        }
    })
});
 
module.exports = {
    app,server
}

