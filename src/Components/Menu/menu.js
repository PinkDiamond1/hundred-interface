import React from "react"
import AddressButton from "../AddressButton/addressButton"
import Navbar from "../Navbar/navbar"
import NavBarButton from "../Navbar/navBarButton"
import NavbarLink from "../Navbar/navBarLink"
import NavBarLinks from "../Navbar/navBarLinks"
import NavbarLogo from "../Navbar/navbarLogo"
import NavBarRight from "../Navbar/navBarRight"
import SideMenuButton from "../Navbar/sideMenuButton"

const Menu = (props) => {
    return(
        (!props.isTablet && !props.isMobile && props.show) ? (
            <Navbar theme={props.theme}>
                <NavbarLogo theme={props.theme} darkMode={props.darkMode}/>
                <NavBarLinks theme={props.theme}>
                  <NavbarLink theme={props.theme} link="/">Governance</NavbarLink>
                  <NavbarLink theme={props.theme} link="/">Audit</NavbarLink>
                  <NavbarLink theme={props.theme} link="/">Github</NavbarLink>
                  <NavbarLink theme={props.theme} link="https://dev.percent.finance" target="_blank">Dashboard</NavbarLink>
                </NavBarLinks>
                <NavBarRight>
                  <AddressButton theme={props.theme} address={props.address} setAddress={props.setAddress} provider={props.provider} 
                    setProvider={props.setProvider} setOpenAddress={props.setOpenAddress} setSideMenu={props.setSideMenu}/>
                  <SideMenuButton theme={props.theme} setSideMenu ={props.setSideMenu}/>
                </NavBarRight>
            </Navbar>
        ) : null
    )
} 

export default Menu