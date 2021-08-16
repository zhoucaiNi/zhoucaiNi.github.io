import React from "react";

function EducationContent(props) {

  return (
    <>
      <div style={{ marginBottom: '2vh' }}>
        <div style={{ background: "white", width: "150vh", color: "black", display: "flex", }}>
          <img style={{ width: "100px", height: "100px", margin: "auto", marginLeft: "10px", marginRight: "10px" }} alt="dartmouth_logo" src="https://tinyurl.com/9w4j6jce" />
          <div style={{ display: "inline" }}>
            <h5 style={{ textAlign: 'center' }}>  {props.education.term} </h5>
            <ul>
              <li> {props.education.class1}</li>
              <li> {props.education.class2}</li>
              <li> {props.education.class3}</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default EducationContent;