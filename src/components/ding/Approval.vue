<template>
    <div class="approval">
        <mt-header :title="$route.name">
            <router-link to="/" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div class="rovalshow">
            <p @click="toChoose('apply')">报销类型 <b>*</b><span>{{applyType}} ></span></p>
                <mt-popup v-model="popupVisibles" position="bottom" popup-transition="popup-fade">
                    <mt-picker :slots="slots" ref="picker" :show-toolbar='true' >
                        <mt-button @click="handleConfirm(0,'apply')" class="button">取消</mt-button>
                        <mt-button @click="handleConfirm(1,'apply')" class="sure button">确认</mt-button>
                    </mt-picker>
                </mt-popup>
            <mt-field label="报销事由" placeholder="请输入" v-model="username"></mt-field>
            <p class="line"></p>
            <p @click="toChoose('cost')">费用类型 <b>*</b><span>{{costType}} ></span></p>
                <mt-popup v-model="popupVisible" position="bottom" popup-transition="popup-fade">
                    <mt-picker :slots="costslots" ref="picker1" :show-toolbar='true' >
                        <mt-button @click="handleConfirm(0,'cost')" class="button">取消</mt-button>
                        <mt-button @click="handleConfirm(1,'cost')" class="sure button">确认</mt-button>
                    </mt-picker>
                </mt-popup>
            <mt-field label="发生时间 *" placeholder="请选择 >" type="date"  v-model="times">
            </mt-field>
            <mt-field label="费用金额 *" placeholder="请输入" type="number" v-model="inputVal">
            </mt-field>
            <div class="openWrite"><span>大写</span>{{inputVal | toChies}}</div>
            <mt-field label="费用说明" placeholder="请输入" type="textarea" rows="4"  v-model="username"></mt-field>
            <p>附件</p>
            <van-field name="uploader">
            <template #input>
                <van-uploader v-model="uploader" />
            </template>
            </van-field>
        </div>
        <div class="approver">
            <p>审批人<b>*</b></p>
            <div class="chooseContact">
                <van-icon name="plus" size='30' color='#ccc'/>
            </div>
        </div>
        <div class="copyover">
            <p>抄送人</p>
            <div class="chooseContact">
                <van-icon name="plus" size='30' color='#ccc'/>
            </div>
        </div>  
        <van-button type="primary" block class="submit" color='#26a2ff' @click="submit" >提交</van-button> 
    </div>
</template>

<script>
    import { Header, Field, Picker, Popup, Button} from 'mint-ui'
    import { Uploader,Toast } from 'vant';
    export default {
        name: 'Approval',
        data() {
            return {
                slots: [
                    {
                        flex: 1,
                        values: ['差旅费', '交通费', '招待费', '其他'],
                        textAlign: 'center',
                        className: 'slot1', 
                        defaultIndex: 0
                    }, 
                ],
                costslots: [
                    {
                        flex: 1,
                        values: ['飞机票', '火车票', '的士费', '餐饮费', '住宿费', '礼品费', '活动费', '通讯费', '补助费', '其他'],
                        textAlign: 'center',
                        className: 'slot2', 
                        defaultIndex: 0
                    }, 
                ],
                popupVisible: false,
                popupVisibles:false,
                applyType: '',
                costType: '请选择',
                inputVal: '',
                time: ''
            }
        },
        components: {
            Header,
            Field,
            Picker,
            Popup,
            Button,
            Toast
        },
        mounted() {
            this.applyType = this.slots[0].values[0]
        },
        methods: {
            toChoose(val) {
                val=='apply'?this.popupVisibles = !this.popupVisibles:this.popupVisible = !this.popupVisible
                
            },
            handleConfirm(val,type) {
                type=='apply'?this.popupVisibles = false:this.popupVisible = false
                if(val){
                    this.applyType = this.$refs.picker.getValues()[0]
                    this.costType = this.$refs.picker1.getValues()[0]
                }
                
            },
            submit() {
                console.log('dianj',this.times)
                if(this.applyType=='请选择'){

                    Toast('报销类型不能为空');
                    return 
                }
                if(this.costType=='请选择'){
                    console.log('dianj')
                    Toast.fail('费用类型不能为空');
                    return 
                }
                if(this.times==undefined){
                    Toast.fail('发生时间不能为空');
                    return 
                }
                if(this.inputVal==''){
                    Toast.fail('费用金额不能为空');
                    return 
                }
            }
        },
        filters:{
            toChies:function(value){
                console.log(value,'value')
                if(value == ''){
                   value= '.'
                }
                var values = value.split('.')[0]
                var Dvalues = value.split('.')[1]||''
                let len=values.length
                let Dlen=Dvalues.length
                let arr=[];
                let Darr=[];
                let chin_list=['零','壹','贰','叁','肆','伍','陆','柒','捌','玖']
                
                let chin_lisp=['仟','佰','拾','亿','仟','佰','拾','万','仟','佰','拾']
                
                for(let i=0;i<len;i++){
                    arr.push(parseInt(values[i]));		
                    arr[i]=chin_list[arr[i]]
                }
                if(Dlen>0){
                    for(let i=0;i<Dlen;i++){
                        Darr.push(parseInt(Dvalues[i]));		
                        Darr[i]=chin_list[Darr[i]]
                    }
                    Dlen==1?Darr[0]= Darr[0]+'角':Darr[0]= Darr[0]+'角';Darr[1]= Darr[1]+'分'
                }
                if(Dlen>2){
                    Toast('金额输入不合法');
                    return 
                }
                for(let i=len-1,j=1;i>0;i--){
                    arr.splice(i,0,chin_lisp[chin_lisp.length-j++])	//j=2
                }
                
                
                arr=arr.join('')
                if(len>=1){
                    arr+='元'
                }
               arr+=Darr.join('')
                return arr
            }
        },
        watch:{
            inputVal(newVal,oldVal){
                if(newVal == ''){
                    Toast('金额输入不合法');
                    return 
                }
                console.log(newVal,oldVal)
                if(newVal.length==13){
                    this.inputVal=oldVal
                }
            }
        },
	
    }
</script>

<style lang="scss" scoped>
.approval{
    width: 100%;
    height: 100%;
    .rovalshow, .approver, .copyover{
        box-shadow: 0px 0px 0px 1px #d9d9d9;
        p{
            background-color: #fff;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            color: inherit;
            height: 48px;
            display: block;
            overflow: hidden;
            position: relative;
            text-decoration: none;
            font-size: 16px;
            line-height: 48px;
            padding: 0 10px;
            span{
                float: right;
                color: #646464;
            }
        }
        .line{
            height: 1px;
            background: #d9d9d9;
            margin-left: 10px;
        }
        .button{
            border: none;
            background: transparent;
            font-size: 14px;
            box-shadow:0 0 0 0;
            width: 20%;
        }
        .sure{
            margin-left: 60%;
            color: #628FF8;
        }
        .openWrite{
            background: #fff;
            height: 36px;
            line-height: 36px;
            padding: 0 10px;
            text-align: right;
            span{
                float: left;
            }
        }
    }
    .approver, .copyover{
        margin-top: 20px;
        background: #fff;
        .chooseContact{
            width: 60px;
            height: 60px;
            text-align: center;
            line-height: 80px;
            display: inline-block;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin: 0 0 10px 10px;
        }
    }
    .submit{
        margin-top: 10px;
    }
}

.mint-popup-bottom{
    width: 100%;
}
.mint-button::after{
    background: #fff;
}
</style>
<style>
.mint-field-core{
    text-align: right;
}
</style>