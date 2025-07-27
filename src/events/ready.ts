import discord from 'discord.js-selfbot-v13'

export const once = true

export async function execute(client: discord.Client) {
	console.log(client.user?.displayName, 'is online')
	client.user?.setStatus('invisible')
}
