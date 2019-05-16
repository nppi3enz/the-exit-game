const express = require('express');
const bodyParser = require('body-parser')

const app = express();

var port = process.env.PORT || 5000;

const server = app.listen(port, function() {
    console.log("application is listening on:", port);
});

const io = require('socket.io')(server);

var pauseTime = 0
var LIMIT_TIME = 3600

var setting_game = {
    'gameStart': false,
    'timeStart': null,
    'timeFinish': null
}

const hints = require('./db/hints')
const codes = require('./db/codes')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

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
    });
    // socket.on('SEND_MESSAGE', function(data) {
    //     console.log(data)
    //     io.emit('MESSAGE', data)
    // });
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/start', (req, res) => {
    var date = new Date()
    var timeFinish = date.getTime()/1000

    setting_game['gameStart'] = true
    setting_game['timeFinish'] = Math.floor(timeFinish+LIMIT_TIME)
    
    io.emit('GAME', 'start')
    io.emit('getStatusGame', setting_game)
    res.send('Start Game finishTime : '+setting_game['timeFinish'])
})
app.get('/stop', (req, res) => {
    var date = new Date()
    var timeStart = Math.floor(date.getTime()/1000)

    setting_game['gameStart'] = false
    pauseTime = setting_game['timeFinish']-timeStart

    io.emit('getStatusGame', setting_game)
    io.emit('GAME', 'pause')
    console.log("Pause Remain : " + pauseTime + " second" )
    res.send( "Pause Remain : " + pauseTime + " second" )
})
app.get('/resume', (req, res) => {
    var date = new Date()
    var timeStart = Math.floor(date.getTime()/1000)

    setting_game['gameStart'] = true
    setting_game['timeFinish'] = timeStart + pauseTime
    
    io.emit('getStatusGame', setting_game)
    io.emit('GAME', 'resume')
    res.send('Resumed')
})
app.get('/resume/:time', (req, res) => {
    setting_game['gameStart'] = true
    setting_game['timeFinish'] = req.params.time
    
    io.emit('getStatusGame', setting_game)
    io.emit('GAME', 'resume')
    res.send('Resumed')
})
app.get('/reset', (req, res) => {
    setting_game['gameStart'] = false
    io.emit('getStatusGame', setting_game)
    io.emit('GAME', 'reset')
    res.send('Reseted')
})
app.get('/admin', (req, res) => {
    res.send('Admin')
})

app.get('/hint/:id', (req, res) => {
    var obj = hints.find(hint => hint.id === req.params.id)
    console.log(obj)
    if(obj !== undefined) {
        res.json(obj)
    } else {
        res.status(404).send('Not found');
    }
})
app.get('/code/:id', (req, res) => {
    var obj = codes.find(code => code.id === req.params.id)
    console.log(obj)
    if(obj !== undefined) {
        res.json(obj)
    } else {
        res.status(404).send('Not found');
    }
})
// app.get('/machine/:id', (req, res) => {
    // const updateIndex = books.findIndex(book => book.id === req.params.id)
    // res.json(Object.assign(books[updateIndex], req.body))
    // res.send('{"card":12, "desc":"MACH_12"}')
// })