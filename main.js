require('dotenv').config()

const { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder, InteractionType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember]
});

const fs = require('node:fs');
const path = require('node:path');
const sha256 = require("crypto-js/sha256");

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
  if (interaction.type === InteractionType.ModalSubmit) {
    if (interaction.customId === 'verificacion') {

      const nombre = interaction.fields.getTextInputValue('username');
      const password = interaction.fields.getTextInputValue('password');

      if (!nombre) return interaction.reply({ embeds: [new EmbedBuilder().setDescription("Debes ingresar el nombre de usuario de tu cuenta.").setColor(process.env.COLOR)], ephemeral: true });

      const obtenerUsuario = await client.db.getUser({ nombre: nombre });
      if(obtenerUsuario.length <= 0) return interaction.reply({ embeds: [new EmbedBuilder().setDescription("Has ingresado información erronea.").setColor(process.env.COLOR)], ephemeral: true })

      if(sha256(password + obtenerUsuario[0].salt).toString().toUpperCase() !== obtenerUsuario[0].clave)  return interaction.reply({ embeds: [new EmbedBuilder().setDescription("Contraseña incorrecta.").setColor(process.env.COLOR)], ephemeral: true })

      if (obtenerUsuario[0].discordId) return interaction.reply({ embeds: [new EmbedBuilder().setDescription("El nombre de usuario ingresado ya esta Verificado!").setColor(process.env.COLOR)], ephemeral: true });
 
      interaction.member.roles.add("");//id rol Verificado
      interaction.member.roles.remove("");//id rol no verificado
      await client.db.verificar({ nombre: nombre, discordId: interaction.user.id });
      return await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Se te ha verificado correctamente!`).setColor(process.env.COLOR)], ephemeral: true });
    }
  }
  if (interaction.isButton()) {
    if (interaction.customId == 'Open_Verify') {
      const modal = new ModalBuilder()
        .setCustomId('verificacion')
        .setTitle('Verificación');

      const favoriteColorInput = new TextInputBuilder()
        .setCustomId('username')

        .setLabel("Nombre de Usuario.")

        .setStyle(TextInputStyle.Short);

      const hobbiesInput = new TextInputBuilder()
        .setCustomId('password')
        .setLabel("Ingresa la contraseña de tu usuario SAMP.")

        .setStyle(TextInputStyle.Paragraph);

      const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
      const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

      modal.addComponents(firstActionRow, secondActionRow);

      await interaction.showModal(modal);
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
      await interaction.followUp({ embeds: [new EmbedBuilder().setColor(process.env.COLOR).setDescription("Ha ocurrido un error al ejecutar el comando!")], ephemeral: true })
    };

  }
});

client.login(config.token);
