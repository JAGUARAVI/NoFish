const { BaseCommand } = require('jag-cmd-handler');
const { join } = require('path');

module.exports = class Command extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'reload',
                aliases: [],
                description: 'Reloads a command.',
                usage: '<command>',
                nsfw: false,
                cooldown: 10,
                args: true,
                deleteAuthorMessage: true,
                protected: true,
                commandOptions: [
                    {
                        type: 'STRING',
                        name: 'command',
                        required: true,
                        description: 'The command to reload'
                    }
                ]

            },
            permissions: {
                userPerms: [],
                clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
                serverOwnerOnly: false,
                botOwnerOnly: true
            }
        });
    }

    async run(ctx) {
        const commandName = ctx.isCommand ? ctx.source.options.get('command')?.value?.toLowerCase() : ctx.args[0]?.toLowerCase();
        const command = ctx.client.commands.get(commandName)
            || ctx.client.commands.find(cmd => cmd.config.aliases && cmd.config.aliases.includes(commandName));

        if (!command) {
            return ctx.send({
                content: `There is no command with name or alias \`${commandName}\`, ${ctx.source.user}!`,
                allowedMentions: {
                    parse: []
                },
                delete: false
            }).then((msg) => setTimeout(() => msg.delete().catch(() => { }), 10000));
        } else if (command.config.protected) {
            return ctx.send({
                content: `The command is protected!`,
                allowedMentions: {
                    parse: []
                },
                delete: false
            }).then((msg) => setTimeout(() => msg.delete().catch(() => { }), 10000));
        }

        try {
            let file = join(__dirname, '..', `${command.config.category}`, `${command.config.name}.js`);

            delete require.cache[require.resolve(file)];
            const reqCommand = require(file);
            const newCommand = new reqCommand();
            newCommand.config.category = command.config.category;
            ctx.client.commands.set(newCommand.config.name, newCommand);

            ctx.send({
                content: `Command \`${command.config.name}\` was reloaded!`,
                allowedMentions: {
                    parse: []
                },
                delete: false
            }).then(msg => setTimeout(() => msg.delete().catch(() => { }), 10000));
            ctx.client.log.warn(`Reloaded ${command.config.name} command`);
        } catch (error) {
            throw new Error(error);
        }
    }
}