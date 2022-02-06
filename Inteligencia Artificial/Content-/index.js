const axios = require('axios')

const api = axios.create({
    baseURL: 'https://moderationapi.com/api/v1/moderation/text'
})

const Discord = require('discord.js')

var id = '';
var cont = 1;

const bot = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
    ]
});

const tokenBot = 'OTM4NDEyMTAxMDk2MDU0Nzg1.Yfp6Xw.Pz9Ad_OcJS0iTe8DE8kBQ0bjj8o';

bot.login(tokenBot);
bot.on('ready', () => {
    console.log('estou pronto para ser usado')
})

bot.on('message', async msg => {

    const token1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZmJkZjAzNmNjNGY0MDAwOWJjZjJhOCIsInVzZXJJZCI6IjYxZmJkZWVmNmNjNGY0MDAwOWJjZjJhNiIsImlhdCI6MTY0Mzg5NjU3OX0.3g68SalFBazcx40RW8aare3U3Nx6G-O2XaiUygYEu7w'

    console.log(msg.content)
    api.post(' ',{
        value: msg.content
    },
    {
        headers: {
            'Authorization': 'Bearer ' + token1
        }
    }
    ).then(response => {
        var channelMsg = "_Mensagem apagada por apresentar conteúdo inapropriado_"
        var privateMsg = `*${msg.author.username}* Atenção! A mensagem que você enviou no canal ${msg.channel.name} foi apagada por ser ofensiva. Caso persista, você será kickado`

        if (response.data.toxicity.label_scores.TOXICITY > 0.70) {

            if (msg.author.id !== id) id = msg.author.id
            else cont = cont+1

            if (cont >= 3) {
                console.log(msg.member.kickable())
                msg.member.kick()
                msg.delete(10)
                .then(msg.channel.send(channelMsg))
            }
            
            else {
                msg.delete(10)
                .then(msg.channel.send(channelMsg))
                .then(msg.author.send(privateMsg))
            }
        }
        if (response.data.profanity.error !== undefined && msg.content != channelMsg) {
            var avisoIngles = `_Somente mensagem em inglês no canal ${msg.channel.name}!!_`
            msg.delete(10).then(msg.author.send(avisoIngles))
        }
    }).catch(erro => console.log(erro))
})