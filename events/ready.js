const { BaseEvent, Client } = require('jag-cmd-handler');

module.exports = class ReadyEvent extends BaseEvent {
    constructor() {
        super('ready');
    }

    /**
     *
     * @param {Client} client
     */
    async run(client) {
        client.data.sites = await fetch('https://phish.sinking.yachts/v2/all').then((data) => data.json());

        await Promise.all(
            client.guilds.cache.map(async (guild) => {
                await client.registerApplicationCommands(guild).catch(() => { });
            }));

        client.log.success(`Logged in as ${client.user.tag}!`);

        client.user.presence.set({
            activities: [
                {
                    name: 'for Phishing Links...',
                    type: 'WATCHING'
                }
            ]
        })

        setInterval(async () => {
            client.data.sites = await fetch('https://phish.sinking.yachts/v2/all').then((data) => data.json());
        }, 36e5);
    }
}