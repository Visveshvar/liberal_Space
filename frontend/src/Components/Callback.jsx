import { useContext, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../Contexts/AuthContext"
import axios from "axios"

const Callback = () => {
    const called = useRef(false)
    const { checkLoginState, loggedIn } = useContext(AuthContext)
    const navigate = useNavigate();
    useEffect(() => {
      ;(async () => {
        if (loggedIn === false) {
          try {
            if (called.current) return // prevent rerender caused by StrictMode
            called.current = true
            const res = await axios.get(`http://localhost:3001/auth/token${window.location.search}`)
            console.log('response: ', res)
            checkLoginState()
            navigate('/home')
          } catch (err) {
            console.error(err)
            navigate('/')
          }
        } else if (loggedIn === true) {
          navigate('/')
        }
      })()
    }, [checkLoginState, loggedIn, navigate])
    return <></>
  }
  export default Callback