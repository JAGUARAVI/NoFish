const { BaseEvent, Client } = require('jag-cmd-handler');
const { Message } = require('discord.js');

module.exports = class MessageUpdateEvent extends BaseEvent {
    constructor() {
        super('messageUpdate');
    }

    /**
     *
     * @param {Client} client
     * @param {Message} oldMessage
     * @param {Message} message
     */
    async run(client, oldMessage, message) {
        if (message) client.textCommandHandler.run(message);
    }
}