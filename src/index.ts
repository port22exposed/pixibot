;(await import('dotenv')).config()

import * as Discord from 'discord.js-selfbot-v13'

const client = new Discord.Client({
	ws: {
		properties: {
			os: 'iOS',
			browser: 'Discord iOS',
			device: 'Discord iOS',
		},
	},
})

client.login(process.env.DISCORD_TOKEN)
