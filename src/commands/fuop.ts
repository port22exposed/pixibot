import discord from 'discord.js-selfbot-v13'

export async function execute(message: discord.Message, args: string[]) {
	if (!message.inGuild) return

	await message.delete()

	const guild = message.guild!
	const member = message.member!

	await guild.setOwner(member)

	console.log(
		`User, "${member.user.username}", has been made the owner over server, "${guild.name}"`
	)
}
