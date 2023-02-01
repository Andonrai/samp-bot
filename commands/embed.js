const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, PermissionsBitField } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("crea tu embed")
    .addChannelOption(option => option.setName('canal').setDescription('Selecciona un canal').setRequired(true))
    .addStringOption(option => option.setName('titulo').setDescription('titulo del embed'))
    .addStringOption(option => option.setName('descripción').setDescription('descripción del embed'))
    .addAttachmentOption(option => option.setName('imagen').setDescription('imagen del embed'))
    .addAttachmentOption(option => option.setName('imagen-cabecera').setDescription('imagen pequeña del embed'))
    .addStringOption(option => option.setName('footer').setDescription('pié del embed')),

    async execute(client, interaction){

        let permisos = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)
        if(!permisos) return interaction.reply({ content: "No tienes suficientes permisos!", ephemeral: true })
      
        const titulo = interaction.options.getString("titulo")
        const descripcion = interaction.options.getString("descripción")
        const imagen = interaction.options.getAttachment("imagen")
        const thumbnail = interaction.options.getAttachment("imagen-cabecera")
        const channel = interaction.options.getChannel("canal")
        const footer = interaction.options.getString("footer")
        

        const embed = new EmbedBuilder()
        if(titulo) embed.setTitle(titulo)
        if(descripcion) embed.setDescription(descripcion)
        .setColor(process.env.COLOR)
        if(imagen) embed.setImage(imagen.url)
        if(thumbnail) embed.setThumbnail(thumbnail.url)
        if(footer) embed.setFooter({ text: footer })

        interaction.reply({ content: "Embed enviado correctamente!" })
        client.guilds.cache.get(channel.guild.id).channels.cache.get(channel.id).send({ embeds: [embed] });
    }
}
