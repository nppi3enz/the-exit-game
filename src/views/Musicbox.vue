<template>
    <div class="musicbox">
        <div v-if="musicboxVisible">
            <table class="table">
                <tbody>
                    <tr>
                        <td class="is-size-4">Q</td>
                        <td><input type="checkbox" value="Q1" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="Q2" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="Q3" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="Q4" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="Q5" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="Q6" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="Q7" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="Q8" v-model="selectNotes" class="checkbox-round"></td>
                    </tr>
                    <tr>
                        <td class="is-size-4">W</td>
                        <td><input type="checkbox" value="W1" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="W2" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="W3" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="W4" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="W5" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="W6" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="W7" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="W8" v-model="selectNotes" class="checkbox-round"></td>
                    </tr>
                    <tr>
                        <td class="is-size-4">E</td>
                        <td><input type="checkbox" value="E1" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="E2" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="E3" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="E4" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="E5" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="E6" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="E7" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="E8" v-model="selectNotes" class="checkbox-round"></td>
                    </tr>
                    <tr>
                        <td class="is-size-4">R</td>
                        <td><input type="checkbox" value="R1" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="R2" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="R3" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="R4" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="R5" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="R6" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="R7" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="R8" v-model="selectNotes" class="checkbox-round"></td>
                    </tr>
                    <tr>
                        <td class="is-size-4">T</td>
                        <td><input type="checkbox" value="T1" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="T2" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="T3" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="T4" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="T5" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="T6" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="T7" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="T8" v-model="selectNotes" class="checkbox-round"></td>
                    </tr>
                    <tr>
                        <td class="is-size-4">Y</td>
                        <td><input type="checkbox" value="Y1" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="Y2" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="Y3" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="Y4" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="Y5" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="Y6" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="Y7" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="Y8" v-model="selectNotes" class="checkbox-round"></td>
                    </tr>
                    <tr>
                        <td class="is-size-4">U</td>
                        <td><input type="checkbox" value="U1" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="U2" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="U3" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="U4" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="U5" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="U6" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="U7" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="U8" v-model="selectNotes" class="checkbox-round"></td>
                    </tr>
                    <tr>
                        <td class="is-size-4">I</td>
                        <td><input type="checkbox" value="I1" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="I2" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="I3" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="I4" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="I5" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="I6" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="I7" v-model="selectNotes" class="checkbox-round"></td>
                        <td><input type="checkbox" value="I8" v-model="selectNotes" class="checkbox-round"></td>
                    </tr>
                    
                </tbody>
            </table>
            <div class="result has-text-danger has-text-centered">
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
            <h2>กล่องดนตรีสามารถเล่นได้แล้ว</h2>
            <h4>ยินดีด้วย~ สามารถหยิบการ์ดหมายเลข (87) และทิ้งการ์ด (40) ได้เลย</h4>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            musicboxVisible: true,
            correct: false,
            error: '',
            calCorrect: 0,
            selectNotes: [],
            // val1: '', val2: '', val3: '',val4: '',val5: '',val6: '',val7: '',val8: '',
        }
    },
    methods: {
        checkAnswer() {
            var array = ['Q1','Q2','I3','Y4','R5','E6','E7','W8'];
            var score = 0
            if(this.selectNotes.length == 8){
                for(var i=0;i<this.selectNotes.length;i++) {
                    var result = array.indexOf(this.selectNotes[i])
                    console.log(result)
                    if(result >= 0){
                        score++
                    }
                }
                console.log('score= '+score)
                if(score == 8) {
                    this.musicboxVisible = false
                    this.correct = true
                } else {
                    this.error = 'คำตอบของคุณไม่ถูกต้อง'
                }
            } else {
                this.error = 'คำตอบของคุณไม่ถูกต้อง'
            }
        },
        resetBtn() {
            this.selectNotes = []
        }
    }
}
</script>
