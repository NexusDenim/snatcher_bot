//**********************************************
//      AUTHOR: NEXUS DENIM
//**********************************************
const Discord = require('discord.js');
const {prefix,token} = require('./config.json');
const quote_lib = require('./helpers/quotes.json');
const helpers = require('./helpers/helper.js');
const client = new Discord.Client();

client.on('ready',() => { console.log('Ready'); });

client.on('message',message =>{
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    switch (command){
        case 'help':
            let help_fields = [
                {name: `${prefix}help`, value: 'Prints the Help which is here ofcourse!'},
                {name: `${prefix}quote`, value: 'A Random Quote'},
                {name: `${prefix}stats`, value: 'User Stats'},
            ];
            message.channel.send(embedded_message('Help','Prints Help','','',help_fields));
            break;
        case 'quote':
            let quote = quote_lib[helpers.getRandomInt(0,quote_lib.length)];
            message.channel.send(embedded_message((quote.author) ? quote.author : 'Quote:',quote.text));
            break;
        case 'stats':
            const user = message.author;
            let user_fields= [
                {name: 'Id : ', value: user.id},
                {name: 'Status : ', value: (user.bot) ? "Bot" : "Human"},
                {name: 'Suggested Emoji : ', value: helpers.getRandomEmoji()},
            ];
            message.channel.send(embedded_message(user.username,'','',user.displayAvatarURL({dynamic:true}),user_fields));
            break;
        default: message.channel.send(embedded_message('Bummer !!!','No Command Found like this'));
    }
});

client.login(token).then(()=>{console.log('Logged In');}).catch(()=>{console.log('Error Autentication Failed');});

function embedded_message(title,description,url='',image='',fields=[],thumbnail='',footer='Made For you'){
    let message = new Discord.MessageEmbed()
        .setColor(helpers.getRandomColor())
        .setTitle(title)
        .setDescription(description)
        .setTimestamp()
        .setFooter(footer);
    (url) ? message.setURL(url) : null;
    (thumbnail) ? message.setThumbnail(thumbnail) : null;
    (image) ? message.setImage(image) : null;
    (Array.isArray(fields) && fields.length) ? message.addFields(fields) : null;
    return message;
}

