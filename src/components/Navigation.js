import React, {Component} from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {Link} from "react-router-dom";

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this)
    }

    logOut() {
        this.props.setAuth(null)
    }

    render() {
        return (
            <div>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse id="responsive-navbar-nav">

                        <Nav className="ml-auto">
                            <ul className="navbar-nav ml-auto">
                                {this.props.currentUser ? (
                                    <li className="nav-item">
                                        <Link
                                            to={"/login"}
                                            className="nav-link"
                                            onClick={this.logOut}
                                        >
                                            LogOut
                                        </Link>
                                    </li>
                                ) : (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link"
                                                  to={"/register"}>Register</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to={"/login"}>Login</Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}

export default Navigation;
