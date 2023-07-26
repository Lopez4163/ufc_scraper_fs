import React from "react"

const FighterCard = ({ fighter }) => {
  return (
    <div className="fighter-card">
      <img src={fighter.imgSrc} alt={fighter.name} />
      <div className="fighter-info">
        <h2>{fighter.nick_Name}</h2>
        <p>Name: {fighter.name}</p>
        <p>Weight Class: {fighter.weight_Class}</p>
        <p>Record: {fighter.record}</p>
      </div>
    </div>
  )
}

export default FighterCard
