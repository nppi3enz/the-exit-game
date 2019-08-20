<template>
  <div class="container" style="max-width:400px;">
    <div class="has-text-centered is-size-2">Please Login by STAFF</div>
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
import passRoom from '../../db/user.json'
const HTTP_HOST = process.env.VUE_APP_HTTP_HOST

export default {
  data() {
      return {
        //error: 'Type pass \'demo\' for testing gameplay',
        error: '',
        password: '',
        socket: io(HTTP_HOST),
      }
  },
  // mounted: () => {
  // },
  methods: {
    loginBtn() {
      var pos = passRoom.findIndex(i => i.user === this.password);
      if( pos >= 0 && passRoom[pos].active == true) {
        this.gotoRoom(pos)
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
