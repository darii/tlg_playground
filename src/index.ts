import * as dotenv from 'dotenv'
dotenv.config({path: `${__dirname}/../.env`});

import {Telegraf, ContextMessageUpdate} from "telegraf";
const RutrackerApi = require('rutracker-api');
const telegraf = require('telegraf');
const extra = require('telegraf/extra')
const markup = extra.markdown()
const rutracker = new RutrackerApi();
const bot: Telegraf<ContextMessageUpdate> = new telegraf(process.env.TOKEN);

rutracker.login({username: process.env.RT_LOGIN, password: process.env.RT_PASSW})
    .then(() => {
        console.log('Authorized');
    })
    .catch(err => console.error(err));

bot.command('start', ctx => {
    ctx.replyWithSticker('CAADAgADOwEAAhZ8aAPWZAdpczcAAR8C')
        .catch(err => console.error(err));
    ctx.reply('Arrived at your disposal, Commander! Type anything.')
});
bot.on('text', ctx => {
    console.log('@' + ctx.message.from.username + ': "' + ctx.message.text + '"');
    // let searchTerm: string = ctx.message.text.substring(8);
    let searchTerm: string = ctx.message.text;
    let title: string;
    let torrentId: string;
    let category: string;
    let state: string;
    let seeds: number;
    let response:string;
    rutracker.search({query: searchTerm, sort: 'seeds', order: 'desc'})
        .then(torrents => {
            response = '===> Top-5 torrents:\n';
            torrents.forEach((item, index) => {
                if (index < 5) {
                    response += `${index + 1}. ${item.title.split('(', 1)}. ${item.seeds} seeds.\n`
                }
            });
            console.log(response);
            torrentId = torrents[0].id;
            title = torrents[0].title;
            category = torrents[0].category;
            state = torrents[0].state;
            seeds = torrents[0].seeds;
            response = title + ' (' + state + ') в категории "' + category + '", ' + seeds.toString() + ' seeds.';
            ctx.reply(response)
                .catch(err => console.error(err)
                );
            rutracker.getMagnetLink(torrentId)
                .then(
                    uri => ctx.reply('```\n' +  uri + '\n```', markup)
                )
                .catch(err => console.error(err));
        })
        .catch(err => {
            console.log('Bad query, cannot find anything special :(');
            ctx.replyWithSticker('CAADAgAD-gADyxkPAAFbFzf_Nf8KeQI');
        });
});

bot.on('sticker', ctx => {
    ctx.reply('👍')
});
bot.startPolling();

