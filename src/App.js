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
        this.setUserList = this.setUserList.bind(this);

        this.state = {
            currentUser: undefined,
            users: []
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

    setUserList(value){
        localStorage.setItem("users", JSON.stringify(value));

        this.setState({
            users: value,
        });
    }

    logOut() {
        AuthService.logout();
    }

    render() {
        const {currentUser, users} = this.state;

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
                                    <Route exact path='/' render={(props) => <Home {...props} user={currentUser} users={users}/>}/>
                                    <Route path="/register"
                                           render={(props) => <RegisterForm {...props} setAuth={this.setAuth}/>}/>
                                    <Route path="/login"
                                           render={(props) => <LoginForm {...props} setAuth={this.setAuth} setUserList={this.setUserList}/>}/>
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
