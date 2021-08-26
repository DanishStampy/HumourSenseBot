const { Client, Intents, MessageEmbed } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const { prefix } = require("./config.json");

const commandType = require("./comm.json");
const collectionJokes = require("./collection.json");

client.on("ready", () => {
  console.log("The client is ready!");

  client.user.setActivity(`${prefix}help for guide`, { type: 'WATCHING', url: 'https://discordapp.com/' });
});

let lastIndex = -1;

client.on("message", (message) => {
  let { content } = message;
  content = content.toLowerCase().split(' ').join(''); //trim the message 

  //if msg from bot or no prefix - return
  if(message.author.bot || !content.startsWith(prefix)) return;

  //help command
  if(content === `${prefix}help`){
    const logo = 'https://pendek.me/dBcCd'
    const embedHelp = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Humour Bot Help')
      .setDescription('Make sure each command need to starts with `j!`\nBelow are commands that available for now:')
      .addFields(
        {name: 'dad 👴🏻', value: '```To get random of daddy jokes. Not that funny but still able to make people laugh.```', inline: true},
        {name: 'dark 👩🏿‍🦲', value: '```To get random of dark jokes. If you are sensitive person, please ignore this command.```', inline: true},
        {name: 'funny 😂', value: '```To get random of nomal jokes. Yeah, for noobs.```', inline: true},
        {name: '200iq 🧠', value: '```To get random of intelligent jokes. Mostly related to science, math and programming.```', inline: true},
        {name: 'nsfw 🔞', value: '```To get random of 18+ jokes for horny human.```', inline: true},
        {name: 'help 📜', value: '```To get a list of commands```', inline: true},
      )
      .setTimestamp()
      .setFooter('Command j!help', logo)

    message.channel.send({ embeds: [embedHelp] })
  }

  //wrong command
  else if(!collectionJokes.hasOwnProperty(content.substring(2)) && content.startsWith(prefix)){

    let randomIndex = Math.floor(
      Math.random() * (collectionJokes['errorMsg'].length)
    );
    message.channel.send(collectionJokes['errorMsg'][randomIndex])
  }
  
  //correct command
  commandType.command.forEach((command) => {
    const commMes = `${prefix}${command}`;

    if (content.startsWith(`${commMes} `) || commMes === content) {
      let randomIndex = Math.floor(
        Math.random() * (collectionJokes[command].length)
      );

      if(lastIndex === randomIndex){
        lastIndex = randomIndex;
        ++randomIndex;
      }
      
      let jokesMessage = collectionJokes[command][randomIndex];
      const arrJokes = jokesMessage.match(/[^\.!\?]+[\.!\?]+/g);
      
      let finalJokes = "";
      arrJokes.forEach(msg => {
        finalJokes = finalJokes + msg.trim() +'\n'
      })
      
      let emoIndex = Math.floor(
        Math.random() * (collectionJokes.funnyEmo.length)
      );
      
      if(commMes === `${prefix}nsfw`){
        message.reply(finalJokes)
      }else{
        message.channel.send(finalJokes).then(sent => {
          sent.react(collectionJokes.funnyEmo[emoIndex])
          sent.react(collectionJokes.sadEmo[emoIndex])
        })
      }
    }
  });
});

/*command(client, commandType.command, message => {
      if(commandType.command == 'dad')
      message.channel.send('Dad Jokes Incoming!')
    else
      message.channel.send('OTW')
  })*/

client.login(process.env.token);
