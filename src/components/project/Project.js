import React from 'react';
import "../Content.css"
import ProjectContent from './ProjectContent';
import Profile from '../Profile';
import {projects} from './Projects'

function Project() {

return (
  <>
    <div id="rightContent" >
      <Profile />
      <h1> Projects </h1>
      {projects.map((project) => {
        return (
          <>
            <ProjectContent project={project} />
          </>
        )
      })
      }
    </div>
  </>
)

}

export default Project;