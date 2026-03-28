import './config.js'
import { makeWASocket, protoType, serialize } from '../lib/simple.js'
import { useMultiFileAuthState } from '@whiskeysockets/baileys'
import NodeCache from 'node-cache'
import fs from 'fs'
import chalk from 'chalk'

protoType()
serialize()

global.sessions = 'rockleeSession'

// Base de datos ya cargada en config.js

const { state, saveCreds } = await useMultiFileAuthState(global.sessions)

global.conn = makeWASocket({
    auth: {
        creds: state.creds,
        keys: state.keys
    },
    printQRInTerminal: true,
    browser: ['RockLee-MD', 'Edge', '110.0.1587.56'],
    markOnlineOnConnect: true
})

global.conn.ev.on('connection.update', update => {
    const { connection } = update
    if (connection === 'open') console.log(chalk.green('💪🔥 ROCK LEE BOT CONECTADO 🔥💪'))
    if (connection === 'close') console.log(chalk.redBright('⚠︎ CONEXIÓN CERRADA'))
})

global.conn.ev.on('creds.update', saveCreds)