import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
import { Low, JSONFile } from 'lowdb'

// 💪🔥 CONFIGURACIÓN ROCK LEE MD 🔥💪

global.botNumber = ''

global.owner = [
  ['527751962946', '💪 Creador Rock Lee', true],
  ['', '', false]
]

global.mods = ['527751962946']
global.prems = ['527751962946']

global.libreria = 'Baileys'
global.baileys = 'V 6.7.9'
global.languaje = 'Español'
global.vs = '1.0.0'
global.sessions = 'rockleeSession'
global.jadi = 'rockleeJadiBot'
global.blackJadibts = true

global.packsticker = `💪 ROCK LEE BOT\nEL PODER DE LA JUVENTUD 🔥`
global.packname = 'Rock Lee 💪🔥'
global.author = 'Devjxssex'

// Branding
global.wm = '𝕽𝖔𝖈𝖐 𝕷𝖊𝖊 ?'
global.titulowm = '𝕽𝖔𝖈𝖐 𝕷𝖊𝖊 𝕸𝕯'
global.botname = '𝕽𝖔𝖈𝖐 𝕷𝖊𝖊 🪾🔥'
global.dev = 'Powered by esfuerzo puro 🔥'
global.textbot = '𝕽𝖔𝖈𝖐 𝕷𝖊𝖊 𝕭𝖔𝖙'

// Archivos
try {
    global.catalogo = fs.readFileSync(new URL('../src/catalogo.jpg', import.meta.url))
} catch(e) {
    console.log(chalk.redBright('⚠️ catalogo.jpg no encontrado.'))
    global.catalogo = null
}
global.photoSity = [global.catalogo]

// Estilo mensajes
global.estilo = { 
  key: { fromMe: false, participant: '0@s.whatsapp.net' }, 
  message: { 
    orderMessage: { 
      itemCount : -999999, 
      status: 1, 
      surface : 1, 
      message: global.packname, 
      orderTitle: 'Rock Lee', 
      thumbnail: global.catalogo || undefined, 
      sellerJid: '0@s.whatsapp.net'
    }
  }
}

// Base de datos
global.db = new Low(new JSONFile('./src/database/database.json'))
await global.db.read()
global.db.data = global.db.data || { users: {}, chats: {}, stats: {}, msgs: {}, sticker: {}, settings: {} }
global.db.chain = require('lodash').chain(global.db.data)

// Librerías globales
global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment

// Sistema
global.multiplier = 50
global.maxwarn = 3

// Hot reload
const file = fileURLToPath(import.meta.url)
watchFile(file, () => {
    unwatchFile(file)
    console.log(chalk.redBright('Update config.js'))
    import(`${file}?update=${Date.now()}`)
})