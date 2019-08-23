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

var helpTime = []

const hints = require('./db/hints')
const codes = require('./db/codes')
const users = require('./db/user')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

var sessionTeam = []
var sessionAdmin

var totalPenalty = []
var totalHint = []
var resultTeam = []

function resetGame(){
    for(var i=0;i<users.length;i++){
        totalPenalty[i] = 0
        totalHint[i] = []
        resultTeam[i] = false
    }
    helpTime = []
}
// var date = new Date()

// var setting_game = {
//     'gameStart': true,
//     'timeFinish': 1558000773+3600,
// }

io.on('connection', function(socket) {
    socket.on('GAME', function() {
        io.emit('SETTING', setting_game)
    });
    socket.on('SETTING', function(team) {
        if(team == 'admin'){
            io.to(sessionAdmin).emit('getSettingGame', 
            {
                setting_game: setting_game,
                hint: totalHint[team],
                info_game: {
                    totalPenalty: totalPenalty,
                    totalHint: totalHint,
                    resultTeam: resultTeam
                }
            })
        } else {
            io.to(sessionTeam[team]).emit('getSettingGame', 
            {
                setting_game: setting_game,
                hint: totalHint[team]
            })
        }
    });
    socket.on('LOGIN', function(result) {
        // io.emit('getStatusGame', setting_game)
        if(result.team != 'admin'){
            sessionTeam[result.team] = result.clientId
        } else {
            sessionAdmin = result.clientId
        }
    });
    socket.on('PENALTY', function(result) {
        console.log('PENALTY')
        console.log(result)
        totalPenalty[result] += 1
        io.emit('ADMIN_PENALTY', totalPenalty)
    });
    socket.on('COMPLETE', function(team) {
        resultTeam[team] = true
        io.emit('ADMIN_COMPLETE', {last: team, data: resultTeam})
    });
    
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//game
app.get('/penalty/:id', (req, res) => {
    totalPenalty[req.params.id] += 1
    io.emit('ADMIN_PENALTY', totalPenalty)
    res.send('penalty complete')
    // var obj = hints.find(hint => hint.id === req.params.id)
    // console.log(obj)
    // if(obj !== undefined) {
    //     res.json(obj)
    // } else {
    //     res.status(404).send('Not found');
    // }
})
// timer
app.get('/start', (req, res) => {
    var date = new Date()
    var timeFinish = date.getTime()/1000

    setting_game = {
        'gameStart' : true,
        'timeStart' : Math.floor(date.getTime()/1000),
        'timeFinish' : Math.floor(timeFinish+LIMIT_TIME)
    }
    
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
    var date = new Date()
    var timeStart = Math.floor(date.getTime()/1000)

    setting_game['gameStart'] = true
    setting_game['timeStart'] = timeStart
    setting_game['timeFinish'] = timeStart+parseInt(req.params.time)
    
    io.emit('getStatusGame', setting_game)
    io.emit('GAME', 'resume')
    // res.send('Resumed')
    res.send(setting_game)
})
app.get('/reset', (req, res) => {
    setting_game = {
        'gameStart': false,
        'timeStart': 0,
        'timeFinish': 0,
    }
    resetGame();

    io.emit('getStatusGame', setting_game)
    //refresh admin
    io.to(sessionAdmin).emit('getSettingGame', 
    {
        setting_game: setting_game,
        info_game: {
            totalPenalty: totalPenalty,
            totalHint: totalHint,
            resultTeam: resultTeam
        }
    })
    io.emit('GAME', 'reset')
    res.send('Reseted')
})
app.get('/admin', (req, res) => {
    res.send('Admin')
})
app.get('/refresh', (req, res) => {
    res.send(setting_game)
})
app.get('/hint/:id/:team', (req, res) => {
    var obj = hints.find(hint => hint.id === req.params.id)
    if(obj !== undefined) {
        res.json(obj)
        if ( totalHint[req.params.team].indexOf(req.params.id) < 0) {
            totalHint[req.params.team].push(req.params.id)
        }
        //sendback
        io.to(sessionTeam[req.params.team]).emit('updateHint', totalHint[req.params.team])
        io.emit('ADMIN_HINT', totalHint)
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
app.get('/notice/:msg', (req, res) => {
    io.emit('MSG', req.params.msg)
    res.send('Complete');
})
app.get('/status/:msg', (req, res) => {
    io.emit('STATUS', req.params.msg)
    res.send('Complete');
})
// app.get('/machine/:id', (req, res) => {
    // const updateIndex = books.findIndex(book => book.id === req.params.id)
    // res.json(Object.assign(books[updateIndex], req.body))
    // res.send('{"card":12, "desc":"MACH_12"}')
// })
function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
}
app.get('/help/:team', (req, res) => {
    var today = new Date();
    var h = checkTime(today.getHours());
    var m = checkTime(today.getMinutes());
    var s = checkTime(today.getSeconds());

    helpTime.unshift({
        team: req.params.team,
        time: h + ":" + m + ":" + s
    })
    io.emit('ADMIN_HELP', helpTime)
    res.send('Complete')
})