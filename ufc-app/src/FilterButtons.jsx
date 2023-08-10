import React from "react"

const FilterButtons = ({ onFilterChange, activeFilter }) => {
  return (
    <div className="filter-buttons">
      <button
        className={`filter-button ${activeFilter === "All" ? "active" : ""}`}
        onClick={() => onFilterChange("All")}
      >
        All
      </button>
      <button
        className={`filter-button ${activeFilter === "Men" ? "active" : ""}`}
        onClick={() => onFilterChange("Men")}
      >
        Men
      </button>
      <button
        className={`filter-button ${activeFilter === "Women" ? "active" : ""}`}
        onClick={() => onFilterChange("Women")}
      >
        Women
      </button>
    </div>
  )
}

export default FilterButtons
