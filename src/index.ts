;(await import('dotenv')).config()

import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs/promises'

import discord from 'discord.js-selfbot-v13'

const client = new discord.Client({
	ws: {
		properties: {
			os: 'Linux',
			browser: 'Discord Client',
		},
	},
	presence: {
		status: 'invisible',
	},
})

const current_directory = path.dirname(fileURLToPath(import.meta.url))

const events_path = path.join(current_directory, 'events')

const events = (await fs.readdir(events_path)).filter(
	(file) => file.endsWith('.ts') || file.endsWith('.js')
)

events.forEach(async (file_name) => {
	const imported = await import(path.join(events_path, file_name))
	const execute_function = imported.execute
	console.assert(
		execute_function || typeof execute_function !== 'function',
		'Execution function not present on event handler, please create one.'
	)
	const once =
		imported.once && typeof imported.once === 'boolean' ? imported.once : false

	client[once ? 'once' : 'on'](
		file_name.substring(0, file_name.length - 3),
		imported.execute
	)
})

client.login(process.env.DISCORD_TOKEN)
