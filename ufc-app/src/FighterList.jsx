import React from "react"
import "./fighters.css"

const FightersList = ({ fightersArray, loading }) => {
  if (loading) {
    return <div>Loading...</div>
  }

  const handleImageError = event => {
    event.target.src = "/missing_Person.png"
    event.target.classList.add("missing-person-img")
  }

  return (
    <div className="fighters-list">
      {fightersArray.map((fighter, index) => (
        <div key={index} className="fighter-card">
          <img
            src={fighter.imgSrc}
            alt={fighter.name}
            onError={handleImageError}
            className="fighter-img"
          />

          <div className="fighter-info">
            <h2 className="fighter-info-nickname">{fighter.nickname}</h2>
            <h2 className="fighter-info-name">{fighter.name}</h2>
            <p>{fighter.weight_Class}</p>
            <p>{fighter.record}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FightersList
