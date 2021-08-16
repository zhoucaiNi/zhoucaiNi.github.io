import React from "react";
import Button from "react-bootstrap/Button";

function ProjectContent(props) {

  return (
    <>
      <div style={{marginBottom: '2vh'}}>

      <div style={{background: "white", width: "150vh", color:"black", display: "flex",paddingBottom: '2vh'}}> 
      <img style={{width: "100px", height: "100px",  margin: "auto", marginLeft: "10px", marginRight:"10px"}} alt="dartmouth_logo" src="https://tinyurl.com/vknced8c" /> 
      <div style={{display: "inline"}}> 
      <h5 style={{ textAlign: 'center'}}>  {props.project.title}  </h5>
      <p> {props.project.description} </p>
      <a target="_blank" rel="noreferrer noopener" href={props.project.link}>
        <Button variant="success">
          Check it out here!
        </Button></a> 
      </div>
      </div>

      {/* <h5 >
        {props.project.title}
      </h5>
      <p> {props.project.description}</p>
      <a target="_blank" rel="noreferrer noopener" href={props.project.link}>
        <Button variant="light">
          Check it out here!
        </Button></a> */}
        </div>
    </>
  )
}

export default ProjectContent;