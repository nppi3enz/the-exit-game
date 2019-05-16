const express = require('express');

const app = express();

const server = app.listen(3001, function() {
    console.log('server running on port 3001');
});

const io = require('socket.io')(server);

var pauseTime = 0
var LIMIT_TIME = 3600

var setting_game = {
    'gameStart': false,
    'timeStart': null,
    'timeFinish': null
}

// var date = new Date()

// var setting_game = {
//     'gameStart': true,
//     'timeFinish': 1558000773+3600,
// }

io.on('connection', function(socket) {
    socket.on('GAME', function(data) {
        console.log(data)
        io.emit('SETTING', setting_game)
    });
    socket.on('SETTING', function() {
        io.emit('getStatusGame', setting_game)
        // if(data == 'infogame'){
        //     console.log(setting_game)
        // }
        // io.emit('SETTING', setting_game)
    });
    // socket.on('SEND_MESSAGE', function(data) {
    //     console.log(data)
    //     io.emit('MESSAGE', data)
    // });
});

app.get('/start', (req, res) => {
    
    var date = new Date()
    var timeFinish = date.getTime()/1000

    setting_game['gameStart'] = true
    setting_game['timeFinish'] = Math.floor(timeFinish+LIMIT_TIME)
    
    io.emit('getStatusGame', setting_game)
    res.send('Start Game at 60 minutes')
})
app.get('/stop', (req, res) => {
    var date = new Date()
    var timeStart = Math.floor(date.getTime()/1000)

    setting_game['gameStart'] = false
    pauseTime = setting_game['timeFinish']-timeStart

    io.emit('GAME', 'pause')
    console.log("Pause Remain : " + pauseTime + " second" )
    res.send( "Pause Remain : " + pauseTime + " second" )
})
app.get('/resume', (req, res) => {
    var date = new Date()
    var timeStart = Math.floor(date.getTime()/1000)

    setting_game['gameStart'] = true
    // console.log(LIMIT_TIME-pauseTime)
    setting_game['timeFinish'] = timeStart + pauseTime
    // console.log(setting_game['timeFinish'])

    io.emit('getStatusGame', setting_game)
    io.emit('GAME', 'resume')
    res.send('Resumed')
})