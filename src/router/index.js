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
    { path: '/', redirect: 'login' },
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

// 默认导出路由
export default router
