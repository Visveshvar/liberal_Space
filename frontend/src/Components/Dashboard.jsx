import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../Contexts/AuthContext"
import axios from "axios"

export const Dashboard = () => {
  const { user, loggedIn, checkLoginState } = useContext(AuthContext)

  const handleLogout = async () => {
    try {
      await axios.post(`http://localhost:3001/auth/logout`)
      checkLoginState()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      {loggedIn ? (
        <>
          <h3>Dashboard</h3>
          <button className="btn" onClick={handleLogout}>Logout</button>
          <h4>{user?.name}</h4>
          <p>{user?.email}</p>
          <img src={user?.profilePic} alt={user?.name} />
        </>
      ) : (
        <h1>Not logged in</h1>
      )}

    </>
  )
}
export default Dashboard