<template>
  <div>
    <div class="container">
        <div class="columns is-mobile">
            <div class="column">
                Team: xxxx {{statusGame}}
            </div>
            <div class="column">Status: {{statusServer}}</div>
            <div class="column">Penalty: 00</div>
        </div>
        <div class="timer">
            {{remainTime}}
        </div>
        <div class="columns">
            <div class="column is-full">message</div>
        </div>
        <div>
            {{timeStart}} / {{timeFinish}}
        </div>
    </div>
    <div class="menu">
        <div class="columns is-mobile">
            <button class="column is-size-3" v-on:click="callInfoGame">
                <font-awesome-icon icon="lightbulb" />
                Hint</button>
            <button class="column is-size-3">
                <font-awesome-icon icon="skull-crossbones" />
                Penalty
                </button>
            <button class="column is-size-3">
                <font-awesome-icon icon="lock" />
                Code</button>
        </div>
        <div class="columns is-mobile">
            <button class="column is-size-3">
                <font-awesome-icon icon="search" />
                Review Hints</button>
            <button class="column is-size-3">Auto</button>
            <button class="column is-size-3">
                <font-awesome-icon icon="cog" />
                Machine</button>
        </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
    //name: 'App',
    data() {
        return {
            statusServer: 'wait..',
            statusGame: false,
            timeStart: null,
            timeFinish: null,
            remainTime: 'wait',
            user: '',
            message: '',
            messages: [],
            socket: io('localhost:3001'),
            interval: null
        }
    },
    mounted() {
        this.socket.on('SETTING', (data) => {
            
            //this.messages = [...this.messages, data];
            // you can also do this.messages.push(data)
        });
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
            console.log(reason)
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
                socket.connect();
            }
            // else the socket will automatically try to reconnect
        });
        this.socket.on('GAME', (data) => {
            if(data == 'pause') {
                clearInterval(this.interval)
            } else if(data == 'resume'){
                this.countdownTime()
            }
        });
        this.countdownTime()
    },
    methods: {
        countdownTime() {
            this.interval = setInterval(() => {
                if(this.statusServer == "online" && this.statusGame == true) {
                    this.calculateTime()
                } else {
                    this.remainTime = '00:00'
                }
            },1000);
        },
        callInfoGame() {
            this.socket.emit('SETTING');
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
        sendMessage(e) {
            e.preventDefault();
            
            this.socket.emit('SEND_MESSAGE', {
                // user: this.user,
                message: this.message
            });
            this.message = ''
        },
        callHint() {
            //alert('hint')
            this.socket.emit('SEND_MESSAGE', {
                message: 'testtttesdsadt'
            });
        }
    },

}
</script>