import React, { useEffect, useState } from "react"
import FighterCard from "./FighterCard"

const FightersList = () => {
  const [fightersArray, setFightersArray] = useState([])
  const [loading, setLoading] = useState(true) // Add loading state

  useEffect(() => {
    // Fetch the fighters data from the API endpoint
    fetch("/api/fighters")
      .then(response => response.json())
      .then(data => {
        setFightersArray(data)
        setLoading(false) // Set loading to false when data is available
      })

      .catch(error => {
        console.error("Error fetching fighters data:", error)
        setLoading(false) // Set loading to false on error as well
      })
  }, [])

  if (loading) {
    return <div>Loading...</div> // Display a loading message or spinner
  }

  return (
    <div className="fighters-list">
      {fightersArray.map((fighter, index) => (
        <FighterCard key={index} fighter={fighter} />
      ))}
    </div>
  )
}

export default FightersList
