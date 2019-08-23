<template>
    <div class="container">
        <h1 class="title">Admin Panel</h1>
        <div style="font-size:1.5em;">
            เหลือเวลา <span>{{remainTime}}</span>&nbsp;
             <span :class="statusServer">({{statusServer}})</span>
        </div>
        <hr>
        <a class="button" @click="start()"><font-awesome-icon icon="step-backward" />&nbsp;เริ่มจับเวลา</a>&nbsp;
        <a class="button" @click="stop()"><font-awesome-icon icon="stop" />&nbsp;หยุดเวลา</a>&nbsp;
        <a class="button" @click="resume()"><font-awesome-icon icon="play" />&nbsp;เดินเวลาต่อ</a>&nbsp;
        <a class="button" @click="reset()"><font-awesome-icon icon="sync-alt" />&nbsp;ล้างเวลา</a>&nbsp;
        <hr>
        ตั้งเวลาใหม่ เหลือเวลาอีก 
        <input v-model="send_min" class="input" type="text" placeholder="0" maxlength="3" style="width:100px;">
        นาที 
        <a class="button" @click="resume_time()"><font-awesome-icon icon="step-forward" />&nbsp;เดินเวลาต่อ</a>&nbsp;
        <hr>
        ประกาศถึงผู้เล่น
        <textarea v-model="notice_msg" class="textarea" name="" id="" rows="3" placeholder="ใส่คำใบ้ที่นี่"></textarea>
        <br>
        <a class="button" @click="notice()"><font-awesome-icon icon="paper-plane" />&nbsp;ส่งข้อความ</a>&nbsp;
        <span style="color: #888;">{{notice_status}}</span>
        <hr>
        <h2>ขอความช่วยเหลือ</h2>
        <ul>
            <li v-for="value in helpTime">- ทีม {{name_team[value.team].team}} ขอความช่วยเหลือเมื่อเวลา {{value.time}} น.</li>
        </ul>
    </div>
</template>

<style scoped>
.container{
    background: #fff !important;
    color: #000;
    padding:20px;
}
</style>

<script>
import io from 'socket.io-client'
import axios from 'axios'
import passRoom from '../../db/user.json'

const HTTP_HOST = process.env.VUE_APP_HTTP_HOST

export default {
    data() {
        return {
            classTimer: ['timer'],
            statusServer: 'wait..',
            statusGame: false,
            timeStart: null,
            timeFinish: null,
            remainTime: 'wait',
            team: '',
            message: 'รอสัญญาณเริ่มเกม ... ขอให้โชคดี :)',
            socket: io(HTTP_HOST),
            interval: null,
            game_puzzle: false,
            game_musicbox: false,
            show_hint: false,
            numPenalty: 0,
            timePenalty: 0,
            checkFlagPenalty: false,
            // name_team: ['Demo','A','B','C','D','E','F'],
            hint: [],
            send_min: '',
            notice_msg: '',
            notice_status: '',
            helpTime: []
        }
    },
    mounted() {
        this.name_team = passRoom
        this.socket.on('getStatusGame', (data) => {
            this.statusGame = data.gameStart
            this.timeFinish = data.timeFinish
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
        this.socket.on('ADMIN_HELP', (data) => {
            this.helpTime = data
        })
        this.socket.on('connect', () => {
            if(this.socket.connected){
                this.statusServer = "online"
                this.socket.emit('LOGIN', {
                    team: this.team,
                    clientId: this.socket.id
                });
            }
            this.callInfoGame()
        })
        this.socket.on('disconnect', (reason) => {
            this.statusServer = "offline"
            console.log(reason)
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
                this.socket.connect();
            }
            // else the socket will automatically try to reconnect
        });
        this.countdownTime()
    },
    methods: {
        start() {
            axios.get(HTTP_HOST+'/start')
        },
        stop() {
            axios.get(HTTP_HOST+'/stop')
        },
        resume() {
            axios.get(HTTP_HOST+'/resume')
        },
        resume_time() {
            axios.get(HTTP_HOST+'/resume/'+(this.send_min)*60)
        },
        reset() {
            axios.get(HTTP_HOST+'/reset')
        },
        notice() {
            axios.get(HTTP_HOST+'/notice/'+this.notice_msg)
            this.notice_status = 'ส่งข้อความ : '+this.notice_msg
            this.notice_msg = ''
        },
        // callInfoGame() {
        //     this.socket.emit('SETTING');
        // },
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
        callInfoGame() {
            this.socket.emit('SETTING', this.team);
        },
    }
}
</script>
