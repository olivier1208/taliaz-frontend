import React, {Component} from 'react';
import axios from 'axios';
import SweetAlert from "react-bootstrap-sweetalert";
import {FormErrors} from "../FormErrors";
import Alert from "react-bootstrap/Alert";
import SubmitButton from "../Buttons/SubmitButton";
import {Link} from "react-router-dom";
import {API_URL} from "../../services/Config"

export default class SignUpForm extends Component {

    constructor(props) {
        super(props)

        this.onChangeUserEmail = this.onChangeUserEmail.bind(this);
        this.onChangeUserFirstName = this.onChangeUserFirstName.bind(this);
        this.onChangeUserLastName = this.onChangeUserLastName.bind(this);
        this.onChangeUserAddress = this.onChangeUserAddress.bind(this);
        this.checkPassword = this.checkPassword.bind(this);
        this.checkConfirmPassword = this.checkConfirmPassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            firstName: '',
            lastName: '',
            address: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            formErrors: {email: '', password: ''},
            emailValid: false,
            passwordValid: false,
            passwordMatch: false,
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

    checkPasswordEquality(password, passwordConfirmation) {
        let fieldValidationErrors = this.state.formErrors;
        let passwordMatch = (password === passwordConfirmation)

        fieldValidationErrors.passwordConfirmation = passwordMatch ? '' : 'Passwords does not match'

        this.setState({
            formErrors: fieldValidationErrors,
            passwordMatch: passwordMatch
        }, this.validateForm);
    }

    validateForm() {
        this.setState({formValid: this.state.emailValid && this.state.passwordValid && this.state.passwordConfirmation});
    }

    onChangeUserEmail(e) {
        this.setState({email: e.target.value}, () => {
            this.validateField("email", this.state.email)
        })
    }

    onChangeUserFirstName(e) {
        this.setState({firstName: e.target.value})
    }

    onChangeUserLastName(e) {
        this.setState({lastName: e.target.value})
    }

    onChangeUserAddress(e) {
        this.setState({address: e.target.value})
    }

    checkPassword(e) {
        this.setState({password: e.target.value}, () => {
            this.validateField("password", this.state.password)
        })
    }

    checkConfirmPassword(e) {
        this.setState({passwordConfirmation: e.target.value}, () => {
            this.checkPasswordEquality(this.state.password, this.state.passwordConfirmation)
        })
    }

    onSubmit(e) {
        e.preventDefault()

        const userObject = {
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            address: this.state.address,
            email: this.state.email,
            password: this.state.password,
            confirm_password: this.state.password
        };

        axios.post(API_URL + '/api/register', userObject)
            .then((res) => {
                if (res.status === 200) {
                    this.props.setAuth(res.data.user)
                    this.setState({success: true})
                }

            }).catch((error) => {

            if (error.response.data.errors.email) {
                this.setState({emailUnique: true})
            }
            console.log(error)
        });

        this.setState({firstName: '', lastName: '', address: '', email: '', password: '', passwordConfirmation: ''})
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
                        this.props.history.push('/')
                    }}
                    timeout={5000}
                >
                    Click OK to redirect to homepage
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

                    <h3 className="text-center">Register</h3>
                    <hr/>
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text" className="form-control" value={this.state.firstName} onChange={this.onChangeUserFirstName}/>
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" className="form-control" value={this.state.lastName} onChange={this.onChangeUserLastName}/>
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input type="text" className="form-control" value={this.state.address} onChange={this.onChangeUserAddress}/>
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

                    <div className={`form-group ${this.errorClass(this.state.formErrors.email)}`}>
                        <label>Confirm your password</label>
                        <input type="password" value={this.state.passwordConfirmation} onChange={this.checkConfirmPassword}
                               className="form-control"/>
                    </div>
                    <SubmitButton
                        value="Create User"
                        className="form-group justify-content-center"
                        disabled={!this.state.formValid}
                        variant="success"
                    />
                    <p className="forgot-password text-right">
                        <Link to={"/login"}> Already registered ?</Link>
                    </p>
                </form>
            </div>
        )
    }
}
