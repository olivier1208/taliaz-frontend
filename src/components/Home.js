import React from 'react';
import {Redirect} from "react-router-dom";
import AuthService from "../services/AuthService";
import {Table} from "react-bootstrap";

export default function Home() {
    if (!AuthService.getCurrentUser()) {
        return <Redirect to='/login'/>;
    }
    let currentUser = AuthService.getCurrentUser()
    return (

        <div className="text-center">
            {currentUser.role === 'admin' ?
                <div>
                    <h3>Current User : <strong>{currentUser.first_name} {currentUser.last_name}</strong></h3>
                    <p>
                        Address : {currentUser.address}
                    </p>
                    <hr/>
                    <h4>Users List</h4>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Role</th>
                        </tr>
                        </thead>
                        <tbody>
                        {JSON.parse(localStorage.getItem('users')).map((value, index) => {
                            return <tr key={index}>
                                <td>{value.id}</td>
                                <td>{value.first_name}</td>
                                <td>{value.last_name}</td>
                                <td>{value.email}</td>
                                <td>{value.address}</td>
                                <td>{value.role}</td>
                            </tr>
                        })}
                        </tbody>
                    </Table>
                </div>
                :
                <div>
                    <h3>Current User : <strong>{currentUser.first_name} {currentUser.last_name}</strong></h3>
                    <p>
                        Address : {currentUser.address}
                    </p>
                </div>
            }

        </div>
    )
}
