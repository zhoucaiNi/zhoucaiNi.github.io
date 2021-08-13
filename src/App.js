import profile from './images/profile.JPG';
import './App.css';
import Sidebar from './components/Sidebar'
import Education from './components/Education';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


function Home() {
  return (
    <>
      <Sidebar />
      <img src={profile} className="profile" alt="profile-pic" />
      <p>
        Zhoucai Ni
      </p>
    </>
  );
}

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/education" component={Education} />
      </Switch>
    </Router>
  )
}

export default App;
