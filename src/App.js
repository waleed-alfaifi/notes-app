import React, { Component } from 'react';
import './App.css';

import Preview from './components/Preview';
import Message from './components/Message';
import NotesList from './components/NotesList';
import Note from './components/Note';
import NoteForm from './components/NoteForm';
import Alert from './components/Alert';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            title: '',
            content: '',
            selectedNote: null,
            creating: false,
            editing: false,
            validationErrors: []
        }
    }

    componentWillMount() {
        if (localStorage.getItem("notes")) {
            this.setState({ notes: JSON.parse(localStorage.getItem("notes")) });
        } else {
            localStorage.setItem("notes", JSON.stringify([]));
        }
    }

    componentDidUpdate() {
        if (this.state.validationErrors.length !== 0) {
            setTimeout(() => {
                this.setState({ validationErrors: [] })
            }, 3000);
        }
    }

    validate = () => {
        const tempValidationErrors = [];
        let passed = true;

        if (!this.state.title) {
            tempValidationErrors.push("لا يمكن ترك العنوان فارغاً.")
            passed = false;
        }

        if (!this.state.content) {
            tempValidationErrors.push("لا يمكن ترك محتوى الملاحظة فارغاً.")
            passed = false;
        }

        this.setState({
            validationErrors: tempValidationErrors
        });

        return passed;
    }

    getAddNote = () => {
        return (
            <NoteForm
                formTitle="إضافة ملاحظة"
                title={this.state.title}
                content={this.state.content}
                handleChange={this.changeHandler}
                handleSave={this.saveNoteHandler}
                submitText="إضافة"
            />
        );
    }

    getPreview = () => {
        const { notes, selectedNote } = this.state;

        if (notes.length === 0) {
            return <Message text="لا يوجد ملاحظات" />
        }

        if (!selectedNote) {
            return <Message text="الرجاء اختيار ملاحظة" />
        }

        const noteToBeShown = notes.filter(note => note.id === selectedNote)[0];

        let noteDisplay = (
            <div>
                <h2>{noteToBeShown.title}</h2>
                <p>{noteToBeShown.content}</p>
            </div>
        )

        if (this.state.editing) {
            noteDisplay = (
                <NoteForm
                    formTitle="تعديل ملاحظة"
                    title={this.state.title}
                    content={this.state.content}
                    handleChange={this.changeHandler}
                    handleSave={this.editNoteHandler}
                    submitText="تعديل"
                />
            );
        }

        return (
            <div>
                {!this.state.editing &&
                    <div className="note-operations">
                        <a href="#" onClick={this.editNoteHandler}><i className="fa fa-pencil-alt" /></a>
                        <a href="#" onClick={this.deleteNoteHandler}><i className="fa fa-trash" /></a>
                    </div>
                }

                {noteDisplay}
            </div>
        );
    };

    saveToLocalStorage = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    }

    addNoteHandler = () => {
        this.setState({
            title: '',
            content: '',
            creating: !this.state.creating,
            editing: false
        })
    }

    changeHandler = (event) => {
        const { name, value } = event.target;

        this.setState({
            [name]: value
        })
    }

    selectedNoteHandler = (noteID) => {
        this.setState({
            selectedNote: noteID,
            creating: false,
            editing: false
        })
    }

    editNoteHandler = (event) => {


        const { notes, selectedNote, title, content } = this.state;
        let noteToBeEdited = notes.filter(note => note.id === selectedNote)[0];

        // Updating the note.
        if (event.target.innerHTML === "تعديل") {
            if (!this.validate()) {
                return;
            }

            const updatedNotes = [...notes];
            const noteIndex = notes.findIndex((note) => note.id === selectedNote);

            updatedNotes[noteIndex] = {
                id: selectedNote,
                title,
                content
            }

            this.saveToLocalStorage("notes", updatedNotes);

            this.setState({
                notes: updatedNotes,
                title: '',
                content: '',
                editing: false
            });

            return;
        }

        // Showing the editing window.
        this.setState({
            editing: true,
            title: noteToBeEdited.title,
            content: noteToBeEdited.content
        });
    }

    saveNoteHandler = () => {
        if (!this.validate()) {
            return;
        }
        const { title, content, notes } = this.state;
        const newNote = {
            id: new Date(),
            title,
            content
        };

        const updatedNotes = [...notes, newNote];
        this.saveToLocalStorage("notes", updatedNotes);
        this.setState({
            title: '',
            content: '',
            notes: updatedNotes,
            creating: false,
            editing: false,
            selectedNote: newNote.id
        });
    }

    deleteNoteHandler = () => {
        const updatedNotes = [...this.state.notes];
        const noteIndex = updatedNotes.findIndex(note => note.id === this.state.selectedNote);

        if (window.confirm("هل أنت متأكد من حذف الملاحظة؟")) {
            updatedNotes.splice(noteIndex, 1);

            this.saveToLocalStorage("notes", updatedNotes);

            this.setState({
                notes: updatedNotes,
                selectedNote: null
            });
        }
    }

    render() {
        const listOfNoteComponents = this.state.notes.map(note =>
            <Note
                key={note.id}
                title={note.title}
                noteClicked={() => this.selectedNoteHandler(note.id)}
                active={this.state.selectedNote === note.id}
            />
        );

        return (
            <div className="App">
                <NotesList>
                    {listOfNoteComponents}

                    <button className="add-btn" onClick={this.addNoteHandler}>
                        +
                    </button>
                </NotesList>
                <Preview>
                    {this.state.creating ? this.getAddNote() : this.getPreview()}
                </Preview>

                {this.state.validationErrors.length !== 0 && <Alert alertMessages={this.state.validationErrors} />}
            </div>
        );
    }
}

export default App;
