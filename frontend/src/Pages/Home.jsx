import { useContext } from "react"
import { AuthContext } from "../Contexts/AuthContext"
import HomeSidebar from "../Components/HomeSidebar"
import MainHomeScreen from "../Components/HomeMainScreen"
const Home = () => {
    const { loggedIn } = useContext(AuthContext)
    return (
      <>
        {loggedIn?(
          <div className="home-screen">
            <HomeSidebar/>
            <MainHomeScreen/>
          </div>
        ):(
          <>
            <h1>There is some issues in your login</h1>
          </>
        )}
      </>
    )
  }

  export default Home