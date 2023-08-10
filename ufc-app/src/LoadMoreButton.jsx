import React from "react"

const LoadMoreButton = ({ onClick }) => {
  return (
    <button className="load-more-button" onClick={onClick}>
      Load More Fighters
    </button>
  )
}

export default LoadMoreButton
