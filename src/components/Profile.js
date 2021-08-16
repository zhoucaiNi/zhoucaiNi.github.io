import React from "react";
import profile from "../images/profile.png"
import "./Content.css"

function Profile() {

  return (
    <>
     <div style={{display: "flex"}} className="profile">
      <img src={profile} className="profilePic" alt="profile-pic" />
      <div style={{display: "inline"}} className="profileText" >
      <ul> 
      <h1> Zhoucai Ni</h1>
      <li> Cape Coral, Fl & Hanover, NH</li>
      <li> Second Year at Dartmouth College</li>
      <li> nizhoucai@gmail.com</li>
      <li> 646-346-9413</li>
      </ul>
      </div>
      </div>
    </>
  )
}

export default Profile;