function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomEmoji(){
    let emoji = ['😀','😃','😄','😁','😆','😅','😂','☺️','😊','😇','🙂🙃','😉','😌','😍','🥰😘','😗','😙','😚','😋','😛','😝','😜','😎','🤩😏','😒','😞','😔','😟','😕','🙁☹️','😣','😖','😫'];
    return emoji[getRandomInt(0,emoji.length)];
}

function getUserFromMention(client,mention) {
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }

        return client.users.cache.get(mention);
    }
}

module.exports = {
    getRandomColor: () => {return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');},
    getConsoleColor: () => {return "\x1b["+getRandomInt(30,48)+"m%s\x1b[0m";},
    getRandomInt,getRandomEmoji,getUserFromMention
};