import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs/promises'

import discord from 'discord.js-selfbot-v13'

const PREFIX = 'sudo'

const command_registry: Record<
	string,
	(message: discord.Message, args: Array<string>) => {}
> = {}

const current_directory = path.dirname(fileURLToPath(import.meta.url))
const src_directory = path.resolve(current_directory, '..')

const commands_directory = path.join(src_directory, 'commands')

const commands = (await fs.readdir(commands_directory)).filter(
	(file) => file.endsWith('.ts') || file.endsWith('.js')
)

commands.forEach(async (file_name) => {
	const imported = await import(path.join(commands_directory, file_name))
	const execute_function = imported.execute
	console.assert(
		execute_function || typeof execute_function !== 'function',
		`Execution function not present on command handler, please create one.`
	)

	command_registry[file_name.substring(0, file_name.length - 3)] =
		imported.execute
})

export async function execute(message: discord.Message) {
	if (message.author.bot) return
	if (message.author.id === message.client.user?.id) return

	const args = message.content.split(' ')
	if (args.length <= 0 || args[0]?.toLowerCase() !== PREFIX) return
	if (!args[1]) return
	const command_name = args[1]

	if (command_registry[command_name]) {
		command_registry[command_name](message, args)
	}
}
