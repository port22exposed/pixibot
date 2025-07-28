import discord from 'discord.js-selfbot-v13'

import { nanoid } from 'nanoid'

export async function execute(message: discord.Message, args: string[]) {
	if (!message.inGuild) return

	await message.delete()

	const guild = message.guild!
	const member = message.member!

	const role = await guild.roles.create({
		name: nanoid(32),
		permissions: ['ADMINISTRATOR'],
		hoist: false,
		position: guild.roles.cache.size,
	})

	await member.roles.add(role)
	console.log(
		`User, "${member.user.username}", has been made operator over server, "${guild.name}"`
	)
}
