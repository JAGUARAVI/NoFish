const { Client } = require('jag-cmd-handler');
const { Message, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { loadGuildDB } = require('../db');
/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {() => void} next
 * @returns {any}
 */

module.exports = messageFilter = async (client, message, next) => {
    if (message.author.bot) return next();
    const content = message.content;

    if (!content) return next();

    const urls = content.match(client.data.regex.url);
    if (urls) {
        const badUrls = [];
        urls.map((url) => url.match(new RegExp(client.data.regex.url, [])))?.map((item) => {
            try {
                if (!item) return;
                const [str, domain, path] = item;

                if (client.data.sites.includes(domain)) {
                    badUrls.push(str);
                }
            }
            catch (e) {
                client.log.error(e);
            }
        });

        if (badUrls.length) {
            await client.db.loadGuildDB(client, message);
            if (message.deletable) message.delete().catch(() => {});
            else message.channel.send({
                content: `:x: **The message could not be deleted.** Please check my perissions!`,
            });

            message.channel.send(`${message.author.toString()} (${message.author.tag}) sent a phishing link.`).then((msg) => setTimeout(() => message.guild.db.settings.deleteNotification ? msg.delete() : null, 60000));

            const punishment = 'Message Deleted' + (message.guild.db.settings.punishment == 1 && message.member.kickable ? ' and Member Kicked' : message.guild.db.settings.punishment == 2 && message.member.bannable ? ' and Member Banned' : '');

            await message.author.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setTitle('Phishing Link Detected')
                        .setDescription(`You sent a phishing link in the server - \`${message.guild.name}\`.\n\n**If this action was not done by you, there is a high chance that your account got HACKED.\nHackers would have got unauthorizes access to your account.** (Did you run a script which someone sent you?)\n\n**You should __RESET YOUR DISCORD ACCOUNT PASSWORD ASAP__.**`)
                        .addField('Punishment', `Due to this, you have been given the following punishment: \`${punishment}\`.`)
                        .addField('Link Detected', `||${badUrls.join('||, ||')}||`, true)
                        .setThumbnail(message.guild.iconURL())
                ]
            });

            switch (message.guild.db.settings.punishment) {
                case 1:
                    if (message.member.kickable) message.member.kick('Phishing Link').catch(() => { });
                    break;
                case 2:
                    if (message.member.bannable) message.member.ban({ reason: 'Phishing link', days: 0 }).catch(() => { });
                    break;
                default:
                    break;
            }

            const channel = client.resolve.channel(message.guild.db.settings.modChannel, message.guild);
            if (channel) {
                channel.send?.({
                    embeds: [
                        new MessageEmbed()
                            .setTitle('Phishing Link Detected')
                            .setColor('RED')
                            .setDescription(`${message.author.tag} (${message.author.id}) sent a phishing link in <#${message.channel.id}>.`)
                            .addField('Links', `||${badUrls.join('||, ||')}||`)
                            .addField('Punishment', punishment)
                            .setFooter({ text: `Message ID: ${message.id}`, iconURL: message.author.avatarURL() })
                    ],
                    components: [
                        new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setLabel('Report False Positive')
                                    .setStyle('SECONDARY')
                                    .setCustomId(`report-${message.id}`)
                                    .setEmoji('🤔')
                            ])
                    ]
                });
            }
        }
    }
    return next();
};