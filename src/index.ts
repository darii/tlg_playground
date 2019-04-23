import * as dotenv from 'dotenv'
import {Telegraf, ContextMessageUpdate} from "telegraf";
const telegraf = require('telegraf');
dotenv.config({path: `${__dirname}/../.env`});
const bot: Telegraf<ContextMessageUpdate> = new telegraf(process.env.TOKEN);
bot.on('text', ctx => {
    console.log('@' + ctx.message.from.username + ': "' + ctx.message.text + '"');
    // do action here
    // ctx.reply(ctx.message.text)
});
bot.startPolling();
console.log('Welcome to ' + process.env.APP_ID);
