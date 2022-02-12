const { BaseCommand, Utils } = require('jag-cmd-handler');
const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');

module.exports = class Command extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'help',
                aliases: ['commands'],
                description: 'Displays a list of all commands.',
                usage: '',
                nsfw: false,
                cooldown: 5,
                args: false,
                deleteAuthorMessage: false,
                protected: false,
                commandType: 0,
                commandOptions: [
                    {
                        type: 'STRING',
                        name: 'command',
                        required: false,
                        description: 'The command to get help for'
                    },
                ]
            },
            permissions: {
                userPerms: [],
                clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'],
                serverOwnerOnly: false,
                botOwnerOnly: false
            }
        });
    }

    async run(ctx) {
        let cmd = ctx.isCommand ? ctx.source.options.get('command')?.value : ctx.args[0];
        if (cmd != undefined) {
            const name = cmd.toLowerCase() || cmd;
            const command = ctx.client.commands.get(name) || ctx.client.commands.find(c => c.config.aliases && c.config.aliases.includes(name));

            if (command) {
                let embed = new MessageEmbed()
                    .setColor(ctx.client.data.embedColor)
                    .setTitle(`**${Utils.general.capitalize(command.config.name)}** Command`)
                    .setDescription(`${command.config.description}`)
                    .addField(`Category 🔖`, `• ${command.config.category}`, true)
                    .addField(`Cooldown ⌛`, `${ms(command.config.cooldown * 1000)}`, true);

                if (command.config.aliases && command.config.aliases.length !== 0)
                    embed.addField(`Aliases`, `\`${command.config.aliases.join('\`` , \`')}\``, false);
                if (command.permissions.userPerms && command.permissions.userPerms.length !== 0)
                    embed.addField(`Required Permission`, `\`\`\`\n${command.permissions.userPerms.join(' , ')}\n\`\`\``, false);
                if (command.permissions.clientPerms && command.permissions.clientPerms.length !== 0)
                    embed.addField(`Required Bot Permissions`, `\`\`\`\n${command.permissions.clientPerms.join(' , ')}\n\`\`\``, false)
                if (command.config.usage)
                    embed.addField(`Usage`, `\`\`\`html\n${command.config.usage}\n\`\`\``, false);

                return ctx.send({
                    embeds: [embed]
                });
            }
        }

        return ctx.send({
            embeds: [
                new MessageEmbed()
                    .setColor(ctx.client.data.embedColor)
                    .setTitle(`Help Menu`)
                    .setDescription(`**Join our [Support Server](${ctx.client.data.supportLink}) for help and updates!**\n\`\`\`xl\n/help [Command]\n\`\`\``)
                    .addField('📜 __Commands__', `\`${Array.from(ctx.client.commands.filter((c) => !c.permissions.botOwnerOnly && c.config.category?.toLowerCase() == 'general').keys()).join('`, `') || ' '}\``)
                    .setTimestamp()
            ]
        });
    }
}