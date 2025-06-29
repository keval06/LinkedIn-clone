import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import SignUp from './pages/Signup'
import Login from './pages/Login'
import { userDataContext } from './context/userContext'
import Network from './pages/Network'
import Profile from './pages/Profile'
import Notification from './pages/Notification'

function App() {
  let {userData} = useContext(userDataContext);
  
  return (
    <Routes>
      {/* Routes to all route */}
      {/*Protected Route: If user is logged in, show Home page, else redirect to login */}
      // If user is logged in, show Home page, else redirect to login
      <Route path='/' element={userData? <Home/> : <Navigate to="/login"/>}/>
      <Route path='/signup' element={userData ? <Navigate to="/"/> : <SignUp/>}/>
      <Route path='/login' element={userData ? <Navigate to="/"/> : <Login/> } />
      <Route path='/network' element={userData? <Network/>: <Navigate to="/login"/>}/>
      <Route path='/profile/:userName' element={userData? <Profile/>: <Navigate to="/login"/>}/>
      <Route path='/notification' element={userData? <Notification/>: <Navigate to="/login"/>}/>

    </Routes>
  )
}

export default App;
