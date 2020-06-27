//**********************************************
//      AUTHOR: NEXUS DENIM
//**********************************************
const Discord = require('discord.js');
const {prefix,token,covid,qod} = require('./config.json');
const quote_lib = require('./helpers/quotes.json');
const helpers = require('./helpers/helper.js');
const random_greeting = require('random-greetings');
const {curly,Curl} = require('node-libcurl');
const client = new Discord.Client();

client.on('ready',() => { console.log('Ready'); });

client.on('message',async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    switch (command){
        case 'help':
            let help_fields = [
                {name: `${prefix}help`, value: 'Prints the Help which is here ofcourse!'},
                {name: `${prefix}quote random/today`, value: 'A Quote for you to inspire, Today or Random'},
                {name: `${prefix}stats user_mention`, value: 'Stats of mentioned User'},
                {name: `${prefix}greet`, value: 'Greetings to User'},
                {name: `${prefix}ping`, value: 'Ping back'},
                {name: `${prefix}covid country_name`, value: 'Covid 19 Report for Country'},
            ];
            message.channel.send(embedded_message('Help','Prints Help','','',help_fields));
            break;
        case 'quote':
            let quote_switch = (args.length == 0 || args[0] == '') ? 'random' : args[0];
            switch (quote_switch){
                case 'today':
                    const curl = new Curl();
                    curl.setOpt('URL', qod);
                    curl.setOpt('FOLLOWLOCATION', true);
                    curl.on('end', function (statusCode, data, headers) {
                        data = JSON.parse(data);
                        let quote_data = data.contents.quotes[0];
                        message.channel.send(embedded_message(quote_data.title,quote_data.quote,'','',[],'',quote_data.author));
                        this.close();
                    });
                    curl.on('error', ()=>{curl.close.bind(curl);return;});
                    curl.perform();
                    break;
                default:
                    let quote = quote_lib[helpers.getRandomInt(0,quote_lib.length)];
                    message.channel.send(embedded_message((quote.author) ? quote.author : 'Quote:',quote.text));
            }
            break;
        case 'stats':
            const user = (args.length == 0 || args[0] == '') ? message.author : helpers.getUserFromMention(client,args[0]);
            if(!user){message.channel.send('Invalid User'); return;}
            let user_fields= [
                {name: 'Id : ', value: user.id},
                {name: 'Status : ', value: (user.bot) ? "Bot" : "Human"},
                {name: 'Suggested Emoji : ', value: helpers.getRandomEmoji()},
            ];
            message.channel.send(embedded_message(user.username,'','',user.displayAvatarURL({dynamic:true}),user_fields));
            break;
        case 'greet':
            message.channel.send(embedded_message(random_greeting.greet(),''));
            break;
        case 'ping':
            message.channel.send('Pong');
            break;
        case 'covid':
            let country = (args.length == 0 || args[0] == '') ? 'pakistan' : args[0];
            const curl = new Curl();
            curl.setOpt('URL', covid+country);
            curl.setOpt('FOLLOWLOCATION', true);
            curl.on('end', function (statusCode, data, headers) {
                if(statusCode === 200){
                    console.log('Valid Country')
                    let covid_data = JSON.parse(data);
                    let covid_fields = [
                        {name: "Cases:",value: covid_data.report.cases},
                        {name: "Deaths:",value: covid_data.report.deaths},
                        {name: "Recovered:",value: covid_data.report.recovered},
                    ];
                    message.channel.send(embedded_message(country.toUpperCase(),'','','',covid_fields,covid_data.report.flag));
                } else {message.channel.send('Invalid Country');}
                this.close();
            });
            curl.on('error', ()=>{curl.close.bind(curl);return;});
            curl.perform();
            break;
        default: message.channel.send(embedded_message('Bummer !!!','No Command Found like this'));
    }
});

client.login(token).then(()=>{console.log('Logged In');}).catch(()=>{console.log('Error Autentication Failed');});

function embedded_message(title,description,url='',image='',fields=[],thumbnail='',footer='Made By Nexus'){
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

