<template>
  <div>
    <div class="container">
        <div class="timer">
            {{remainTime}}
        </div>
        <div class="columns">
            <div class="column is-full">
                <div class="has-text-danger has-text-centered">
                    {{message}}
                </div>
            </div>
        </div>
    </div>
    <div class="menu">
        <div class="columns is-mobile">
            <button class="column hint" @click="callHint" :disabled="!statusGame">
                <font-awesome-icon icon="lightbulb" size="3x" /><br>
                Hint</button>
            <button class="column penalty" @click="callPenalty" :disabled="!statusGame">
                <font-awesome-icon icon="skull-crossbones" size="3x" /><br>
                Penalty
                </button>
                <!-- !statusGame &&  -->
            <button class="column code" @click="callCode" :disabled="!statusGame || checkFlagPenalty">
                <font-awesome-icon icon="lock" size="3x" /><br>
                Code</button>
        </div>
        <div class="columns is-mobile">
            <button class="column review" @click="reviewHint"  :disabled="!statusGame">
                <font-awesome-icon icon="search" size="3x" /><br>
                Review Hints</button>
            <div class="column" style="color:#fff;background:rgba(0,0,0,0.8);">
                Team: {{name_team[team]}}<br>
                Status: <span :class="statusServer">{{statusServer}}</span><br>
                Hint: {{hint.length}}
                
            </div>
           
            <button class="column machine" @click="callMachine" :disabled="!statusGame">
                <font-awesome-icon icon="cog" size="3x"  /><br>
                Machine</button>
        </div>
    </div>
    
    <div v-bind:class="{modal: true, 'is-active': show_hint }">
        <div class="modal-background"></div>
        <div class="modal-content" style="background: #fff;padding: 10px;text-align: center;">
            <div style="font-size:1.5em;color:#888;padding: 10px;">เลือกหมายเลขที่ต้องการค่ะ</div>
            <button class="button" v-for="hint_item in hint" v-on:click="callHintNum(hint_item)" >
                {{ hint_item }}
            </button>
        </div>
        <button @click="closeBtn" class="modal-close is-large" ></button>
    </div>
    <div v-bind:class="{modal: true, 'is-active': game_puzzle }">
        <div class="modal-background"></div>
        <div class="modal-content">
            <puzzle></puzzle>
        </div>
        <button  @click="closeBtn" class="modal-close is-large" ></button>
    </div>
    <div v-bind:class="{modal: true, 'is-active': game_musicbox }">
        <div class="modal-background"></div>
        <div class="modal-content">
            <music-box></music-box>
        </div>
        <button  @click="closeBtn" class="modal-close is-large" ></button>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
import axios from 'axios'

// import keyboard from 'vue-keyboard'
import puzzle from './Puzzle'
import musicBox from './Musicbox'
const HTTP_HOST = process.env.VUE_APP_HTTP_HOST

export default {
    //name: 'App',
    components: { puzzle, musicBox },    
    data() {
        return {
            statusServer: 'wait..',
            statusGame: false,
            timeStart: null,
            timeFinish: null,
            remainTime: 'wait',
            team: '',
            message: 'ขอให้โชคดี :)',
            socket: io(HTTP_HOST),
            interval: null,
            game_puzzle: false,
            game_musicbox: false,
            show_hint: false,
            numPenalty: 0,
            timePenalty: 0,
            checkFlagPenalty: false,
            name_team: ['A','B','C','D','E','F'],
            hint: []
        }
    },
    mounted() {
        if(localStorage.getItem('timePenalty')){
            this.timePenalty = localStorage.getItem('timePenalty')
        }
        if(!localStorage.getItem('login')) {
            this.$router.push('/') 
        }
        this.team = localStorage.getItem('login')
        
        this.socket.on('getStatusGame', (data) => {
            this.statusGame = data.setting_game.gameStart
            this.timeFinish = data.setting_game.timeFinish
            this.hint = (data.hint != undefined) ? data.hint : []
        });
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
        this.socket.on('updateHint', (data) => {
            this.hint = data
        })
        this.socket.on('MSG', (data) => {
            this.$swal({
                title: data
            })
        })
        this.socket.on('STATUS', (data) => {
            this.message = data
        })
        
        this.countdownTime()
    },
    methods: {
        callPenalty() {
            axios.get(HTTP_HOST+'/penalty/'+this.team)
                .then(response => {
                    this.todos = response.data
                })
                .catch(error => {
                console.log(error);
            })
        },
        checkPenalty() {
            if(this.timePenalty > Math.floor(Date.now() / 1000)) {
                this.checkFlagPenalty = true
                return true
            }
            this.checkFlagPenalty = false
            return false
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
        callInfoGame() {
            this.socket.emit('SETTING', this.team);
        },
        calculateTime() {
            function pad(d) { return (d < 10) ? '0' + d.toString() : d.toString(); }
            // var date = Math.floor(Date.now() / 1000)
            this.timeStart = Math.floor(Date.now() / 1000)
            var time = parseInt(this.timeFinish)-parseInt(this.timeStart)
            
            var minutes = Math.floor(time / 60)
            var seconds = time - minutes * 60
            this.remainTime = pad(minutes)+":"+pad(seconds)
            this.checkPenalty()
        },
        sendMessage(e) {
            e.preventDefault();
            
            this.socket.emit('SEND_MESSAGE', {
                // user: this.user,
                message: this.message
            });
            this.message = ''
        },
        reviewHint() {
            this.show_hint = true
        },
        callHintNum(id) {
            axios.get(`${HTTP_HOST}/hint/${id}/${this.team}`)
            .then(result => {
                this.show_hint = false
                this.$swal({
                    title: 'คำใบ้หมายเลข '+id,
                    text: result.data.hint
                })
            })
        },
        callHint() {
            this.$swal({
                title: 'Hint',
                text: 'ใส่หมายเลขการ์ดที่ต้องการขอคำใบ้',
                input: 'number',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                cancelButtonText: 'ยกเลิก',
                showCancelButton: true,
                confirmButtonText: 'ตกลง',
                showLoaderOnConfirm: true,
                preConfirm: (id) => {
                    return fetch(`${HTTP_HOST}/hint/${id}/${this.team}`)
                    .then(response => {
                        if (!response.ok) {
                            this.$swal({
                                type: 'error',
                                title: 'ไม่พบหมายเลขการ์ดนี้'})
                        }
                        return response.json()
                    })
                },
                allowOutsideClick: () => !this.$swal.isLoading()
                }).then((result) => {
                    if (result.value.hint) {
                        this.$swal({
                            title: 'คำใบ้หมายเลข '+result.value.id,
                            text: result.value.hint
                        })
                    }
                })
        },
        callMachine() {
            this.$swal({
                title: 'ใส่หมายเลขการ์ด',
                input: 'number',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                cancelButtonText: 'ยกเลิก',
                showCancelButton: true,
                confirmButtonText: 'ตกลง',
                allowOutsideClick: () => !this.$swal.isLoading()
                }).then((code) => {
                    if(code.value == 40){ //musicbox
                        this.game_musicbox = true
                    } else if(code.value == 31){ //puzzle
                        this.game_puzzle = true
                    } else {
                        if(!code.dismiss) {
                            this.$swal({
                            type: 'error',
                            title: 'ไม่พบหมายเลขการ์ดนี้'})
                        }
                    }
                })
        },
        callCode() {
            this.$swal({
                title: 'Code',
                text: 'กรุณาใส่รหัสผ่าน 4 ตัว',
                input: 'number',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                cancelButtonText: 'ยกเลิก',
                showCancelButton: true,
                confirmButtonText: 'ตกลง',
                showLoaderOnConfirm: true,
                preConfirm: (id) => {
                    return fetch(`${HTTP_HOST}/code/${id}`)
                    .then(response => {
                        if (!response.ok) {
                            this.$swal({
                                type: 'error',
                                title: 'รหัสผ่านไม่ถูกต้อง'})
                            this.numPenalty++
                            if(this.numPenalty == 3){
                                this.message = 'คุณถูกระงับไม่ให้ใส่รหัส 2 นาที'
                                this.timePenalty = Math.floor(Date.now() / 1000) + 120
                                localStorage.setItem("timePenalty", this.timePenalty);
                                this.socket.emit('PENALTY', this.team)
                                this.numPenalty = 0
                            }
                            throw new Error("testset")
                        }
                        return response.json()
                    })
                    .catch()
                },
                allowOutsideClick: () => !this.$swal.isLoading()
                }).then((result) => {
                    if(result.value.id == '5130') {
                        this.socket.emit('COMPLETE', this.team)
                        clearInterval(this.interval)
                    }
                    if (result.value.result) {
                        this.$swal({
                            title: result.value.result,
                        })
                    }
                })
        },
        closeBtn() {
            this.game_puzzle = false
            this.game_musicbox = false
            this.show_hint = false
        }
    },

}
</script>