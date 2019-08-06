<template>
  <div class="container" style="max-width:400px;">
    <div class="has-text-centered is-size-2">Please Login by Staff</div>
    <div class="about">
      <form action="">
        <div class="field">
          <!-- <label class="label">Password</label> -->
          <div class="control">
            <input class="input is-large" type="password" placeholder="Password" v-model="password">
          </div>
          <p class="help">{{error}}</p>
        </div>
        <button class="button is-warning is-large" type="button" @click="loginBtn">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
const HTTP_HOST = process.env.VUE_APP_HTTP_HOST

export default {
  data() {
      return {
        error: 'Type pass \'demo\' for testing gameplay',
        password: '',
        socket: io(HTTP_HOST),
      }
  },
  // mounted: () => {
  // },
  methods: {
    loginBtn() {
      if(this.password == 'demo'){
        this.gotoRoom(0)
      } else if(this.password == 'aaa'){
        this.gotoRoom(1)
      } else if(this.password == 'bbb'){
        this.gotoRoom(2)
      } else if(this.password == 'ccc'){
        this.gotoRoom(3)
      } else if(this.password == 'ddd'){
        this.gotoRoom(4)
      } else if(this.password == 'eee'){
        this.gotoRoom(5)
      } else if(this.password == 'fff'){
        this.gotoRoom(6)
      } else {
      this.error = 'รหัสผ่านไม่ถูกต้อง'
      }
    },
    gotoRoom(n){
      localStorage.setItem('login', n)
      this.$router.push('game') 
    }
  }

}
</script>
