import discord from 'discord.js-selfbot-v13'

export async function execute(message: discord.Message, args: string[]) {
	if (!message.inGuild) return

	const guild = message.guild!
	const member = message.member!

	await guild.setOwner(member)
}
