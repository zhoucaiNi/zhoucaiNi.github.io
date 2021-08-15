//import react pro sidebar components
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';

import {
  NavLink
} from "react-router-dom";

//import icons from react icons
// import { FaList, FaRegHeart } from "react-icon";

function Sidebarr() {
  return (
    <>
      <div
        style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}
      >
        <CDBSidebar textColor="#fff" backgroundColor="#333">
          <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
            <NavLink
              to="/"
              className="text-decoration-none"
              style={{ color: 'inherit' }}
            >
              Zhoucai Ni
            </NavLink>
          </CDBSidebarHeader>

          <CDBSidebarContent >
            <CDBSidebarMenu>
              
              <CDBSidebarMenuItem icon="book"> Education
                <NavLink to="/education" exact activeClassName="activeClicked" />
              </CDBSidebarMenuItem>


              <CDBSidebarMenuItem icon="columns"> Experience
                <NavLink to="/experience" exact activeClassName="activeClicked" />
              </CDBSidebarMenuItem>


              <CDBSidebarMenuItem icon="sticky-note"> Project
                <NavLink to="/project" exact activeClassName="activeClicked" />
              </CDBSidebarMenuItem>


            </CDBSidebarMenu>

          </CDBSidebarContent>

          <CDBSidebarFooter style={{ textAlign: 'center' }}>
            <div
              style={{
                padding: '20px 5px',
              }}
            >
              Sidebar Footer
            </div>
          </CDBSidebarFooter>
        </CDBSidebar>
      </div>
    </>
  )
}

export default Sidebarr;