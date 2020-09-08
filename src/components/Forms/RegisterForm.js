import React, {Component} from 'react';
import axios from 'axios';
import SweetAlert from "sweetalert2";
import {FormErrors} from "../FormErrors";
import Alert from "react-bootstrap/Alert";
import SubmitButton from "../Buttons/SubmitButton";
import {Link} from "react-router-dom";

export default class SignUpForm extends Component {

    constructor(props) {
        super(props)

        this.onChangeUserName = this.onChangeUserName.bind(this);
        this.onChangeUserEmail = this.onChangeUserEmail.bind(this);
        this.checkPassword = this.checkPassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username: '',
            email: '',
            password: '',
            formErrors: {username: '', email: '', password: ''},
            emailValid: false,
            passwordValid: false,
            formValid: false,
            redirect: false,
            success: false,
            emailUnique: false,
        }
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;

        switch (fieldName) {
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : ' is invalid';
                break;
            case 'password':
                const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
                passwordValid = mediumRegex.test(value) && value.length >= 6;
                fieldValidationErrors.password = passwordValid ? '' : ' is insecure (6 characters and 2 different)';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            emailValid: emailValid,
            passwordValid: passwordValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({formValid: this.state.emailValid && this.state.passwordValid});
    }

    onChangeUserEmail(e) {
        this.setState({email: e.target.value}, () => {
            this.validateField("email", this.state.email)
        })
    }

    checkPassword(e) {
        this.setState({password: e.target.value}, () => {
            this.validateField("password", this.state.password)
        })
    }

    onSubmit(e) {
        e.preventDefault()

        const userObject = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        };

        axios.post('http://127.0.0.1:8000/register', userObject)
            .then((res) => {
                if (res.status === 201) {
                    this.setState({success: true})
                }

            }).catch((error, mes) => {
            if (error.response.data.error.code === 400) {
                this.setState({emailUnique: true})
            }
            console.log(error)
        });

        this.setState({username: '', email: '', password: ''})
    }

    errorClass(error) {
        return (error.length === 0 ? '' : 'has-error');
    }

    render() {
        const {success, emailUnique} = this.state;

        if (success) {
            return <div>
                <SweetAlert
                    success
                    title="User Created Successfully !"
                    onConfirm={() => {
                        this.props.history.push('/api/auth/signin')
                    }}
                    timeout={5000}
                >
                    Click OK to Sign in now
                </SweetAlert>

            </div>;
        }
        return (
            <div className="wrapper">
                {emailUnique ?
                    <Alert variant="danger" className="text-center">Oops! This email already exists</Alert> : null}
                <div className="panel panel-default">
                    <FormErrors formErrors={this.state.formErrors}/>
                </div>
                <form onSubmit={this.onSubmit}>
                    <div className={`form-group ${this.errorClass(this.state.formErrors.username)}`}>
                        <label>Username</label>
                        <input type="text" value={this.state.username} onChange={this.onChangeUserName}
                               className="form-control"/>
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={this.state.email} onChange={this.onChangeUserEmail}
                               className="form-control"/>
                    </div>
                    <div className={`form-group ${this.errorClass(this.state.formErrors.email)}`}>
                        <label>Password</label>
                        <input type="password" value={this.state.password} onChange={this.checkPassword}
                               className="form-control"/>
                    </div>
                    <SubmitButton
                        value="Create User"
                        className={`form-group ${this.errorClass(this.state.formErrors.password)} justify-content-center`}
                        disabled={!this.state.formValid}
                        variant="success"
                    />
                    <p className="forgot-password text-right">
                        <Link to={"/api/auth/signin"}> Already registered ?</Link>
                    </p>
                </form>
            </div>
        )
    }
}
