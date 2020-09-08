import React from 'react';
import {Redirect} from "react-router-dom";

export default function Home(props) {
    if (!props.user) {
        return <Redirect to='/login'/>;
    }
    return (

        <div>
            <h3>Current User is {props.user.first_name}</h3>
        </div>
    )
}
