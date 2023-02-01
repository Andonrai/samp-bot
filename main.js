const { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder, InteractionType } = require("discord.js");
const client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers
      ],
      partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember] });

const fs = require('node:fs');
const path = require('node:path');

client.once('ready', () => {
	console.log('Ready!');
});


const config = require("./config.js");

client.commands = new Collection();
client.db = require("./basededato.js");

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}


client.on('interactionCreate', async interaction => {
  if (interaction.type === InteractionType.ModalSubmit){
	if (interaction.customId === 'verificacion') {

    const nombre = interaction.fields.getTextInputValue('username').split(" ").join("");
	  const response = interaction.fields.getTextInputValue('password');
    //const nombre = interaction.options.getString('nombre').split(" ").join("");
    if(!nombre.includes("_")) return interaction.reply({ embeds: [new EmbedBuilder().setDescription("Formato de Nombre Incorrecto, el Formato correcto es **Nombre_Apellido**").setColor("#7719fc")] });

    const obtenerUsuario = await client.db.getUser({ nombre: nombre });
     console.log(obtenerUsuario)
    if(!obtenerUsuario[0]?.discordId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`El nombre ingresado no existe!`).setColor("#7719fc")], ephemeral: true });
    
    if(obtenerUsuario[0].u_discord === 1) return interaction.reply({ embeds: [new EmbedBuilder().setDescription("El nombre de usuario ingresado ya esta Verificado!").setColor("#7719fc")], ephemeral: true });

    let pass = await client.db.getUserPass({ nombre: nombre, pass: response }) === obtenerUsuario[0].u_password;
    console.log(pass)
    if(pass === false) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`La contraseña ingresada es incorrecta!`).setColor("#7719fc")], ephemeral: true });
    interaction.member.roles.add("1005217912468021360");
    await client.db.verificar({ nombre: nombre, verificado: 1 });
		 return await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Se te ha verificado correctamente!`).setColor("#7719fc")], ephemeral: true });
    
	}
  }
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(client, interaction);
	} catch (error) {
		console.error(error);
    if (interaction.replied) {
        await interaction.editReply({ embeds: [new EmbedBuilder().setColor(process.env.COLOR).setDescription("Ha ocurrido un error al ejecutar el comando!")], ephemeral: true })
    } else {
        await interaction.followUp({ embeds: [new EmbedBuilder().setColor(process.env.COLOR).setDescription("Ha ocurrido un error al ejecutar el comando!")] , ephemeral: true })
    };

	}
});

client.login(config.token);

const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(3000)
