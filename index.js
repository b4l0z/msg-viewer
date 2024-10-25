const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [
        'Guilds',
        'GuildMessages',
        'GuildMessageReactions',
        'MessageContent',
        'DirectMessages'
    ]
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

client.on('ready', () => {
    console.log('bot connecté');
});

client.on('messageCreate', msg => {
    let imageUrl = null;

    if (msg.attachments.size > 0) {
        msg.attachments.forEach((att) => {
            if (att.contentType && att.contentType.startsWith('image/')) {
                imageUrl = att.url;
            }
        });
    }

    io.emit('dscmsg', msg.content, msg.author.username, msg.channel.name, imageUrl);
});

client.login(require('./config/config.json').discordApiToken);
