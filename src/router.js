import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
const Login = r => require.ensure([], () => r(require('./components/login.vue')), 'Login')
const canvasSign = r => require.ensure([], () => r(require('./components/canvasSign.vue')), 'Login')
const LoginCode = r => require.ensure([], () => r(require('./components/loginElse.vue')), 'LoginCode')
const Home = r => require.ensure([], () => r(require('./components/home.vue')), 'Home')


const Authentication = r => require.ensure([], () => r(require('./components/authentication.vue')), 'Authentication')
const Signature = r => require.ensure([], () => r(require('./components/signature.vue')), 'Signature')
const WriteSign = r => require.ensure([], () => r(require('./components/writeSign.vue')), 'WriteSign')


const Record = r => require.ensure([], () => r(require('./components/contract/record.vue')), 'Record')
const Contract = r => require.ensure([], () => r(require('./components/contract/contract.vue')), 'Contract')
const ContractDetils = r => require.ensure([], () => r(require('./components/contract/contractDetils.vue')), 'ContractDetils')
const Pay = r => require.ensure([], () => r(require('./components/contract/pay.vue')), 'Pay')

const Register = r => require.ensure([], () => r(require('./components/register.vue')), 'Register')
const ServiceAgreement = r => require.ensure([], () => r(require('./components/register/serviceAgreement.vue')), 'ServiceAgreement')
const PrivacyStatement = r => require.ensure([], () => r(require('./components/register/privacyStatement.vue')), 'privacyStatement')

const HelloWorld = r => require.ensure([], () => r(require('./components/HelloWorld.vue')), 'helloWorld')
const Qia = r => require.ensure([], () => r(require('./components/Qia.vue')), 'Qia')
const SignList = r => require.ensure([], () => r(require('./components/sign/SignList.vue')), 'SignList')
const sign = r => require.ensure([], () => r(require('./components/sign/sign.vue')), 'sign')
const signDetail = r => require.ensure([], () => r(require('./components/sign/detail.vue')), 'detail')
const signComplete = r => require.ensure([], () => r(require('./components/sign/signComplete.vue')), 'signComplete')
const signResult = r => require.ensure([], () => r(require('./components/sign/signResult.vue')), 'signResult')

let router = new Router({
  mode: "history",
  base: '/m',
  routes: [{
      path: "/world",
      component: HelloWorld //demo用，暂时别删
    },
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/canvasSign',
      component: canvasSign,
    },
    {
      path: '/home',
      component: Home,
    },
    {
      path: '/celeritylogin',
      component: LoginCode
    },
    {
      path: '/authentication',
      component: Authentication
    },
    {
      path: '/signature',
      component: Signature
    },
    {
      path: '/writeSign',
      component: WriteSign
    },
    {
      path: '/record',
      component: Record
    },
    {
      path: '/contract',
      component: Contract
    },
    {
      path: '/contractDetils',
      component: ContractDetils
    },
    {
      path: '/contractDetils/pay',
      component: Pay
    },
    {
      path: '/register',
      component: Register,
    },
    {
      path: '/register/serviceAgreement',
      component: ServiceAgreement
    },
    {
      path: '/register/privacyStatement',
      component: PrivacyStatement
    },
    {
      path: "/qia",
      component: Qia //demo用，暂时别删
    },
    {
      path: "/signList",
      component: SignList
    },
    {
      path: "/sign",
      component: sign
    },
    {
      path: "/signDetail",
      component: signDetail
    },
    {
      path: "/signComplete",
      component: signComplete
    },
    {
      path: "/signResult",
      component: signResult
    },
  ]
})
// 拦截所有前端请求
router.beforeEach((to, from, next) => {
  // console.log("to:", to);
  // console.log("from:", from);
  next()
})

export default router;