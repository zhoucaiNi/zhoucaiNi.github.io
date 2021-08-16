import React from 'react';
import "../Content.css"
import Profile from '../Profile'
import ExperienceContent from './ExperienceContent';

import { experiences } from './Experiences'

function Experience() {
  return (
    <>
      <div id="rightContent">
        <Profile />
        <h1> Experience </h1>
   
        {experiences.map((experience) => {
          return (
            
              <ExperienceContent experience={experience} />

          )
        })}

      </div>
    </>
  )

}

export default Experience;