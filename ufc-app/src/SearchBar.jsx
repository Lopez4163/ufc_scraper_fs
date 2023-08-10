import React, { useState, useEffect } from "react"
import "./SearchBar.css"

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchError, setSearchError] = useState(false)
  const [shake, setShake] = useState(false) // New state for shake effect

  const handleSearchChange = event => {
    setSearchQuery(event.target.value)
    setSearchError(false)
  }

  const handleSearchSubmit = () => {
    const query = searchQuery.toLowerCase()

    if (query === "") {
      setSearchError(true)
      setShake(true) // Trigger the shake effect
      setTimeout(() => setShake(false), 300) // Remove the shake class after a delay
      return
    }

    onSearch(query)
    setSearchError(false)
  }

  useEffect(() => {
    if (searchError) {
      setShake(true) // Trigger the shake effect
      setTimeout(() => setShake(false), 300) // Remove the shake class after a delay
    }
  }, [searchError])

  return (
    <div className={`search-bar ${shake ? "shake" : ""}`}>
      <input
        type="text"
        placeholder="Search..."
        className="search-input"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <button className="search-button" onClick={handleSearchSubmit}>
        Search
      </button>
    </div>
  )
}

export default SearchBar
