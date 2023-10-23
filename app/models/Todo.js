const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    owner_id: { type: Object },
    title: { type: String },
    completed: { type: Number },
});

module.exports = mongoose.model('Todo', TodoSchema);