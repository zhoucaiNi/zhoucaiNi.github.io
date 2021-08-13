//import react pro sidebar components
import {
  ProSidebar,
  Menu,
  MenuItem,
} from "react-pro-sidebar";

import './Sidebar.css';
import "react-pro-sidebar/dist/css/styles.css";

import {
  Link
} from "react-router-dom";

//import icons from react icons
// import { FaList, FaRegHeart } from "react-icon";

function Sidebar() {
  return (
    <>
      <ProSidebar>
        <Menu iconShape="square">
          <MenuItem> Home </MenuItem>
          <MenuItem> Education 
          <Link to="/education" />
          </MenuItem>
          <MenuItem> Project </MenuItem>
          <MenuItem>
           Experience 
           <Link to="/experience"/>
          </MenuItem>

        </Menu>
      </ProSidebar>
    </>
  )
}

export default Sidebar;