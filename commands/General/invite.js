const { BaseCommand } = require('jag-cmd-handler');
const { MessageEmbed } = require('discord.js');

module.exports = class Command extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'invite',
                aliases: ['add', 'link'],
                description: 'Sends the bot invite link.',
                usage: '',
                nsfw: false,
                cooldown: 3,
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
        return ctx.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(ctx.client.data.embedColor)
                    .setAuthor({ name: 'Links', iconURL: ctx.client.user.displayAvatarURL()})
                    .setDescription(`> [Invite Bot](${ctx.client.data.inviteLink})\n\n> [Support Server](${ctx.client.data.supportLink})`)
            ],
            allowedMentions: {
                parse: []
            },
            delete: false
        })
    }
}