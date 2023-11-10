const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('usuario')
		.setDescription('Muestra información de un usuario!').addStringOption(option =>
		option.setName('nombre')
			.setDescription('Nombre Del usuario!')
			.setRequired(true)),
	async execute(client, interaction) {
    const nombre = interaction.options.getString('nombre').split(" ").join("");
    if(!nombre.includes("_")) return interaction.reply({ embeds: [new EmbedBuilder().setDescription("Formato de Nombre Incorrecto, el Formato correcto es **Nombre_Apellido**").setColor("#7719fc")] });

		const obtenerUsuario = await client.db.getUser({ nombre: nombre });
    const embed = new EmbedBuilder()
    .setTitle(nombre)
    .setDescription(`**SQL ID:** ${obtenerUsuario[0].u_id}\n**En línea:** ${obtenerUsuario[0].u_online === 0 ? "No" : "Si" }\n**Edad:** ${obtenerUsuario[0].u_age}\n**Genero:** ${obtenerUsuario[0].u_gender === 0 ? "Hombre" : "Mujer"}\n**Verificado:** ${obtenerUsuario[0].u_discord === 0 ? "No" : "Si" }`)
    .setColor("#7719fc")
    interaction.reply({ embeds: [embed] })

	},
};
