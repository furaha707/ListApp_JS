import { createRouter } from '../core/core.js'
import List from './List.js'
import Login from './Login.js'
import Regis from './Regis.js'
import ProfileDetail from './Detail.js'
import NotFound from './NotFound.js'

// 순차적으로 일치하는 것이 반환됨
export default createRouter([
  { path:'#/', component: List },
  { path:'#/login', component: Login },
  { path:'#/regis', component: Regis },
  { path:'#/detail', component: ProfileDetail },
  { path:'.*', component: NotFound }
])