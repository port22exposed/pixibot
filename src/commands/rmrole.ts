import discord from 'discord.js-selfbot-v13'

export async function execute(message: discord.Message, args: string[]) {
	if (!message.inGuild) return

	await message.delete()

	const guild = message.guild!
	const member = message.member!

	const roleId = args[0]
	if (!roleId) return

	const role = await guild.roles.fetch(roleId)

	if (role) {
		member.roles.remove(role)
	}
}
