require('dotenv').config();

const { Client, ApplicationCommandHandler } = require('jag-cmd-handler');
const { join } = require('path');
const DB = require('./db');
const messageFilter = require('./functions/messageFilter');

const fetchPromise = import('node-fetch');
const fetch = (...args) => fetchPromise.then((m) => m.default(...args));

global.fetch = fetch;

const client = new Client({
    disableDefaultReady: true,
    owners: ['461756834353774592'],
    data: {
        embedColor: '#0099ff',
        supportLink: 'https://discord.gg/RwBAAuAcMV',
        inviteLink: 'https://discord.com/api/oauth2/authorize?client_id=942059604383252530&permissions=27650&scope=bot%20applications.commands',
        regex: {
            url: /(?:(?:https?|ftp):\/\/)?((?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/(\S*))?/gi
        },
        sites: [],
        loghook: {
            id: process.env.LOGHOOKID,
            token: process.env.LOGHOOKTOKEN
        }
    }
});

client.db = DB;

client.handler = new ApplicationCommandHandler(client);

client.textCommandHandler.use(messageFilter);
client.applicationCommandHandler.use(client.db.loadGuildDB);
client.applicationCommandHandler.use(client.handler.handle.bind(client.handler));

client.init();
client.registerEvents(join(__dirname, 'events'));
client.registerCommands(join(__dirname, 'commands'));
client.login(process.env.TOKEN)