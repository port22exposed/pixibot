;(await import('dotenv')).config()

import fs from 'node:fs/promises'
import dns from 'node:dns/promises'

const API_URL = 'https://api.mullvad.net/www/relays/wireguard/'

const COUNTRY_NAME = process.env.DISCORD_TOKEN_COUNTRY

if (!COUNTRY_NAME) {
	throw new Error('DISCORD_TOKEN_COUNTRY undefined in environment!')
}

type MullvadServer = {
	country_name: string
	ipv4_addr_in: string
	socks_name: string
	socks_port: number
	active: boolean
}

const mullvad_servers: Array<MullvadServer> = (await (
	await fetch(API_URL)
).json()) as Array<MullvadServer>

async function resolve(hostname: string) {
	for (let attempt = 1; attempt <= 3; attempt++) {
		try {
			const addresses = (await dns.resolve(hostname)) as unknown as Record<
				string,
				string
			>
			if (addresses && addresses[0]) {
				return addresses[0]
			}
		} catch (err) {
			console.log(
				`failed to resolve hostname: ${hostname}, don't worry I am just as annoyed as you are right now.`
			)
		}
	}
	return null
}

const proxy_lines = await Promise.all(
	mullvad_servers
		.filter(
			(server) =>
				server.country_name.toLowerCase() === COUNTRY_NAME.toLowerCase() &&
				server.active === true
		)
		.map(
			async (server) =>
				`socks5 ${await resolve(server.socks_name)} ${server.socks_port}`
		)
)

await fs.writeFile(
	'proxychains.conf',
	`${(
		await fs.readFile('./proxychains_default.txt')
	).toString()}\n\n[ProxyList]\n` + proxy_lines.join('\n')
)
