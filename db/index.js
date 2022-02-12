const { Utils } = require('jag-cmd-handler');
const Guild = require('./Guild');
const Mongoose = require('mongoose');
const host = process.env.DB_HOST,
    user = process.env.DB_USER,
    password = process.env.DB_PASS,
    srv = process.env.DB_ISSRV == 'true';

Mongoose.connect(`mongodb${srv ? '+srv' : ''}://${user}:${password}@${host}`, {
    useNewUrlParser: true,
    dbName: 'antiphishing'
}).then(() => Utils.logger.success('DB Connected')).catch(console.err);

module.exports = Mongoose;

module.exports.Guild = Guild;

module.exports.loadGuildDB = async (client, source, next) => {
    const data = await Guild.findOne({
        id: source.guild.id
    });

    source.guild.db = data || await Guild.create({
        id: source.guild.id
    });

    return next?.();
};