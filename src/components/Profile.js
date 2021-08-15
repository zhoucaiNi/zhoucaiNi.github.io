import React from "react";
import profile from "../images/profile.JPG"

function Profile() {

  return (
    <>
     <div style={{ display: 'flex' }}>
      <img src={profile} className="profile" alt="profile-pic" />
      <div style={{ display: 'inline' }} >
      <h1> Zhoucai Ni</h1>
      <p> Coding in Cape Coral, Fl and Hanover, NH</p>
      </div>
      </div>
    </>
  )
}

export default Profile;