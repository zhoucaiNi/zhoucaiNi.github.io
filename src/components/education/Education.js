import React from 'react';
import "../Content.css"
import Profile from '../Profile';
import EducationContent from './EducationContent';

import {educations} from './Educations'

function Education() {

  return (
    <>
    <div id="rightContent">
      <Profile />
      <h1> Education </h1>
      <div style={{background: "white", width: "150vh", color:"black", display: "flex",}}> 
      <img style={{width: "100px", height: "100px",  margin: "auto", marginLeft: "10px", marginRight:"10px"}} alt="dartmouth_logo" src="https://tinyurl.com/9w4j6jce" /> 
      <div style={{display: "inline"}}> 
      <h5 style={{ textAlign: 'center'}}>  Dartmouth College </h5>
      <ul>
        <li> Currently Pursuing a B.A. at Dartmouth College</li>
        <li> Computer Science modified with Engineering </li>
        <li> 2020 - 2024</li>
      </ul>
      </div>
      </div>
  
  <h1> Classes Taken </h1>
    
    {educations.map((education) => {
        return (
          <>
            <EducationContent education={education} />
          </>
        )
      })}
      </div>
    </>
  )

}

export default Education;