import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../admin/login'
// import Home from '../admin/home/home'
// import User from '../admin/user/user'
// import Rights from '../admin/rights/rights'
// import Roles from '../admin/rights/roles'
// import Goods from '../admin/products/Goods'
// import Add from '../admin/products/Add'
// import Categories from '../admin/products/categories'

const Login = () => import(/* webpackChunkName: 'index' */ '../admin/login')
const Home = () => import(/* webpackChunkName: 'index' */ '../admin/home/home')
const User = () => import(/* webpackChunkName: 'index' */ '../admin/user/user')
const Rights = () => import(/* webpackChunkName: 'index' */ '../admin/rights/rights')
const Roles = () => import(/* webpackChunkName: 'index' */ '../admin/rights/roles')
const Goods = () => import(/* webpackChunkName: 'index' */ '../admin/products/Goods')
const Add = () => (/* webpackChunkName: 'index' */ '../admin/products/Add')
const Categories = () => import(/* webpackChunkName: 'index' */ '../admin/products/categories')


Vue.use(VueRouter)



const router = new VueRouter({
  routes: [
    { path: '/', redirect: 'index' },
    { path: '/login', component: Login, name: 'login' },
    {
      path: '/index', component: Home, name: 'index', children: [
        { path: '/users', component: User, name: 'user' },
        { path: '/rights', component: Rights, name: 'rights' },
        { path: '/roles', component: Roles, name: 'roles' },
        { path: '/goods', component: Goods, name: 'goods' },
        { path: '/goods-add', component: Add, name: 'goods-add' },
        { path: '/categories', component: Categories, name: 'categories' }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 路由拦截
  // from从哪里来
  // to到哪去
  // next() 放行
  // console.log(to, from)
  // 只要不是去 Login 登录页 就判断是否带有token
  // 先拿到 token 
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

// 默认导出路由
export default router
