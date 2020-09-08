import React from "react";
import Alert from "react-bootstrap/Alert";

export const FormErrors = ({formErrors}) =>
    <div className='formErrors'>
        {Object.keys(formErrors).map((fieldName, i) => {
            if (formErrors[fieldName].length > 0) {
                if (fieldName === 'passwordConfirmation'){
                    return (
                        <Alert variant="danger" key={i}>{formErrors[fieldName]}</Alert>
                    )
                } else {
                    return (
                        <Alert variant="danger" key={i}>{'Your ' + fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} {formErrors[fieldName]}</Alert>
                    )
                }
            } else {
                return '';
            }
        })}
    </div>
