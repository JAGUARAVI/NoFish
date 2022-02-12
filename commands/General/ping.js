const { BaseCommand } = require('jag-cmd-handler');
const { MessageEmbed } = require('discord.js');

const getPingEmoji = (ping) => {
    if (ping < 100) return '🟢';
    else if (ping < 200) return '🔵';
    else if (ping < 300) return '🟡';
    else return '🔴';
};

module.exports = class Command extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'ping',
                aliases: ['latency'],
                description: 'Displays the ping.',
                usage: '',
                nsfw: false,
                cooldown: 10,
                args: false,
                deleteAuthorMessage: false,
                protected: false
            },
            permissions: {
                userPerms: [],
                clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
                serverOwnerOnly: false,
                botOwnerOnly: false
            }
        });
    }

    async run(ctx) {
        let time = Date.now();
        let apiLatency = ctx.client.ws.ping;

        let m = await ctx.send({
            content: 'Pong!',
        });

        let msgLatency = Date.now() - time;

        if (ctx.flags.includes('noembed')) {
            return m.edit(`Roundtrip Latency: ${msgLatency} ms\nApi Latency: ${apiLatency} ms`);
        }

        let embed = new MessageEmbed()
            .setColor(ctx.client.data.embedColor)
            .setTimestamp()
            .setAuthor({ name: 'Latency', iconURL: ctx.client.user.avatarURL() })
            .addField(`Roundtrip`, `${getPingEmoji(msgLatency)} ${msgLatency} ms`)
            .addField(`Gateway`, `${getPingEmoji(apiLatency)} ${apiLatency} ms`)

        return m.edit(
            {
                embeds: [embed]
            }
        );
    }
}