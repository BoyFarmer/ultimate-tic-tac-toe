const {createServer} = require('http');
const {Server} = require('socket.io');

const express = require('express');
const {join} = require('path');
const app = express();
port = process.env.PORT || 4000;
//
app.use(express.static(__dirname + '/public/browser'));
app.get('*angular', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'browser', 'index.html'));
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: '*',
});

const allUsers = {};
const allRooms = [];

io.on('connection', (socket) => {
    allUsers[socket.id] = {
        socket: socket,
        online: true,
    };

    socket.on('RequestToPlay', (data) => {
        const currentUser = allUsers[socket.id];
        currentUser.playerName = data.playerName;
        currentUser.requestedToPlay = true;

        let opponentPlayer;

        for (const key in allUsers) {
            const user = allUsers[key];
            if (user.online && !user.playing && user.requestedToPlay && socket.id !== key) {
                opponentPlayer = user;
                break;
            }
        }

        if (opponentPlayer) {
            console.log(opponentPlayer);
            allRooms.push({
                player1: opponentPlayer,
                player2: currentUser,
            });

            currentUser.socket.emit('OpponentFound', {
                opponentName: opponentPlayer.playerName,
                playingAs: 'circle',
            });

            opponentPlayer.socket.emit('OpponentFound', {
                opponentName: currentUser.playerName,
                playingAs: 'cross',
            });

            currentUser.socket.on('PlayerMoveFromClient', (data) => {
                opponentPlayer.socket.emit('PlayerMoveFromServer', {
                    ...data,
                });
            });

            opponentPlayer.socket.on('PlayerMoveFromClient', (data) => {
                currentUser.socket.emit('PlayerMoveFromServer', {
                    ...data,
                });
            });
        }
    });

    socket.on('disconnect', function () {
        console.log('disconect');
        const currentUser = allUsers[socket.id];
        currentUser.online = false;
        currentUser.playing = false;

        for (let index = 0; index < allRooms.length; index++) {
            const {player1, player2} = allRooms[index];

            if (player1.socket.id === socket.id) {
                player2.socket.emit('opponentLeftMatch');
                break;
            }

            if (player2.socket.id === socket.id) {
                player1.socket.emit('opponentLeftMatch');
                break;
            }
        }
    });
});

httpServer.listen(port, () => {
    console.log('server running at http://localhost:'+ port);
});

module.exports = httpServer;