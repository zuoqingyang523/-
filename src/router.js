import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
const canvasSign = r => require.ensure([], () => r(require('./components/canvasSign.vue')), 'Login')
const Register = r => require.ensure([], () => r(require('./components/register.vue')), 'Register')
const SignList = r => require.ensure([], () => r(require('./components/sign/SignList.vue')), 'SignList')
const detail = r => require.ensure([], () => r(require('./components/sign/detail.vue')), 'SignList')
let router = new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      redirect: '/addApply',
    },
    {
      path: '/addApply',
      component: Register,
    },
    {
      path: '/canvasSign',
      component: canvasSign,
    },
    {
      path: "/signList",
      component: SignList
    },
    {
      path: "/detail",
      component: detail
    },
    
  ]
})


export default router;