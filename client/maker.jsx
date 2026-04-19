const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleNote = (e, onNoteAdded) => {
    e.preventDefault();
    helper.hideError();

    const title = e.target.querySelector('#noteTitle').value;
    const content = e.target.querySelector('#noteContent').value;

    if (!title || !content) {
        helper.handleError('Both title and content are required!');
        return false;
    }

    helper.sendPost(e.target.action, { title, content }, onNoteAdded);
    return false;
}

const NoteForm = (props) => {
    return (
        <form id="noteForm"
            onSubmit={(e) => handleNote(e, props.triggerReload)}
            name='noteForm'
            action='/maker'
            method='POST'
            className='noteForm'
        >
            <label htmlFor='title'>Title: </label>
            <input id='noteTitle' type='text' name='title' placeholder='Note Title' />
            <label htmlFor='content'>Content: </label>
            <textarea id='noteContent' name='content' placeholder='Write your note here...'></textarea>
            <input className='makeNoteSubmit' type='submit' value='Save Note' />
        </form>
    );
}

const NoteList = (props) => {
    const [notes, setNotes] = useState(props.notes);

    useEffect(() => {
        const loadNotesFromServer = async () => {
            const response = await fetch('/getNotes');
            const data = await response.json();
            setNotes(data.notes);
        };
        loadNotesFromServer();
    }, [props.reloadNotes]);

    if (notes.length === 0) {
        return (
            <div className='noteList'>
                <h3 className='emptyNote'>No notes found!</h3>
            </div>
        );
    }

    const noteNodes = notes.map(note => {
        return (
            <div key={note._id} className='note'>
                <h3 className='noteTitle'>{note.title}</h3>
                <p className='noteContent'>{note.content}</p>
            </div>
        );
    });

    return (
        <div className='noteList'>
            {noteNodes}
        </div>
    );
}

const App = () => {
    const [reloadNotes, setReloadNotes] = useState(false);

    return (
        <div>
            <div id='makeNote'>
                <NoteForm triggerReload={() => setReloadNotes(!reloadNotes)} />
            </div>
            <div id='notes'>
                <NoteList notes={[]} reloadNotes={reloadNotes} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;