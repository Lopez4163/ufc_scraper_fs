import React, { useState } from "react"
import FilterButtons from "./FilterButtons"
import SearchBar from "./SearchBar" // Import the SearchBar component
import "./Header.css"
import viteLogo from "./assets/vite-logo.png"
import reactIcon from "./assets/react-icon.png"
import puppeteerLogo from "./assets/puppeteer-logo.png"
import bannerImage from "./assets/banner.png" // Import the banner image

const Header = ({
  onFilterChange,
  onSearch,
  fightersArray,
  visibleFighters,
  activeFilter,
}) => {
  const [searchError, setSearchError] = useState(false)

  return (
    <div className="header">
      <div className="logo-container">
        <img src="/ufc_logo.png" alt="UFC Logo" className="logo" />
        <p className="logo-text">All Active UFC Fighters Provided By UFC.com</p>
      </div>
      <div className="advertisement">
        <iframe
          src="https://giphy.com/embed/qrr9p5kGVbEeq9Dmcq"
          width="417"
          height="480"
          frameBorder="0"
          className="giphy-embed"
          allowFullScreen
          title="Advertisement"
        ></iframe>
      </div>
      <div className="hasby-gif">
        <iframe
          src="https://giphy.com/embed/jubDrsFvvQFBclLLhI"
          width="100"
          height="100"
          frameBorder="0"
          className="giphy-embed"
          allowFullScreen
          title="Hasby Gif"
        ></iframe>
      </div>
      <div className="banner">
        <img src={bannerImage} alt="Banner" className="banner-image" />
      </div>
      <div className="powered-by">
        <p>Powered By:</p>
        <img src={viteLogo} alt="Vite Logo" className="powered-by-logo" />
        <img src={reactIcon} alt="React Icon" className="powered-by-logo" />
        <img
          src={puppeteerLogo}
          alt="Puppeteer Logo"
          className="powered-by-logo"
        />
      </div>
      <SearchBar
        onSearch={onSearch}
        fightersArray={fightersArray}
        visibleFighters={visibleFighters}
      />
      {searchError && (
        <p className="search-error">
          No fighters match your search. Please try again.
        </p>
      )}
      <FilterButtons
        onFilterChange={onFilterChange}
        activeFilter={activeFilter}
      />
    </div>
  )
}

export default Header
