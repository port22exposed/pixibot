import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs/promises'

import discord from 'discord.js-selfbot-v13'

import { WHITELISTED_USERIDS } from '../whitelist.ts'

const PREFIX = 'sudo'

const command_registry: Record<
	string,
	(message: discord.Message, args: Array<string>) => {}
> = {}

const current_directory = path.dirname(fileURLToPath(import.meta.url))
const src_directory = path.resolve(current_directory, '..')

const commands_directory = path.join(src_directory, 'commands')

async function registerCommands() {
	const commands = (await fs.readdir(commands_directory)).filter(
		(file) => file.endsWith('.ts') || file.endsWith('.js')
	)

	commands.forEach(async (file_name) => {
		const command_name = path
			.basename(file_name, path.extname(file_name))
			.toLowerCase() // commands are case insensitive

		const imported = await import(path.join(commands_directory, file_name))
		const execute_function = imported.execute
		if (!execute_function || typeof execute_function !== 'function') {
			console.log(
				`Execution function not present on command, ${command_name}, please create one.`
			)
			return
		}
		command_registry[command_name] = imported.execute
	})
}

await registerCommands()

export async function execute(message: discord.Message) {
	const author = message.author!

	if (author.bot) return
	if (author.id === message.client.user?.id) return
	if (!WHITELISTED_USERIDS.includes(author.id)) return

	const args = message.content.split(' ')
	if (args.length <= 0 || args[0]?.toLowerCase() !== PREFIX) return

	if (!args[1]) return

	const command_name = args[1].toLowerCase()

	if (command_registry[command_name]) {
		command_registry[command_name](message, args.splice(2))
	}
}
