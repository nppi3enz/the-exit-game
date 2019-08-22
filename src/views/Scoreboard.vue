<template>
    <div id="scoreboard">
        <div :class="classTimer">
            <vue-circle
                ref="myUniqueID"
                :progress="100"
                :size="300"
                :reverse="true"
                line-cap="square"
                :fill="fill"
                empty-fill="rgba(0, 0, 0, .1)"
                :animation-start-value="0.0"
                :start-angle="4.7"
                insert-mode="append"
                :thickness="10"
                :show-percent="false"
                @vue-circle-progress="progress"
                @vue-circle-end="progress_end">
                <div class="inner-time">{{ remainTime }}</div>
            </vue-circle>
        </div>
        <div class="container teams">
            <div class="columns is-multiline is-centered is-mobile">
                <div v-for="item in passRoom" class="column is-one-quarter has-text-centered">
                    <div class="title-team">
                        Team {{item.team}}
                    </div>
                    <div :class="['lock-box', resultLock(item.id)]">
                        <div class="icon">
                            <font-awesome-icon :icon="resultLock(item.id)" size="2x"  />
                        </div>
                    </div>
                    <div class="columns score">
                        <div class="column">
                            <font-awesome-icon icon="skull-crossbones" size="1x" /> 
                            {{totalPenalty[item.id]}}
                        </div>
                        <div class="column">
                            <font-awesome-icon icon="lightbulb" size="1x" /> 
                            {{totalHint[item.id].length}}
                        </div>
                    </div>
                </div>
                
                </div>
        </div>
    </div>
</template>

<script>
import io from 'socket.io-client'
import axios from 'axios'
import VueCircle from 'vue2-circle-progress/src/index.vue'
import passRoom from '../../db/user.json'

const HTTP_HOST = process.env.VUE_APP_HTTP_HOST

export default {
    components: {
      VueCircle
    },
    data() {
        return {
            fill : { gradient: ["#56dfbf"] },
            statusServer: null,
            statusGame: null,
            remainTime: '00:00',
            timeStart: null,
            timeFinish: null,
            interval: null,
            socket: io(HTTP_HOST),
            totalPenalty: [],
            totalHint: [],
            totalLock: [],
            classTimer: ['timer'],
            passRoom: [],
        }
    },
    mounted() {
        var temp = []
        for(var i=0;i<passRoom.length;i++){
            if(passRoom[i].active == true){
                passRoom[i].id = i
                temp.push(passRoom[i])
                this.totalPenalty[i] = 0
                this.totalHint[i] = []
                this.totalLock[i] = false
            }
        }
        this.passRoom = temp
        
        this.socket.on('getSettingGame', (data) => {
            this.statusGame = data.setting_game.gameStart
            this.timeFinish = data.setting_game.timeFinish
            this.hint = (data.hint != undefined) ? data.hint : []
            if(this.statusGame == true) {
                this.message = 'เริ่มเกมได้'
            }
            this.totalPenalty = data.info_game.totalPenalty
            this.totalHint = data.info_game.totalHint
            this.totalLock = data.info_game.resultTeam

            this.countdownTime()
        });
        this.socket.on('getStatusGame', (data) => {
            this.statusGame = data.gameStart
            this.timeStart = data.timeStart
            this.timeFinish = data.timeFinish
        });
        this.socket.on('connect', () => {
            if(this.socket.connected){
                this.statusServer = "online"
                this.socket.emit('LOGIN', {
                    team: 'admin',
                    clientId: this.socket.id
                });
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
                this.message = 'หยุดเวลาชั่วคราว'
                clearInterval(this.interval)
            } else if(data == 'resume'){
                this.message = 'เริ่มเกมได้'
                this.countdownTime()
            } else if(data == 'reset'){
                clearInterval(this.interval)
                this.remainTime = '60:00'
            } else if(data == 'start'){
                this.message = 'เริ่มเกมได้'
                this.countdownTime()
            }
        });
        this.socket.on('ADMIN_PENALTY', (data) => {
            this.totalPenalty = data
        })
        this.socket.on('ADMIN_HINT', (data) => {
            this.totalHint = data
        })
        this.socket.on('ADMIN_COMPLETE', (res) => {
            this.totalLock = res.data
            this.changeColor()
        })

    },
    methods: {
        changeColor() {
            this.$refs.objCircle.updateFill("hsl(348, 100%, 61%)");
        },
        progress(event,progress,stepValue){
            // console.log(stepValue);
        },
        progress_end(event){
            // console.log("Circle progress end");
        },
        callInfoGame() {
            this.socket.emit('SETTING', 'admin');
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
            this.$refs.myUniqueID.updateProgress(Math.floor(100*time/3600));
            var minutes = Math.floor(time / 60)
            var seconds = time - minutes * 60
            this.remainTime = pad(minutes)+":"+pad(seconds)

            if( (minutes > 10) && (this.timeFinish > this.timeStart) ){
                
            } else {
                this.classTimer = ['timer', 'is-danger']
                this.$refs.myUniqueID.updateFill("hsl(348, 100%, 61%)");
            }
        },
        resultLock(team){
            if(!this.totalLock[team]) {
                return 'lock'
            } else {
                return 'unlock'
            }
        }
    }
}
</script>
