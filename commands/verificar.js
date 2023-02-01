const { InteractionType, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verificar')
		.setDescription('Te verifica en el servidor para que puedes ver todos los canales!'),
	async execute(client, interaction) {

		// Create the modal
		const modal = new ModalBuilder()
			.setCustomId('verificacion')
			.setTitle('Verificación');

		// Add components to modal

		// Create the text input components
		const favoriteColorInput = new TextInputBuilder()
			.setCustomId('username')
		    // The label is the prompt the user sees for this input
			.setLabel("Nombre de Usuario (Nombre_Apellido).")
		    // Short means only a single line of text
			.setStyle(TextInputStyle.Short);

		const hobbiesInput = new TextInputBuilder()
			.setCustomId('password')
			.setLabel("Ingresa la contraseña de la cuenta de SAMP.")
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph);

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
		const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow);

		// Show the modal to the user
		await interaction.showModal(modal);

	},
};
