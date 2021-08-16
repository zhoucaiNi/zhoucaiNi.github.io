//import react pro sidebar components
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';

import { GoMarkGithub } from "react-icons/go";

import {
  NavLink
} from "react-router-dom";

//import icons from react icons
// import { FaList, FaRegHeart } from "react-icon";

function Sidebar() {
  return (
    <>
      <div
        style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}
      >
        <CDBSidebar textColor="#fff" backgroundColor="#2E8B57">
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

              <NavLink to="/education" exact activeClassName="activeClicked" >
                <CDBSidebarMenuItem icon="book"> Education
                  {/* <NavLink to="/education" exact activeClassName="activeClicked" /> */}
                </CDBSidebarMenuItem>
              </NavLink>

              <NavLink to="/experience" exact activeClassName="activeClicked" >
                <CDBSidebarMenuItem icon="columns"> Experience
                  {/* <NavLink to="/experience" exact activeClassName="activeClicked" /> */}
                </CDBSidebarMenuItem>
              </NavLink>

              <NavLink to="/project" exact activeClassName="activeClicked" >
                <CDBSidebarMenuItem icon="sticky-note"> Project
                  {/* <NavLink to="/project" exact activeClassName="activeClicked" /> */}
                </CDBSidebarMenuItem>
              </NavLink>


            </CDBSidebarMenu>

          </CDBSidebarContent>

          <CDBSidebarFooter style={{ textAlign: 'center' }}>
            <div
              style={{
                padding: '20px 5px'
              }}
            >
              <a style={{color: "white"}}target="_blank" rel="noreferrer noopener" href="https://github.com/zhoucaiNi">
                <CDBSidebarMenuItem >
                  {/* <Button variant="light"> */}

                    <GoMarkGithub />
                  {/* </Button> */}

                </CDBSidebarMenuItem>
              </a>
            </div>
          </CDBSidebarFooter>
        </CDBSidebar>
      </div>
    </>
  )
}

export default Sidebar;