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
        <button class="button is-primary is-large" type="submit" @click="loginBtn">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  data() {
      return {
        error: '',
        password: ''
      }
  },
  methods: {
    loginBtn() {
      if(this.password == 'aaa'){
        localStorage.setItem('login', 0)
        this.$router.push('Game') 
      } else if(this.password == 'bbb'){
        localStorage.setItem('login', 1)
        this.$router.push('Game') 
      } else if(this.password == 'ccc'){
        localStorage.setItem('login', 2)
        this.$router.push('Game') 
      } else if(this.password == 'ddd'){
        localStorage.setItem('login', 3)
        this.$router.push('Game') 
      } else if(this.password == 'eee'){
        localStorage.setItem('login', 4)
        this.$router.push('Game') 
      } else if(this.password == 'fff'){
        localStorage.setItem('login', 5)
        this.$router.push('Game') 
      }
      this.error = 'รหัสผ่านไม่ถูกต้อง'
    }
  }

}
</script>
