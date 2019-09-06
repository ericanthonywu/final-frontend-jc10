import React, {Component} from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import Cookie from 'universal-cookie'
import {resetUser} from "./../../redux/1.actions";

let cookieObj = new Cookie();

class NavbarComp extends Component {
    state = {
        navbarOpen: false
    };

    onBtnLogout = () => {
        cookieObj.remove('userData');
        this.props.resetUser()
    };

    render() {
        return (
            <div>
                <Navbar color="light" light expand="md">
                    <Link to="/"><NavbarBrand>Popokpedia</NavbarBrand></Link>
                    <NavbarToggler onClick={() => this.setState({navbarOpen: !this.state.navbarOpen})}/>
                    <Collapse navbar>
                        <Nav className="ml-auto" navbar>
                            {
                                this.props.userObj.username !== '' && this.props.userObj.role !== ''
                                    ?
                                    <>
                                        <NavItem>
                                            <NavLink>{this.props.userObj.totalCart}</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink>{this.props.userObj.username}</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink>{this.props.userObj.role}</NavLink>
                                        </NavItem>
                                        <UncontrolledDropdown nav inNavbar>
                                            <DropdownToggle nav caret>
                                                Options
                                            </DropdownToggle>
                                            <DropdownMenu right>
                                                {
                                                    this.props.userObj.role == 'admin'
                                                        ?
                                                        <Link style={{textDecoration: 'none', color: 'inherit'}}
                                                              to="/admin/dashboard">
                                                            <DropdownItem>
                                                                Admin Dashboard
                                                            </DropdownItem>
                                                        </Link>
                                                        :
                                                        null
                                                }
                                                <Link to="/cart" style={{textDecoration: 'none', color: 'inherit'}}>
                                                    <DropdownItem>
                                                        Cart
                                                    </DropdownItem>
                                                </Link>
                                                <Link to="/history" style={{textDecoration: 'none', color: 'inherit'}}>
                                                    <DropdownItem>
                                                        History
                                                    </DropdownItem>
                                                </Link>
                                                <Link to="/wishlist" style={{textDecoration: 'none', color: 'inherit'}}>
                                                    <DropdownItem>
                                                        Wishlist
                                                    </DropdownItem>
                                                </Link>
                                                <DropdownItem divider/>
                                                <DropdownItem onClick={this.onBtnLogout}>
                                                    Logout
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </>
                                    :
                                    <>
                                        <NavItem style={{borderRight: '1px solid lightgrey'}}>
                                            <Link to="/auth"><NavLink>Login</NavLink></Link>
                                        </NavItem>
                                        <NavItem>
                                            <Link to="/auth"><NavLink>Register</NavLink></Link>
                                        </NavItem>
                                    </>
                            }
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userObj: state.user,
    }
};

export default connect(mapStateToProps, {resetUser})(NavbarComp)
