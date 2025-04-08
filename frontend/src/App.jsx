import './App.css'
import WhiteBoardPage from './Pages/WhiteBoardPage'
import { BrowserRouter,Router,Route, Routes } from 'react-router-dom'
import axios from 'axios'
import { AuthContextProvider } from './Contexts/AuthContext'
import Home from './Pages/Home'
import Callback from './Components/Callback'
import LaunchingPage from './Pages/LaunchingPage'


// Ensures cookie is sent
axios.defaults.withCredentials = true

// Define router here
// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Home/>,
//   },
//   {
//     path: '/auth/callback', // Google redirects here after login
//     element: <Callback />,
//   },
// ])

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<LaunchingPage/>}></Route>
            <Route path='/auth/callback' element={<Callback/>}></Route>
            <Route path='/home' element={<Home/>}></Route>
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  )
}

export default App
