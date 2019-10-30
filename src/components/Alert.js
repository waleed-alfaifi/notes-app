import React from 'react';

function Alert(props) {
    return (
        <div className="alert-container">
            <ul>
                {props.alertMessages.map((message, index) => {
                    return <li key={index}>{message}</li>
                })}
            </ul>
        </div>
    );
}

export default Alert;