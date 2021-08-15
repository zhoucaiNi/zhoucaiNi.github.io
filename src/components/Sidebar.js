//import react pro sidebar components
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
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
      <ProSidebar id="header">
        <SidebarHeader>
          <h1> Zhoucai Ni </h1>
        </SidebarHeader>
        <SidebarContent>
          <Menu iconShape="square">
            <MenuItem>
              Home
              <Link to="/" />
            </MenuItem>

            <MenuItem>
              Education
              <Link to="/education" />
            </MenuItem>

            <MenuItem>
              Project
              <Link to="/project" />
            </MenuItem>

            <MenuItem>
              Experience
              <Link to="/experience" />
            </MenuItem>

          </Menu>
        </SidebarContent>
        <SidebarFooter>
          <h1> Footer </h1>
        </SidebarFooter>
      </ProSidebar>
    </>
  )
}

export default Sidebar;