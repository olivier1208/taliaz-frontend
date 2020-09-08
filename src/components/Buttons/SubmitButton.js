import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class SubmitButton extends Component {
    static propTypes = {
        value: PropTypes.string.isRequired,
        className: PropTypes.string.isRequired,
        disabled:PropTypes.bool,
        variant:PropTypes.string
    }


    render() {
        const { value = 'Submit', className, disabled = null, variant} = this.props
        return (
            <div>
                <Row className={className}>
                    <Col md="4" >
                        <button disabled={disabled} type="submit" className={`btn btn-${variant} btn-block`}>{value}</button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default SubmitButton;
