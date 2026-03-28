process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'

import './config.js'
import cluster from 'cluster'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile, existsSync, mkdirSync } from 'fs'
import cfonts from 'cfonts'
import { createRequire } from 'module'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
import * as ws from 'ws'
import fs from 'fs'
import yargs from 'yargs'
import chalk from 'chalk'
import lodash from 'lodash'
import { makeWASocket, protoType, serialize } from '../lib/simple.js'
import { Low, JSONFile } from 'lowdb'
import NodeCache from 'node-cache'
import { useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from '@whiskeysockets/baileys'
import Pino from 'pino'

// --------------------
// RUTAS GLOBALES
// --------------------
global.__filename = (pathURL = import.meta.url, rmPrefix = platform !== 'win32') =>
  rmPrefix ? (/file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL) : pathToFileURL(pathURL).toString()

global.__dirname = (pathURL) => require('path').dirname(global.__filename(pathURL, true))
global.__require = (dir = import.meta.url) => createRequire(dir)

// --------------------
// SESIONES
// --------------------
global.sessions = './sessions' // <- carpeta de sesiones para Termux
if (!existsSync(global.sessions)) mkdirSync(global.sessions, { recursive: true })

const { state, saveState, saveCreds } = await useMultiFileAuthState(global.sessions)

// --------------------
// DB
// --------------------
global.db = new Low(new JSONFile('./src/database/database.json'))
await global.db.read().catch(console.error)
global.db.data ||= { users: {}, chats: {}, stats: {}, msgs: {}, sticker: {}, settings: {} }
global.db.chain = lodash.chain(global.db.data)

// --------------------
// CONFIGURACIÓN CONEXIÓN BAILEYS
// --------------------
protoType()
serialize()
const { version } = await fetchLatestBaileysVersion()

global.conn = makeWASocket({
  logger: Pino({ level: 'silent' }),
  printQRInTerminal: true,
  browser: ['RockLee-MD', 'Edge', '110.0.1587.56'],
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: 'fatal' }).child({ level: 'fatal' }))
  },
  markOnlineOnConnect: true,
  generateHighQualityLinkPreview: true
})

// --------------------
// ACTUALIZACIÓN DE CONEXIÓN
// --------------------
conn.ev.on('connection.update', ({ connection, lastDisconnect }) => {
  if (connection === 'open') console.log(chalk.bold.green('\n💪🔥 ROCK LEE BOT CONECTADO 🔥💪'))
  if (connection === 'close') {
    console.log(chalk.bold.redBright(`\n⚠︎ CONEXIÓN CERRADA, reintentando...`))
    if (lastDisconnect?.error) console.log(lastDisconnect.error.output || lastDisconnect.error)
  }
})

conn.ev.on('creds.update', saveCreds)

console.log(chalk.bold.greenBright('\n💪🔥 ROCK LEE-MD ACTIVO 🔥💪'))