import React, { useState, useEffect } from "react"
import "./fonts.css" // Import the fonts CSS
import FightersList from "./FighterList"
import Header from "./Header"
import LoadMoreButton from "./LoadMoreButton"
import Footer from "./Footer" // Import the Footer component

import "./App.css"

const App = () => {
  const [fightersArray, setFightersArray] = useState([])
  const [filteredFightersArray, setFilteredFightersArray] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleFighters, setVisibleFighters] = useState(20)
  const [activeFilter, setActiveFilter] = useState("All") // Add activeFilter state
  const [searchQuery, setSearchQuery] = useState("") // Add searchQuery state

  const handleScroll = () => {
    const scrollY = window.scrollY
    const footer = document.querySelector(".footer")

    if (scrollY > 0) {
      footer.classList.remove("show")
    } else {
      footer.classList.add("show")
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    handleScroll() // Call handleScroll to set initial footer visibility

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    const fetchFightersData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/fighters")
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data = await response.json()

        const fightersWithImages = data.map(fighter => {
          const img = new Image()
          img.src = fighter.imgSrc
          img.onerror = () => {
            fighter.imgSrc = "/missing_Person.png"
          }
          return fighter
        })

        setFightersArray(fightersWithImages)
        setFilteredFightersArray(fightersWithImages)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching fighters data:", error)
        setLoading(false)
      }
    }

    const checkScrapingStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/isScrapingComplete"
        )
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data = await response.json()
        console.log("Scraping status:", data)
        if (data.isScrapingComplete) {
          fetchFightersData()
        } else {
          setTimeout(checkScrapingStatus, 2000)
        }
      } catch (error) {
        console.error("Error checking scraping status:", error)
        setLoading(false)
      }
    }

    checkScrapingStatus()
  }, [])

  const filterFighters = gender => {
    setActiveFilter(gender) // Update activeFilter state
    if (gender === "All") {
      console.log("Filtering: All Fighters")
      setFilteredFightersArray(fightersArray)
    } else if (gender === "Men") {
      console.log("Filtering: Men Fighters")
      const menFighters = fightersArray.filter(
        fighter => !fighter.weight_Class.includes("Women's")
      )
      setFilteredFightersArray(menFighters)
    } else if (gender === "Women") {
      console.log("Filtering: Women Fighters")
      const womenFighters = fightersArray.filter(fighter =>
        fighter.weight_Class.includes("Women's")
      )
      setFilteredFightersArray(womenFighters)
    }

    // Reset search query when a filter is applied
    setSearchQuery("")
  }

  const searchFighters = query => {
    setSearchQuery(query.toLowerCase()) // Update searchQuery state
    if (query === "") {
      console.log("Clearing Search")
      if (activeFilter === "All") {
        setFilteredFightersArray(fightersArray) // Clear the search
      } else if (activeFilter === "Men") {
        const menFighters = fightersArray.filter(
          fighter => !fighter.weight_Class.includes("Women's")
        )
        setFilteredFightersArray(menFighters)
      } else if (activeFilter === "Women") {
        const womenFighters = fightersArray.filter(fighter =>
          fighter.weight_Class.includes("Women's")
        )
        setFilteredFightersArray(womenFighters)
      }
    } else {
      console.log("Searching for:", query)
      let matchedFighters = []
      const normalizedQuery = query.toLowerCase()

      if (activeFilter === "All") {
        matchedFighters = fightersArray.filter(
          fighter =>
            fighter.name.toLowerCase().includes(normalizedQuery) ||
            fighter.nickname.toLowerCase().includes(normalizedQuery) ||
            fighter.weight_Class.toLowerCase() === normalizedQuery
        )
      } else if (activeFilter === "Men") {
        matchedFighters = fightersArray.filter(
          fighter =>
            !fighter.weight_Class.includes("Women's") &&
            (fighter.name.toLowerCase().includes(normalizedQuery) ||
              fighter.nickname.toLowerCase().includes(normalizedQuery) ||
              fighter.weight_Class.toLowerCase() === normalizedQuery)
        )
      } else if (activeFilter === "Women") {
        matchedFighters = fightersArray.filter(
          fighter =>
            fighter.weight_Class.includes("Women's") &&
            (fighter.name.toLowerCase().includes(normalizedQuery) ||
              fighter.nickname.toLowerCase().includes(normalizedQuery) ||
              fighter.weight_Class.toLowerCase() === normalizedQuery)
        )
      }
      setFilteredFightersArray(matchedFighters)
    }
  }

  const loadMoreFighters = () => {
    setVisibleFighters(prevVisibleFighters => prevVisibleFighters + 20)
  }
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="app">
      <Header
        onFilterChange={filterFighters}
        onSearch={searchFighters}
        fightersArray={fightersArray}
        visibleFighters={visibleFighters}
        filteredFightersArray={filteredFightersArray}
        activeFilter={activeFilter} // Pass activeFilter as a prop
      />
      {console.log("Filtered Fighters Array APPjsx:", filteredFightersArray)}
      <FightersList
        fightersArray={filteredFightersArray.slice(0, visibleFighters)}
        loading={loading}
      />
      {visibleFighters < filteredFightersArray.length && (
        <LoadMoreButton onClick={loadMoreFighters} />
      )}
      <button className="scroll-to-top-button" onClick={scrollToTop}>
        Scroll to Top
      </button>
      <Footer /> {/* Add the Footer component */}
    </div>
  )
}

export default App
