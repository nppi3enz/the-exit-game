<template>
  <div>
    <div class="container">
        <div class="columns is-mobile">
            <div class="column">
                Team: xxxx {{statusGame}}
            </div>
            <div class="column">Status: {{statusServer}}</div>
            <div class="column">Penalty: 00</div>
            <div class="column">Hint: 00</div>
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
            <button class="column" @click="callHint" :disabled="!statusGame">
                <font-awesome-icon icon="lightbulb" size="3x" /><br>
                Hint</button>
            <button class="column" :disabled="!statusGame">
                <font-awesome-icon icon="skull-crossbones" size="3x" /><br>
                Penalty
                </button>
            <button class="column" :disabled="!statusGame">
                <font-awesome-icon icon="lock" size="3x" /><br>
                Code</button>
        </div>
        <div class="columns is-mobile">
            <button class="column" :disabled="!statusGame">
                <font-awesome-icon icon="search" size="3x" /><br>
                Review Hints</button>
           
            <button class="column" @click="callMachine" :disabled="!statusGame">
                <font-awesome-icon icon="cog" size="3x"  /><br>
                Machine</button>
        </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import keyboard from 'vue-keyboard';
const HTTP_HOST = "http://192.168.43.223:3001"
export default {
    //name: 'App',
    components: { keyboard },    
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
            socket: io(HTTP_HOST),
            interval: null
        }
    },
    mounted() {
        this.socket.on('SETTING', () => {
            
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
                    return fetch(`${HTTP_HOST}/hint/${id}`)
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
                showLoaderOnConfirm: true,
                preConfirm: (id) => {
                    return fetch(`http://localhost:3001/machine/${id}`)
                    .then(response => {
                        if (!response.ok) {
                            this.$swal({
                                type: 'error',
                                title: 'ไม่พบหมายเลขการ์ดนี้'})
                            throw new Error("testset")
                        }
                        // console.log(response)
                        return response.json()
                    })
                    .catch()
                },
                allowOutsideClick: () => !this.$swal.isLoading()
                }).then((result) => {
                    console.log(result)
                    if (result.value.desc) {
                        this.$swal({
                            title: `${result.value.desc} ----`,
                    //     imageUrl: result.value.avatar_url
                        })
                    }
                })
        }
    },

}
</script>