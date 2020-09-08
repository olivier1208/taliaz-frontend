import React, {Component} from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

import RegisterForm from "./components/Forms/RegisterForm";
import LoginForm from "./components/Forms/LoginForm";
import AuthService from "./services/AuthService";
import Navigation from "./components/Navigation";
import Home from "./components/Home";

class App extends Component {

    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);
        this.setAuth = this.setAuth.bind(this);

        this.state = {
            currentUser: undefined,
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: user,
            });
        }
    }

    setAuth(value) {
        localStorage.setItem("user", JSON.stringify(value));

        this.setState({
            currentUser: value,
        });
    }

    logOut() {
        AuthService.logout();
    }

    render() {
        const {currentUser} = this.state;

        return (
            <Router>
                <div className="App">
                    <header>
                        <Navigation currentUser={currentUser} setAuth={this.setAuth}/>
                    </header>

                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 my-3">
                                <Switch>
                                    <Route exact path='/' render={(props) => <Home {...props} user={currentUser}/>}/>
                                    <Route path="/register" component={RegisterForm}/>
                                    <Route path="/login"
                                           render={(props) => <LoginForm {...props} setAuth={this.setAuth}/>}/>
                                </Switch>
                            </div>
                        </div>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
