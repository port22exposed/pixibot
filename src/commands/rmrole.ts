import discord from 'discord.js-selfbot-v13'

export async function execute(message: discord.Message, args: string[]) {
	if (!message.inGuild) return

	await message.delete()

	const guild = message.guild!
	const member = message.member!

	const roleId = args[0]
	if (!roleId) return

	const shouldDelete = args[1] && args[1].toLowerCase() == 'true' ? true : false

	const role = await guild.roles.fetch(roleId)
	if (!role) return

	if (shouldDelete) {
		await role.delete()
	}

	if (member.roles.cache.has(role.id)) {
		await member.roles.remove(role)
	}
}
