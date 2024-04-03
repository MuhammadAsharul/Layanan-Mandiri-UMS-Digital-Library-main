import { useState } from 'react'
import './App.css'


import { 
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import Login from './pages/Login'
import Index from './pages/Index'
import LoginAdmin from './pages/LoginAdmin'
import DashboardUser from './pages/DashboardUser'
import DashboardAdmin from './pages/DashboardAdmin'
import DropboxBuku from './pages/DropboxBuku'
import { loginIndex } from './features/loginSlices'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from './utils/cookies'

function App() {
  const [count, setCount] = useState(0)
  const state = useSelector(state => state.login.users)
  const token = localStorage.getItem('token') !== null;
  const cookies = Cookies.getCookies('CERT')
  console.log("state app",state)
  console.log("token app",token)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          token ? <Navigate to="/index" /> : <Login />
        } />

        <Route path="/index" element={token ? 
          <Index /> : <Navigate to="/" />  
        } />

        <Route path="/dashboard/user" element={cookies ?
          <DashboardUser /> : <Navigate to="/index"/>
        } />

        <Route path="/index/dropbox" element={
          <DropboxBuku /> 
        } />

        <Route path="/dashboard/admin" element={
          <DashboardAdmin /> 
        } />

        <Route path="/admin" element={
          <LoginAdmin />
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
