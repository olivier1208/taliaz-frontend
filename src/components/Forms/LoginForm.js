import React, {Component} from "react";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import {Redirect} from "react-router-dom";
import SubmitButton from "../Buttons/SubmitButton";
import {Link} from "react-router-dom";
import {API_URL} from '../../services/Config'

export default class SignInForm extends Component {
    constructor(props) {
        super(props)

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.checkPassword = this.checkPassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            redirect: false,
            email: '',
            password: '',
            showBadCredentialsAlert: false,
            isLoggedIn: false,
        }
    }

    onChangeEmail(e) {
        this.setState({email: e.target.value})
    }

    checkPassword(e) {
        this.setState({password: e.target.value})
    }

    onSubmit(e) {
        e.preventDefault()

        const userObject = {
            email: this.state.email,
            password: this.state.password
        };

        axios.post(API_URL + '/api/login', userObject)
            .then((res) => {
                if (res.status === 200) {
                    this.props.setAuth(res.data.user)
                    if (res.data.user.role === "admin"){
                        this.props.setUserList(res.data.users)
                    }
                    this.setState({redirect: true})
                }
            }).catch((error) => {
            this.setState({showBadCredentialsAlert: true})
        });

        this.setState({password: ''})
    }

    render() {
        const {redirect} = this.state;
        if (redirect) {
            return <Redirect to='/'/>;
        }
        let unauthorizedAlert
        let errorAlert

        if (this.props.location.state && this.props.location.state.unauthorized) {
            unauthorizedAlert =
                <Alert variant="danger" className="text-center">You need to be signed in to access this page</Alert>
        }
        if (this.state.showBadCredentialsAlert) {
            errorAlert =
                <Alert variant="danger" className="text-center">Wrong Email or Password</Alert>
        }
        return (
            <>
                {unauthorizedAlert}
                {errorAlert}
                <form onSubmit={this.onSubmit}>
                    <h3 className="text-center">Sign In</h3>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="text" className="form-control" placeholder="Enter email"
                               value={this.state.email} onChange={this.onChangeEmail}/>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Enter password"
                               value={this.state.password} onChange={this.checkPassword}/>
                    </div>


                    <SubmitButton className="justify-content-center" value="Submit" variant="primary" disabled={null}/>
                    <p className="forgot-password text-right">
                        <Link to={"/register"}> Not registered ?</Link>
                    </p>
                </form>
            </>
        );
    }
}
