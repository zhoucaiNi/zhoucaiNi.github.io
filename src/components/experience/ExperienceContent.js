import React from "react";
import '../Content.css'

function ExperienceContent(props) {

  return (
    <>
      <div style={{ marginBottom: '2vh'}}>
      <div style={{background: "white", width: "150vh", color:"black", display: "flex",}}> 
      <img style={{width: "100px", height: "100px",  margin: "auto", marginLeft: "10px", marginRight:"10px"}} alt="dartmouth_logo" src={props.experience.url} /> 
      <div style={{display: "inline"}}> 
      <h5 style={{ textAlign: 'center'}}>  {props.experience.company} | {props.experience.position} </h5>
      <p> {props.experience.time} </p>
      <ul>
        <li> {props.experience.description} </li>
      </ul>
      </div>
      </div>
      </div>
    </>
  )
}

export default ExperienceContent;