const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account'
  },
  createdData: {
    type: Date,
    default: Date.now
  }
});

NoteSchema.statics.toAPI = doc => ({
  title: doc.title,
  content: doc.content,
});

const NoteModel = mongoose.model('Note', NoteSchema);

module.exports = NoteModel;