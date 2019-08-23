<template>
    <div class="puzzle">
        <div v-if="puzzleVisible">
            <table class="table">
                <tbody>
                    <tr>
                        <td><input type="number" v-model="val1" class="input is-fullwidth" size="1" maxlength="1" min=0 max=9></td>
                        <td>+</td>
                        <td><input type="number" v-model="val2" class="input is-fullwidth" size="1" maxlength="1" min=0 max=9></td>
                        <td>-</td>
                        <td>9</td>
                        <td>=4</td>
                    </tr>
                    <tr>
                        <td>+</td>
                        <td>&nbsp;</td>
                        <td>-</td>
                        <td>&nbsp;</td>
                        <td>-</td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td><input type="number" v-model="val3" class="input is-fullwidth" size="1" maxlength="1" min=0 max=9></td>
                        <td>-</td>
                        <td><input type="number" v-model="val4" class="input is-fullwidth" size="1" maxlength="1" min=0 max=9></td>
                        <td>*</td>
                        <td><input type="number" v-model="val5" class="input is-fullwidth" size="1" maxlength="1" min=0 max=9></td>
                        <td>=4</td>
                    </tr>
                    <tr>
                        <td>/</td>
                        <td>&nbsp;</td>
                        <td>*</td>
                        <td>&nbsp;</td>
                        <td>-</td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td><input type="number" v-model="val6" class="input is-fullwidth" size="1" maxlength="1" min=0 max=9></td>
                        <td>+</td>
                        <td><input type="number" v-model="val7" class="input is-fullwidth" size="1" maxlength="1" min=0 max=9></td>
                        <td>-</td>
                        <td><input type="number" v-model="val8" class="input is-fullwidth" size="1" maxlength="1" min=0 max=9></td>
                        <td>=4</td>
                    </tr>
                    <tr>
                        <td>=4</td>
                        <td></td>
                        <td>=4</td>
                        <td></td>
                        <td>=4</td>
                        <td>&nbsp;</td>
                    </tr>
                </tbody>
            </table>
            <div class="has-text-danger has-text-centered">
                {{error}}
            </div>
            <div class="puzzle-footer columns is-mobile">
                <div class="column">
                <a class="button is-danger is-fullwidth" @click="resetBtn">ล้างข้อมูล</a>
                </div>
                <div class="column">
                <a class="button is-primary is-fullwidth" @click="checkAnswer">ส่งคำตอบ</a>
                </div>
            </div>
        </div>
        <div class="correctBox" v-if="correct" >
            <h2>คำตอบถูกต้อง ยินดีด้วย</h2>
            <!-- <h4>สามารถหยิบการ์ดหมายเลข (13) และทิ้งการ์ด (31) ได้เลย</h4> -->
            <h4>96</h4>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            puzzleVisible: true,
            correct: false,
            error: '',
            val1: '', val2: '', val3: '',val4: '',val5: '',val6: '',val7: '',val8: '',
        }
    },
    methods: {
        checkAnswer() {
            if(this.val1 == 5 && this.val2 == 8 && this.val3 == 7 && this.val4 == 6  && this.val5 == 4  && this.val6 == 3  && this.val7 == 2  && this.val8 == 1 ){
                this.puzzleVisible = false
                this.correct = true
            } else {
                this.error = 'คำตอบของคุณไม่ถูกต้อง'
            }
        },
        resetBtn() {
            this.error = ''
            this.val1 = this.val2 = this.val3 = this.val4 = this.val5 = this.val6 = this.val7 = this.val8 = ''
        }
    }
}
</script>
