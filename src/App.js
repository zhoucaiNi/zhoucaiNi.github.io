import Profile from './components/Profile';
import './App.css';
import './components/Content.css'
import Sidebar from './components/Sidebar'
import Sidebarr from './components/Sidebarr'
import Education from './components/Education';
import Experience from './components/Experience';
import Project from './components/Project';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


function Home() {
  return (
    <>
  <div id="rightContent">
      <Profile />
      <h1> About me </h1>
      </div>
    </>
  );
}

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex' }} >
      <Sidebarr />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/education" component={Education} />
        <Route exact path="/project" component={Project} />
        <Route exact path="/experience" component={Experience} />
      </Switch>
      </div>
    </Router>
  )
}

export default App;