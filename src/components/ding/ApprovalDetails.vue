<template>
    <div class="ApprovalDetails">
        <mt-header :title="$route.name">
            <router-link to="/" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div class="details">
            <div class="apprpvalTheme">
                <img src="../../assets/images/alipay_icon.png" alt="">
                <div class="theme">{{}}的报销 <span>审批中</span> </div>
            </div>
            <div class="point"><span>审批单号</span><p>202005040001</p></div>
            <div class="point"><span>提交时间</span><p>2020/05/04 22:04</p></div>
            <div class="point"><span>报销类型</span><p>差旅费</p></div>
            <div class="point"><span>报销事由</span><p>事情比较急也比较多少我现在看看应该咋么办进行我也不知道该咋的弄要不要把它进行隐藏一下看看可以不行</p></div>
        </div>
        <div class="regard">
            <div class="point part"><span>报销明细</span><p></p></div>
            <div class="point"><span>费用类型</span><p></p></div>
            <div class="point"><span>发生时间</span><p></p></div>
            <div class="point"><span>费用金额</span><p></p></div>
            <div class="point"><span>费用说明</span><p></p></div>
            <div class="point">
                <span>附件</span>
                <div class='annex'>
                    <img src="../../assets/images/scancode02_img.png" alt="">
                    <img src="../../assets/images/alipay_icon.png" alt="">
                    <img src="../../assets/images/alipay_icon.png" alt="">
                    <img src="../../assets/images/alipay_icon.png" alt="">
                    <img src="../../assets/images/alipay_icon.png" alt="">
                    <img src="../../assets/images/alipay_icon.png" alt="">
                    <img src="../../assets/images/alipay_icon.png" alt="">
                    <img src="../../assets/images/alipay_icon.png" alt="">
                </div>
            </div>
        </div>
        <div class="responsible">
            <h3>审批流程</h3>
            <div class="modified">
                <img src="../../assets/images/writ_icon.png" alt="">
                <p>{{}} 审批中</p>
            </div>
            <van-field
                class="opinion"
                v-model="opinion"
                placeholder="审批意见"
            />
            <div class="signature">签名</div>
            <div class="button">
                <p><van-icon name="success" size="18" />同意</p>
                <p><van-icon name="cross" size="18"/>驳回</p>
            </div>
        </div>
    </div>
</template>

<script>
    import { Header } from 'mint-ui'
    import { Form } from 'vant'
    export default {
        name: 'ApprovalDetails',
        data() {
            return {
            }
        },
    }
</script>

<style lang="scss" scoped>
.ApprovalDetails{
    width: 100%;
    height: 100%;
    .details, .regard{
        width: 100%;
        box-sizing: border-box;
        padding: 10px;
        background: #fff;
        overflow: hidden;
        .apprpvalTheme{
            width: 100%;
            height: 60px;
            line-height: 60px;
            padding-bottom: 10px;
            img{
                width: 60px;
                height: 60px;
                border-radius: 5px;
                display: inline-block;
                vertical-align: middle;
                margin-right: 15px;
            }
            .theme{
                display: inline-block;
                font-size: 18px;
                color: #000;
                span{
                    font-size: 12px;
                    padding: 0 4px;
                    margin-left: 5px;
                    border-radius: 4px;
                    border: 1px solid #628FF8;
                    color: #628FF8;
                }
            }
        }
    }
    .regard{
        overflow: hidden;
        border-bottom: 1px solid #ccc;
        .part{
            border-top: 1px solid #ccc;
            font-size: 16px;
            height: 28px;
            line-height: 28px;
            padding-top: 6px;
            span{
                letter-spacing:1px;
                color: #000;
            }
        }
    }
    .point{
        font-size: 16px;
        height: 28px;
        line-height: 28px;
        letter-spacing:1px;
        span{
            display: inline-block;
            color: #999;
            text-align: right;
            width: 80px;
            font-weight: 300;
            float: left;
        }
        p{
            display: inline-block;
            text-align: left;
            margin-left: 12px;
            width: calc(100% - 104px);
            float: left;
        }
        .annex{
            margin-left: 12px;
            width: calc(100% - 104px);
            float: left;
            flex-wrap: wrap;
            justify-content: space-between;
            img{
                width: 60px;
                height: 60px;
                border-radius: 5px;
            }
        }
    }
    .responsible{
        width: 100%;
        margin: 15px 0 0 0;
        border-top: 1px solid #ccc;
        background: #fff;
        h3{
            width: 80px;
            text-align: right;
            font-size: 16px;
            height: 42px;
            line-height: 42px;
            letter-spacing:1px;
        }
        .modified{
            height: 30px;
            line-height: 30px;
            img{
                width: 30px;
                height: 30px;
                border-radius: 5px;
                margin-left: 20px;
                display: inline-block;
                vertical-align: middle;
            }
            p{
                display: inline-block;
                font-size: 14px;
                margin-left: 12px;
            }
        }
        .opinion{
            background: #f3f3f3;
            width: 90%;
            margin: 10px auto;
            border-radius: 5px;
            font-size: 14px;
        }
        .signature{
            color: #628FF8;
            margin: 0 10px;
            letter-spacing:1px;
            font-size: 14px;
            text-align: right;
            padding-right: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #ccc;

        }
        .button{
            display: flex;
            p{
                flex: 1;
                font-size: 16px;
                letter-spacing:1px;
                text-align: center;
                height: 46px;
                line-height: 46px;
                vertical-align: middle;
                .van-icon{
                    vertical-align: sub;
                }
            }
        }
    }
}
</style>