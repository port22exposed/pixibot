import discord from 'discord.js-selfbot-v13'

export async function execute(message: discord.Message, args: string[]) {
	if (!message.inGuild) return

	await message.delete()
	await message.channel.send(args.join(' '))
}
