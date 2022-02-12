const { BaseEvent } = require('jag-cmd-handler');
const { WebhookClient } = require('discord.js');

module.exports = class Event extends BaseEvent {
    constructor() {
        super('guildDelete');
    }
    async run(client, guild) {
        try {
            const hook = new WebhookClient({ id: client.data.loghook.id, token: client.data.loghook.token });
            hook.send(
                {
                    username: client.user.username,
                    avatarURL: client.user.avatarURL(),
                    embeds: [{
                        title: `${client.user.username} Left A Server :pensive:`,
                        description: `Name: **${guild.name}**\n\nNow in a total of **${client.guilds.cache.size} Servers**`,
                        color: 'RED',
                        thumbnail: {
                            url: guild.iconURL({ dynamic: true })
                        }
                    }]
                }).catch(() => { });
        } catch (e) {
            client.log.error(e);
        }
    }
}