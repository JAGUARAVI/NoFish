const { Schema, model } = require('mongoose');

const guildSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    settings: {
        punishment: {
            type: Number,
            default: 1,
            min: 0,
            max: 2,
        },
        modChannel: {
            type: String,
            default: ''
        },
        deleteNotification: {
            type: Boolean,
            default: false
        }
    }
});

module.exports = model('guilds', guildSchema);