import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/authentication/Auth'
import Home from './pages/home/Home'
import { useAppStore } from './store/index.js'
import { useEffect, useState } from 'react'
import { apiClient } from './lib/api_client.js'
import { GET_USER_INFO } from './utils/constants.js'

const PrivateRoute = ({children}) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth"/>;
}

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  // If the user is authenticated, redirect to the Chat page, otherwise, render the children (Auth page)
  return isAuthenticated ? <Navigate to="/home" />: children;
}


const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(
          GET_USER_INFO,
          { withCredentials: true },
        );

        if (response.status === 200 && response.data) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    }
    
    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return (
      <div style={{
        backgroundColor: 'var(--primary-bg)',
        color: 'var(--text-primary)',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
        <div className="loader" />
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading, please wait...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthRoute><Auth/></AuthRoute>}/>
        <Route path='/home' element={<PrivateRoute><Home/></PrivateRoute>}/>
        <Route path = "*" element = { <Navigate to = "/auth"/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App