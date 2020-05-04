import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
const canvasSign = r => require.ensure([], () => r(require('./components/canvasSign.vue')), 'Login')
const ApprovalRegister = r => require.ensure([], () => r(require('./components/register.vue')), 'Register')
const SignList = r => require.ensure([], () => r(require('./components/sign/SignList.vue')), 'SignList')
const detail = r => require.ensure([], () => r(require('./components/sign/detail.vue')), 'SignList')
const Approval = r => require.ensure([], () => r(require('./components/ding/Approval.vue')), 'Approval')
const ApprovalDetails = r => require.ensure([], () => r(require('./components/ding/ApprovalDetails.vue')), 'Approval')
let router = new Router({
  mode: "history",
  base:'/write',
  routes: [
    {
      path: '/',
      redirect: '/Approval',
    },
    {
      path: '/Approval',
      name: '报销',
      component: Approval,
    },
    {
      path: '/ApprovalDetails',
      name: '报销详情',
      component: ApprovalDetails,
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