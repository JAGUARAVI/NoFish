const { BaseEvent } = require('jag-cmd-handler');
const { WebhookClient, MessageEmbed } = require('discord.js');

module.exports = class Event extends BaseEvent {
    constructor() {
        super('guildCreate');
    }
    async run(client, guild) {
        try {
            const hook = new WebhookClient({ id: client.data.loghook.id, token: client.data.loghook.token });
            hook.send(
                {
                    username: client.user.username,
                    avatarURL: client.user.avatarURL(),
                    embeds: [{
                        title: `${client.user.username} Joined A New Server :tada:`,
                        description: `Name: **${guild.name}**\n\nNow in a total of **${client.guilds.cache.size} Servers**`,
                        color: 'GREEN',
                        thumbnail: {
                            url: guild.iconURL({ dynamic: true })
                        }
                    }]
                });
        } catch (e) {
            client.log.error(e);
        }

        client.registerApplicationCommands(guild).catch(() => { });

        guild.channels.cache.filter((c) => c.type === 'GUILD_TEXT' && c.permissionsFor(guild.me).has(['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS']))?.first()?.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.data.embedColor)
                    .setTitle(`Thanks for adding ${client.user.username}`)
                    .setDescription(
                        `> Use \`/help\` (or \`@${client.user.username} help\`) to view all of my commands\n\n` +
                        `Use \`/settings all\` for a list of all settings to set ${client.user.username} up!`
                    )
            ]
        }).catch(client.log.error);
    }
}