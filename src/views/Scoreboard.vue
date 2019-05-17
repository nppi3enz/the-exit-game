<template>
    <div class="scoreboard">
        <div class="timer">
            {{ remainTime }}
        </div>
        <div>
            <div class="columns">
                <div class="column">
                    Team A
                </div>
                <div class="column">
                    <font-awesome-icon icon="skull-crossbones" size="1x" /> {{totalPenalty[0]}}
                </div>
                <div class="column">
                    <font-awesome-icon icon="lightbulb" size="1x" /> {{totalHint[0].length}}
                </div>
            </div>
            <div class="columns">
                <div class="column">
                    Team B
                </div>
                <div class="column">
                    <font-awesome-icon icon="skull-crossbones" size="1x" /> {{totalPenalty[1]}}
                </div>
                <div class="column">
                    <font-awesome-icon icon="lightbulb" size="1x" /> {{totalHint[1].length}}
                </div>
            </div>
            <div class="columns">
                <div class="column">
                    Team C
                </div>
                <div class="column">
                    <font-awesome-icon icon="skull-crossbones" size="1x" /> {{totalPenalty[2]}}
                </div>
                <div class="column">
                    <font-awesome-icon icon="lightbulb" size="1x" /> {{totalHint[2].length}}
                </div>
            </div>
            <div class="columns">
                <div class="column">
                    Team D
                </div>
                <div class="column">
                    <font-awesome-icon icon="skull-crossbones" size="1x" /> {{totalPenalty[3]}}
                </div>
                <div class="column">
                    <font-awesome-icon icon="lightbulb" size="1x" /> {{totalHint[3].length}}
                </div>
            </div>
            <div class="columns">
                <div class="column">
                    Team E
                </div>
                <div class="column">
                    <font-awesome-icon icon="skull-crossbones" size="1x" /> {{totalPenalty[4]}}
                </div>
                <div class="column">
                    <font-awesome-icon icon="lightbulb" size="1x" /> {{totalHint[4].length}}
                </div>
            </div>
            <div class="columns">
                <div class="column">
                    Team F
                </div>
                <div class="column">
                    <font-awesome-icon icon="skull-crossbones" size="1x" /> {{totalPenalty[5]}}
                </div>
                <div class="column">
                    <font-awesome-icon icon="lightbulb" size="1x" /> {{totalHint[5].length}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import io from 'socket.io-client'
import axios from 'axios'

const HTTP_HOST = process.env.VUE_APP_HTTP_HOST

export default {
    data() {
        return {
            statusServer: null,
            remainTime: 'wait',
            timeStart: null,
            timeFinish: null,
            interval: null,
            socket: io(HTTP_HOST),
            totalPenalty: [0,0,0,0,0,0],
            totalHint: [[], [], [], [], [], []],
        }
    },
    mounted() {
        this.socket.on('getStatusGame', (data) => {
            this.statusGame = data.gameStart
            this.timeFinish = data.timeFinish
        });
        this.socket.on('connect', () => {
            if(this.socket.connected){
                this.statusServer = "online"
            }
            this.callInfoGame()
        })
        this.socket.on('disconnect', (reason) => {
            this.statusServer = "offline"
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
                this.socket.connect();
            }
            // else the socket will automatically try to reconnect
        });
        this.socket.on('GAME', (data) => {
            if(data == 'pause') {
                clearInterval(this.interval)
            } else if(data == 'resume'){
                this.countdownTime()
            } else if(data == 'reset'){
                clearInterval(this.interval)
                this.remainTime = '60:00'
            } else if(data == 'start'){
                this.countdownTime()
            }
        });
        this.socket.on('ADMIN_PENALTY', (data) => {
            this.totalPenalty = data
        })
        this.socket.on('ADMIN_HINT', (data) => {
            this.totalHint = data
        })

    },
    methods: {
        callInfoGame() {
            this.socket.emit('SETTING');
        },
        countdownTime() {
            this.interval = setInterval(() => {
                if(this.statusServer == "online" && this.statusGame == true) {
                    this.calculateTime()
                } else {
                    this.remainTime = '00:00'
                }
            },1000);
        },
        calculateTime() {
            function pad(d) { return (d < 10) ? '0' + d.toString() : d.toString(); }
            // var date = Math.floor(Date.now() / 1000)
            this.timeStart = Math.floor(Date.now() / 1000)
            var time = parseInt(this.timeFinish)-parseInt(this.timeStart)
            
            var minutes = Math.floor(time / 60)
            var seconds = time - minutes * 60
            this.remainTime = pad(minutes)+":"+pad(seconds)
        },
    }
}
</script>
