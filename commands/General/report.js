const { BaseCommand } = require('jag-cmd-handler');
const { MessageEmbed } = require('discord.js');

module.exports = class Command extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'report',
                aliases: [],
                description: 'Report a phishing site not detected by us.',
                usage: '',
                nsfw: false,
                cooldown: 10,
                args: false,
                deleteAuthorMessage: false,
                protected: false,
                commandOptions: [
                    {
                        type: 'STRING',
                        name: 'link',
                        required: true,
                        description: 'The url which you want to report.'
                    },
                    {
                        type: 'STRING',
                        name: 'reason',
                        required: false,
                        description: 'The reason/explanation for reporting the url.'
                    }
                ]
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
        const link = ctx.isCommand ? ctx.source.options.getString('link') : ctx.args.shift();
        const reason = ctx.isCommand ? ctx.source.options.getString('reason') : ctx.args.join(' ');
        ctx.client.guilds.cache.get('765842414988427314')?.channels.cache.get('942116483033616454')?.send({
            embeds: [
                new MessageEmbed()
                    .setColor(ctx.client.data.embedColor)
                    .setAuthor({ name: 'Report', iconURL: ctx.client.user.displayAvatarURL() })
                    .setDescription(`**Reported By:**\n${ctx.source.user.tag} (${ctx.source.user.id})\n\n**Url:**\n> ${link}\n\n**Reason:**\n> ${reason || 'None'}`)
                    .setFooter({ text: `Guild ID: ${ctx.source.guild.id}` })
            ],

        }).catch(() => { });

        ctx.reply({
            content: '✅ **Thanks for reporting!** Your report has been submitted.\n\nYou can check for the status of your report in the support server.',
            allowedMentions: {
                parse: []
            },
            delete: false
        });
    }
}