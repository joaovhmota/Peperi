console.time('peperi');

import Discord, { Intents, GuildMember, Guild, BanOptions } from "discord.js";
import commands from "./commands.json";
import dotenv from "dotenv";
dotenv.config();
var afkUsers : Array<GuildMember> = [];

const client = new Discord.Client({
     intents: [
          Intents.FLAGS.GUILDS,
          Intents.FLAGS.GUILD_MEMBERS,
          Intents.FLAGS.GUILD_MESSAGES,
          Intents.FLAGS.GUILD_PRESENCES
     ]
});

client.on('ready', async () => {
     console.log(`Logged as: ${client.user?.tag}`);
     client.user!.setPresence(
          {  
               status: "online", // online, idle, invisible, dnd
               activities: [
                    {
                         name: `今、私は${client.guilds.cache.size}サーバーに参加しています。`,
                         type: "PLAYING" // PLAYING, STREAMING, LISTENING, WATCHING
                    }
               ]
          }
     );

     const peperiCommands: any = commands.commandsList;

     let servidoresPeperinha = [
          "321417546421239819", // Restaurante Peperas
          "459831319481024522", // Servidor do Quack
          "696801771460493343" // Hiluup's Ender Chest
     ];
     servidoresPeperinha.forEach( async guildID => {
          await client.guilds.cache.get(guildID)?.commands.set(peperiCommands);
     });

     console.log(`\n参加サーバー:`);
     
     client.guilds.cache.forEach( (server) => {
          console.log(`-> ${server.name} (${server.id})`);
     });
});

client.on('interactionCreate', async (interaction) => {
     if ( !interaction.isCommand() ) return;
     switch (interaction.commandName) {
          case 'ping':
               var pongEmbed = new Discord.MessageEmbed()
                    .setColor("#ffffff")
                    .setFooter(interaction.user.tag)
                    .setTimestamp(new Date().getTime())
                    .setTitle("Pong!");
               
               interaction.reply({
                    embeds: [pongEmbed],
                    ephemeral: true
               });
               break;

          case 'avatar':
               var toGetuser = interaction.options.getMember("user") as GuildMember;
               var isEphemeral = interaction.options.getBoolean("ephemeral") || false;
               var avatarEmbed = new Discord.MessageEmbed()
                    .setColor("#ffffff")
                    .setFooter(interaction.user.tag)
                    .setTimestamp(new Date().getTime())
                    .setTitle(`🖼 Avatar do「${toGetuser.user.tag}」`)
                    .setImage(`${toGetuser.user.avatarURL({ format: "png", dynamic: true, size: 1024 })}`);
               interaction.reply({
                    embeds: [avatarEmbed],
                    ephemeral: isEphemeral
               });
               break;

          case 'rpgdice':
               var diceLimit = interaction.options.getNumber("dice") || 1;
               var diceModifier = interaction.options.getNumber("modifier") || 0;
               var bruteResult = Math.floor(1 + Math.random() * (diceLimit));

               var diceEmbed = new Discord.MessageEmbed()
                    .setColor("#ffffff")
                    .setFooter(interaction.user.tag)
                    .setTimestamp(new Date().getTime())
                    .setTitle(`🎲 **Resultado Final:** ${bruteResult + diceModifier}`)
                    .setDescription(`**Resultado Bruto:** ${bruteResult}\n **Dado:** d${diceLimit}\n **Modificador:** ${diceModifier}`);

               interaction.reply({
                    embeds: [diceEmbed],
                    ephemeral: false
               });
               break;

          case 'calc':
               var calcExpression = interaction.options.getString("expression") || "0";
               var calcEmbed = new Discord.MessageEmbed()
                    .setColor("#ffffff")
                    .setFooter(interaction.user.tag)
                    .setTimestamp(new Date().getTime())
                    .setTitle(`🧮 **Resultado:** ${eval(calcExpression)}`)
                    .setDescription(`**Expressão:** ${calcExpression}`);
               interaction.reply({
                    embeds: [calcEmbed],
                    ephemeral: false
               });
               break;

          case 'choose':
               var choiseString = interaction.options.getString('to_choose') ?? "";
               var choiseArray = choiseString.split(', ');

               var choiseEmbed = new Discord.MessageEmbed()
                    .setColor("#ffffff")
                    .setFooter(interaction.user.tag)
                    .setTimestamp(new Date().getTime())
                    .setTitle(`🤔 Item escolhido: ${choiseArray[Math.floor(Math.random() * choiseArray.length)]}`);

                    interaction.reply({
                         embeds: [choiseEmbed],
                         ephemeral: false
                    });
               break;
               
          case 'userinfo':
               var toGetuser = interaction.options.getMember("user") as GuildMember;
               var userInfoEmbed = new Discord.MessageEmbed()
                    .setColor("#ffffff")
                    .setFooter(interaction.user.tag)
                    .setTimestamp(new Date().getTime())
                    .setTitle(`📋 Informações do usuário:`)
                    .setThumbnail(`${toGetuser.user.avatarURL({ format: "png", dynamic: true, size: 1024 })}`)
                    .addFields(
                         [
                              {
                                   name  : "🎭 Nome | Apelido: ",
                                   value : `${toGetuser.user.username} | ${toGetuser.nickname ?? "<Sem apelido> "}`,
                              },
                              {
                                   name  : "🆔 ID: ",
                                   value : `${toGetuser.user.id}`,
                              },
                              {
                                   name  : "📅 Conta criada em:",
                                   value : `${toGetuser.user.createdAt.toLocaleString()}`,
                              }
                         ]
                    );
               
               interaction.reply({
                    embeds: [userInfoEmbed],
                    ephemeral: false
               });
               break;

          case 'serverinfo':
               var toGetServer = interaction.guild as Guild;
               var serverInfoEmbed = new Discord.MessageEmbed()
                    .setColor("#ffffff")
                    .setFooter(interaction.user.tag)
                    .setTimestamp(new Date().getTime())
                    .setTitle(`📋 Informações do servidor:`)
                    .setThumbnail(`${toGetServer.iconURL({ format: "png", dynamic: true, size: 1024 })}`)
                    .addFields(
                         [
                              {
                                   name  : "🎭 Nome: ",
                                   value : `${toGetServer.name}`,
                              },
                              {
                                   name  : "🆔 ID: ",
                                   value : `${toGetServer.id}`,
                              },
                              {
                                   name  : "📅 Criado em:",
                                   value : `${toGetServer.createdAt.toLocaleString()}`,
                              },
                              {
                                   name  : "🗿 Membros:",
                                   value : `${toGetServer.memberCount}`,
                              }
                         ]
                    );
               interaction.reply({
                    embeds: [serverInfoEmbed],
                    ephemeral: false
               });
               break;
          
          default:
               break;
     }
});

client.on('messageCreate', async (message) => {
     if (message.author.bot) return;
     if (message.mentions.everyone) message.reply('> Mamãe disse que eu não sou todo mundo!');
});

client.login( process.env.TOKEN );

console.timeEnd('peperi');