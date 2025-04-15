import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/authentication/Auth'
import Home from './pages/home/Home'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path = "*" element = { <Navigate to = "/auth"/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App