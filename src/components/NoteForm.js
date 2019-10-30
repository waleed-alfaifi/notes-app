import React from 'react';

function NoteForm(props) {
    const { formTitle, title, content, handleChange, handleSave, submitText } = props;

    return (
        <div>
            <h2>{formTitle}</h2>
            <div>
                <input
                    type="text"
                    name="title"
                    className="form-input mb-30"
                    placeholder="العنوان"
                    value={title}
                    onChange={handleChange}
                />

                <textarea
                    rows="10"
                    name="content"
                    className="form-input"
                    placeholder="النص"
                    value={content}
                    onChange={handleChange}
                />

                <a href="#" className="button green" onClick={handleSave}>{submitText}</a>
            </div>
        </div>
    );
}


export default NoteForm;