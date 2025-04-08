import React, { useState } from 'react'
import axios from "axios"
const MainHomeScreen = () => {
  const handleCreateSpace = async () => {
    const userInput = prompt("Enter a name for your new space:");
    if (!userInput) return;

    try {
      const res = await axios.post(
        'http://localhost:3001/space/createSpaces',
        { spaceName: userInput },
        { withCredentials: true }
      );

      alert(`Space created! Code: ${res.data.space.code}`);
      // optionally redirect or update state
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create space.");
    }
  };
  return (
    <div className="main-home-screen">
      <h1>Welcome to Liberal Space</h1>
      <div>
        <button className='btn btn-light' onClick={handleCreateSpace}>Create Space</button>
        <button className='btn btn-primary'>Join Space</button>
      </div>
    </div>
  )
}

export default MainHomeScreen
