const models = require('../models');
const Note = models.Note;

const makerPage = async (req, res) => {
    return res.render('app');
};

const makeNote = async (req, res) => {
    if (!req.body.title || !req.body.content) {
        return res.status(400).json({ error: 'Title and content are required!' });
    }

    const noteData = {
        title: req.body.title,
        content: req.body.content,
        owner: req.session.account._id,
    };

    try {
        const newNote = new Note(noteData);
        await newNote.save();
        return res.json({ title: newNote.title, content: newNote.content });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred saving the note!' });
    }
};

const getNotes = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Note.find(query).select('title content').lean().exec();
        return res.json({ notes: docs });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error retrieving notes!' });
    }
};

module.exports = {
    makerPage,
    makeNote,
    getNotes,
};