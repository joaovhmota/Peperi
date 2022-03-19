import Discord, { Intents, GuildMember, Guild, BanOptions } from "discord.js";
import commands from "./commands.json";
import dotenv from "dotenv";
dotenv.config();

const client = new Discord.Client({
     intents: [
          Intents.FLAGS.GUILDS,
          Intents.FLAGS.GUILD_MEMBERS,
          Intents.FLAGS.GUILD_MESSAGES,
          Intents.FLAGS.GUILD_PRESENCES
     ]
});

function interactionMemberHasPermission(interaction: Discord.Interaction<Discord.CacheType>, permission: Discord.PermissionResolvable)
{
     let member = interaction.member as GuildMember;
     if ( !member.permissions.has(permission) )
     {    
          return false;
     }
     else 
     {
          return true;
     }
}

const denyCommand = ( interaction: Discord.CommandInteraction<Discord.CacheType> ): void => {
     const denyCommandEmbed = new Discord.MessageEmbed()
          .setColor("RANDOM")
          .setFooter( interaction.user.tag )
          .setTimestamp( new Date().getTime() )
          .setTitle("Comando rejeitado")
          .setDescription("Parece que você não tem permissão para usar esse comando :(");
     interaction.reply({
          ephemeral: true,
          embeds: [denyCommandEmbed]
     });
}

client.on("ready", async () => {
     console.log(`Logged as: ${client.user?.tag}`);

     /*
     const data: any = [
          {
               name: "help",
               description: "Mostra a lista de comandos da Peperinha"
          },
          {
               name: "commands",
               description: "Mostra a lista de comandos da Peperinha"
          },
          {
               name: "ping",
               description: "Responde com pong"
          },
          {
               name: "echo",
               description: "Repete o que você falar",
               options: [{
                    name: "frase",
                    type: "STRING",
                    description: "frase que será repetidada",
                    required: true
               }]
          },
          {
               name: "calc",
               description: "Realiza uma operação matemática",
               options: [{
                    name: "expression",
                    type: "STRING",
                    description: "calculo que será realizado",
                    required: true 
               }]
          },
          {
               name: "r34",
               description: "Famosa R34...",
               options: [{
                    name: "personagem",
                    type: "STRING",
                    description: "nome da personagem para buscar o molho",
                    required: true
               },
               {
                    name: "public",
                    type: "BOOLEAN",
                    description: "true se quiser que o pessoal veja | false se quiser deixar privado",
                    required: false
               }]
          }
     ];
     */
     
     const data: any = commands.commandsList;

     let servidoresPeperinha = [
          "321417546421239819", // Restaurante Peperas
          "459831319481024522", // Servidor do Quack
          "696801771460493343" // Hiluup's Ender Chest
     ];
     servidoresPeperinha.forEach( async guildID => {
          await client.guilds.cache.get(guildID)?.commands.set(data);
     });
     //let command = await client.guilds.cache.get("459831319481024522")?.commands.set(data);
});

client.on("interactionCreate", async interaction => {
     if ( !interaction.isCommand() ) return;

     // Rejeitar o Quack na Peperinha
     if ( interaction.user.id == "491980411069792266" )
     {
          let rejectQuackEmbed = new Discord.MessageEmbed()
               .setColor("RANDOM")
               .setFooter( interaction.user.tag )
               .setTimestamp( new Date().getTime() )
               .setTitle("Não aceito comando de gays, desculpa");
          interaction.reply({
               embeds: [rejectQuackEmbed]
          });
     }
     if ( interaction.commandName === "help" || interaction.commandName === "commands")
     {
          let helpEmbed = new Discord.MessageEmbed()
               .setColor("RANDOM")
               .setFooter( interaction.user.tag )
               .setTimestamp( new Date().getTime() )
               .setThumbnail( `${client.user?.displayAvatarURL({dynamic: true, size:512})}` )
               .addFields([
                    {
                         name: "/ping",
                         value: "Responde com pong."
                    },
                    {
                         name: "/echo",
                         value: "Repete a mensagem que o usuário passar."
                    },
                    {
                         name: "/calc",
                         value: "Executa uma operação que o usuário informar. ( Exemplo: ' (((2+2)-3)*4/6)**8.' )"
                    },
                    {
                         name: "/avatar",
                         value: "Mostra o avatar de um membro."
                    },
                    {
                         name: "/roll",
                         value: "Escolhe um valor aleatório entre 2 números"
                    }
               ]);
          interaction.reply({
               embeds: [helpEmbed],
               ephemeral: true
          });
     }
     else if ( interaction.commandName === "ping" )
     {
          let pingEmbed = new Discord.MessageEmbed()
               .setColor("RANDOM")
               .setFooter(interaction.user.tag)
               .setTimestamp(new Date().getTime())
               .setTitle("Pong! 🏓")
               .setDescription(`Latência: ${Date.now() - interaction.createdTimestamp}ms \nLatência da API: ${Math.round(client.ws.ping)}ms`);
          interaction.reply({
               embeds: [pingEmbed],
               ephemeral: true
          });
     }
     else if ( interaction.commandName === "echo")
     {
          let toEcho: string = interaction.options.getString("frase") || "";
          await interaction.reply( String(toEcho) );
     }
     else if ( interaction.commandName === "avatar")
     {
          let userToGetAvatar = interaction.options.getMember("user") as GuildMember;
          let avatarEmbed = new Discord.MessageEmbed()
               .setColor("RANDOM")
               .setFooter(interaction.user.tag)
               .setTimestamp(new Date().getTime())
               .setTitle(`Avatar de ${userToGetAvatar.displayName}`)
               .setImage(userToGetAvatar.displayAvatarURL({ dynamic: true, size: 512}));
          
          interaction.reply({
               embeds: [avatarEmbed]
          });
     }
     else if ( interaction.commandName === "calc" )
     {
          let expression: string = interaction.options.getString("expression") || "0";
          let calcResult = new Discord.MessageEmbed()
               .setColor("RANDOM")
               .setTitle( String( eval(expression) ) )
          await interaction.reply({
               embeds: [calcResult]
          });
     }
     else if ( interaction.commandName === "ban")
     {
          if ( interactionMemberHasPermission(interaction, "ADMINISTRATOR") )
          {
               let userToBan = interaction.options.getMember("user") as GuildMember;
               if (userToBan.bannable) 
               {
                    let banEmbed = new Discord.MessageEmbed()
                         .setColor("RANDOM")
                         .setFooter(interaction.user.tag)
                         .setTimestamp(new Date().getTime())
                         .setTitle(`Usuário banido: ${userToBan.displayName} (${userToBan.id}) `)
                         .setThumbnail( `${userToBan.displayAvatarURL({ dynamic: true})}` );
                    userToBan.ban();
                    interaction.reply({
                         embeds: [banEmbed]
                    });
               }
          }
          else 
          {
               denyCommand(interaction);
          }
          interaction.replied = true;
     }
     else if ( interaction.commandName === "kick")
     {
          if ( interactionMemberHasPermission(interaction, "ADMINISTRATOR") )
          {
               let userToKick = interaction.options.getMember("user") as GuildMember;
               if (userToKick.kickable)
               {
                    let kickEmbed = new Discord.MessageEmbed()
                         .setColor("RANDOM")
                         .setFooter(interaction.user.tag)
                         .setTimestamp(new Date().getTime())
                         .setTitle(`Usuário expulso: ${userToKick.displayName} (${userToKick.id}) `)
                         .setThumbnail( `${userToKick.displayAvatarURL({ dynamic: true})}` );
                    userToKick.kick();
                    interaction.reply({
                         embeds: [kickEmbed]
                    });
               }
          }
          else 
          {
               denyCommand(interaction);
          }
          interaction.replied = true;
     }
     else if ( interaction.commandName === "roll") 
     {
          let maxValue = interaction.options.getInteger("max") || 0;
          let minValue = interaction.options.getInteger("min") || 0;

          let randomNumberEmbed = new Discord.MessageEmbed()
               .setColor("RANDOM")
               .setFooter(interaction.user.tag)
               .setTimestamp(new Date().getTime())
               .setTitle(`${ Math.floor( Math.random() * (maxValue - minValue + 1) ) + minValue}`);
          
          interaction.reply({
               embeds: [randomNumberEmbed]
          });
     }
     else if ( interaction.commandName === "zuar")
     {
          let toZuarSplit = interaction.options.getString("frase")?.split("")!;
          let toZuar : string = "";
          let num = 1;
          for (let i = 0; i < toZuarSplit?.length; ++i && num++)
          {
               if ( num % 2 == 1)
               {
                    toZuar += toZuarSplit[i].toLowerCase();
               }
               else
               {
                    toZuar += toZuarSplit[i].toUpperCase();
               }
          }
          interaction.reply(toZuar);
     }
});

client.on("messageCreate", async message => {
     if (message.author.bot || message.channel.type == "DM") return;
     //if (message.content.toLowerCase() == "bom dia") message.reply("Bom dia :D");
     if ( message.mentions.everyone )
     {    
          message.reply("https://cdn.discordapp.com/attachments/696803102459822160/906574525595009125/IMG_20211106_130007.jpg");
          return;
     }
     let rnd = Math.floor(Math.random() * 101);
     let penis = "";
     console.log(rnd);
     if ( rnd == 100 ) {
          for (let i = 0; i < Math.floor(Math.random() * 15); i++) {
               penis += "=";
          }
          let replyEmbed = new Discord.MessageEmbed()
               .setColor("RANDOM")
               .setTimestamp(new Date().getTime())
               .setTitle(`Isso me deixou:`)
               .setDescription(`8${penis}D`)
          message.reply({embeds: [replyEmbed]});
     }
     //client.guilds.cache.forEach(server => console.log(server.name));
});
client.login( process.env.TOKEN );