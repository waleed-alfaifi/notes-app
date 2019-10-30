import React from 'react';

function NotesList(props) {
    return (
        <div className="notes-section">
            <ul className="notes-list">
                {props.children}
            </ul>
        </div>
    );
}

export default NotesList;