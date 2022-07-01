const Discord = require('discord.js');
const client = new Discord.Client()
const moment = require("moment-timezone");
const fetch = require('node-fetch');
const cfg = require("./config.json");

client.on("ready", async () => {
    client.user.setActivity(cfg.status)
    console.log("Bot olarak girdim hadi spamla koçum beni")
})

class Shelby {
    constructor() {
        this.shelbyInterval;
    }

    async setVanityURL(url, guild) {
        const time = moment.tz(Date.now(), "Europe/Istanbul").format("HH:mm:ss");
        console.log(`[${time}] [${url}] adlı URL spamlanıyor`);
        return await fetch(`https://discord.com/api/v8/guilds/${guild.id}/vanity-url`, {
            "credentials": "include",
            "headers": {
                "accept": "*/*",
                "authorization": "Bot " + client.token,
                "content-type": "application/json",
            },
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": JSON.stringify({
                "code": url
            }),
            "method": "PATCH",
            "mode": "cors"
        });
    }
    async checkVanityURL(url) {
        return await fetch(`https://discord.com/api/v8/guilds/${guild.id}/vanity-url`, {
            "credentials": "include",
            "headers": {
                "accept": "*/*",
                "authorization": "Bot " + client.token,
                "content-type": "application/json",
            },
            "referrerPolicy": "no-referrer-when-downgrade",
            "method": "GET",
            "mode": "cors"
        });
    }

    async startURL(url, guild) {
        this.shelbyInterval = setInterval(async () => {
            await this.setVanityURL(url, guild);
        }, 1*1000);
    }

    stopURL() {
        return clearInterval(this.shelbyInterval);
    }
}

let sex = new Shelby();

client.on('message', async (message) => {
     let messageArray = message.content.split(" ")
     const args = messageArray.slice(1);
     const args1 = message.content.slice(cfg.prefix.length).split(/ +/)
     const command = args1.shift().toLowerCase();

    if (command === "sik") {
        if(!cfg.owner.includes(message.author.id)) return

        let url = args[0];
        if(!url) return message.channel.send(`Ne spamlicaz baba bişi yemle`)

        if (!message.guild.features.includes('VANITY_URL')) {
            return message.channel.send("x");
        }

        message.channel.send(`**${url}** adlı URL spamlanıyor.`);

        console.log(`URL spamlamayı ${url} olarak ayarladım !`);
        await sex.startURL(url, message.guild);
    } if (command === "bitir") {
        if(!cfg.owner.includes(message.author.id)) return

        sex.stopURL();

        message.channel.send(`Durdum, belim ağrıyor dayı.`)

        console.log(`Durdum amk`)
    } if (command === "kontrol") {
        if(!cfg.owner.includes(message.author.id)) return

    message.channel.send(`pingim: **${client.ws.ping}**`)
    };
});

client.login(cfg.token).then(x => console.log("Tokenim Kalktı")).catch(e => console.error("Tokenim indi"))
