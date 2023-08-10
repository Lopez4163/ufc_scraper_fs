import React from "react"
import "./Footer.css" // Import the CSS file for styling
import instagram from "./assets/instagram.png"
import github from "./assets/github.png"

const Footer = () => {
  return (
    <footer className="footer">
      <h4>
        &copy; {new Date().getFullYear()} Stolen UFC Data. All rights reserved
        to no one, programmer does what he wants!
      </h4>
      <div>
        <a
          href="https://www.instagram.com/nickk_adre/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={instagram} alt="Instagram" className="footer-ig" />
        </a>
        <a
          href="https://github.com/Lopez4163"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={github} alt="GitHub" className="footer-git" />
        </a>
      </div>
    </footer>
  )
}

export default Footer
