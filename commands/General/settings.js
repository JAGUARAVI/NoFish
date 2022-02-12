const { BaseCommand, Client } = require('jag-cmd-handler');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Builder = require('@discordjs/builders');

module.exports = class Command extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'settings',
                aliases: ['config', 'setting'],
                description: 'Displays a list of settings.',
                usage: '',
                nsfw: false,
                cooldown: 10,
                args: false,
                deleteAuthorMessage: false,
                protected: false,
                commandType: 0,
                commandOptions: [
                    new Builder.SlashCommandSubcommandBuilder()
                        .setName('all')
                        .setDescription('Displays all settings.')
                        .toJSON(),

                    new Builder.SlashCommandSubcommandBuilder()
                        .setName('punishment')
                        .setDescription('Displays/Sets - Punishment.')
                        .addIntegerOption(
                            new Builder.SlashCommandIntegerOption()
                                .setName('punishment')
                                .setDescription('The punishment to give to users who send a phishing link.')
                                .addChoices([['Delete Message', 0], ['Delete Message and Kick User', 1], ['Delete Message and Ban User', 2]])
                        ).toJSON(),

                    new Builder.SlashCommandSubcommandBuilder()
                        .setName('logschannel')
                        .setDescription('Displays/Sets - Logs channel.')
                        .addChannelOption(
                            new Builder.SlashCommandChannelOption()
                                .setName('channel')
                                .setDescription('The channel to send logs of phishing messages to.')
                                .setRequired(false)
                                .addChannelTypes([0, 5, 6])
                        ).toJSON(),

                    new Builder.SlashCommandSubcommandBuilder()
                        .setName('deletenotification')
                        .setDescription('Displays/Toggles - Delete notification.')
                        .addBooleanOption(
                            new Builder.SlashCommandBooleanOption()
                                .setName('enabled')
                                .setDescription('Whether to delete the notification which says that a phishing message was deleted.')
                                .setRequired(false)
                        ).toJSON(),
                ]
            },
            permissions: {
                userPerms: ['MANAGE_GUILD'],
                clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
                serverOwnerOnly: false,
                botOwnerOnly: false
            }
        });
    }

    /**
     *
     * @param {Object} ctx
     * @param {Client} ctx.client
     */
    async run(ctx) {
        const command = ctx.isCommand ? (ctx.source.options.getSubcommandGroup(false) ?? ctx.source.options.getSubcommand(false)) : ctx.args[0];
        switch (command?.toLowerCase()) {
            case 'punishment': {
                const value = ctx.isCommand ? ctx.source.options.getInteger('punishment') : Number(ctx.args[1]);
                if (value == undefined) {
                    ctx.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(ctx.client.data.embedColor)
                                .setTitle('Settings - ⛔ Punishment')
                                .setDescription('Changes the punishment to give to users who send a phishing link.')
                                .addField('📄 Current Setting', `\`${ctx.source.guild.db.settings.punishment == 0 ? 'Delete Message' : ctx.source.guild.db.settings.punishment == 1 ? 'Delete Message and Kick Member' : 'Delete Message and Ban Member'}\``)
                                .addField('✏️ Update', '`/settings punishment [0 | 1 | 2]`')
                                .addField('✅ Valid Settings', '`0 = Delete Message, 1 = Delete Message and Kick Member, 2 = Delete Message and Ban Member`')
                        ],
                        allowedMentions: {
                            parse: []
                        }
                    });
                    break;
                } else {
                    if (value < 0 || value > 2) {
                        ctx.reply({ content: ':x: **Punishment must be either \`0\` or \`1\` or \`2\`.**', allowedMentions: { parse: [] } });
                        break;
                    }
                    ctx.source.guild.db.settings.punishment = value;
                    await ctx.source.guild.db.save();
                    ctx.reply({ content: `✅ **I will now ${value == 0 ? 'delete the message' : value == 1 ? 'delete the message and kick the member' : 'delete the message and ban the member'} when someone sends a phishing link.**`, allowedMentions: { parse: [] }, delete: false });
                }
                break;
            }
            case 'logschannel': {
                const value = ctx.isCommand ? ctx.source.options.get('channel')?.channel : ctx.client.resolve.channel(ctx.args[1], ctx.source.guild);
                if (!value) {
                    ctx.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(ctx.client.data.embedColor)
                                .setTitle('Settings - 📜 Logs Channel')
                                .setDescription('Changes the channel to send logs of phishing messages to.')
                                .addField('📄 Current Logs Channel', `<#${ctx.source.guild.db.settings.modChannel}>`)
                                .addField('✏️ Update', '`/settings logschannel [Channel]`')
                                .addField('✅ Valid Settings', '`Any mentioned text channel (e.g. #general)`')
                        ],
                        allowedMentions: {
                            parse: []
                        }
                    });
                    break;
                } else {
                    ctx.source.guild.db.settings.modChannel = value.id;
                    await ctx.source.guild.db.save();
                    ctx.reply({ content: `✅ **I will now send logs of phishing messages to <#${value.id}>.**`, allowedMentions: { parse: [] }, delete: false });
                }
                break;
            }
            case 'deletenotification': {
                const value = ctx.isCommand ? ctx.source.options.getBoolean('enabled') : ctx.args[1]?.toLowerCase();
                if (value === undefined) {
                    ctx.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(ctx.client.data.embedColor)
                                .setTitle('Settings - 🗑️ Delete notification')
                                .setDescription('Whether to delete the notification which says that a phishing message was deleted.')
                                .addField('📄 Current Setting', `\`${ctx.source.guild.db.settings.deleteNotification ? 'on' : 'off'}\``)
                                .addField('✏️ Update', '`/settings deletenotification [on/off]`')
                                .addField('✅ Valid Settings', '`on , off`')
                        ],
                        allowedMentions: {
                            parse: []
                        }
                    });
                    break;
                } else {
                    ctx.source.guild.db.settings.deleteNotification = value === 'on' || value === true;
                    await ctx.source.guild.db.save();
                    ctx.reply({ content: `✅ **Delete notification is now ${value === 'on' || value === true ? 'on' : 'off'}.**`, allowedMentions: { parse: [] }, delete: false });
                }
                break;
            }
            case 'reset': {
                const identifier = Date.now() + Math.floor(Math.random() * 100000);
                ctx.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(ctx.client.data.embedColor)
                            .setTitle('Settings - ♻️ Reset')
                            .setDescription('⚠️ **Warning ⚠️\nThis will reset all the bot settings to their default values.**\nIf you want to continue press on continue or cancel.')
                    ],
                    components: [
                        new MessageActionRow({
                            components: [
                                new MessageButton()
                                    .setCustomId(identifier.toString() + '-yes')
                                    .setLabel('Continue')
                                    .setStyle('DANGER')
                                    .setEmoji('⚠️'),

                                new MessageButton()
                                    .setCustomId(identifier.toString() + '-no')
                                    .setLabel('Cancel')
                                    .setStyle('SECONDARY')
                                    .setEmoji('❌')
                            ]
                        })
                    ],
                    allowedMentions: {
                        parse: []
                    }
                });

                const reply = await new Promise((res) => {
                    const collector = ctx.source.channel.createMessageComponentCollector({ time: 12e4, type: 'BUTTON' });

                    collector.on('collect', (interaction) => {
                        if (interaction.customId !== identifier.toString() + '-yes' && interaction.customId !== identifier.toString() + '-no') return;
                        if (interaction.user.id === ctx.source.user.id) {
                            interaction.deferUpdate();
                            return res(interaction.customId === identifier.toString() + '-yes');
                        } else {
                            return interaction.reply({
                                content: `❌ **Only <@${ctx.source.user.id}> can use this.**`,
                                ephemeral: true,
                            });
                        }
                    });
                });

                if (reply == true) {
                    ctx.source.guild.db.settings = {
                        punishment: 1,
                        modChannel: '',
                        deleteNotification: false
                    };
                    await ctx.source.guild.db.save();
                    ctx.reply({ content: `✅ **Reset the bot settings to their default values**`, embeds: [], allowedMentions: { parse: [] }, delete: false });
                } else {
                    ctx.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor('BLUE')
                                .setDescription('Operation Cancelled')
                        ],
                        allowedMentions: {
                            parse: []
                        }
                    });
                }
                break;
            }
            default: {
                ctx.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(ctx.client.data.embedColor)
                            .setTitle('Settings')
                            .setDescription(`Use the command format \`/settings <option>\` to view more info about an option.`)
                            .addField('⛔ Punishment', '`/settings punishment [0 | 1 | 2]`')
                            .addField('📜 Logs Channel', '`/settings logschannel [Channel]`')
                            .addField('🗑️ Delete notification', '`/settings deletenotification [on/off]`')
                            .addField('♻️ Reset', '`/settings reset`', true)
                    ],
                    allowedMentions: {
                        parse: []
                    },
                });
                break;
            };
        }
    }
}