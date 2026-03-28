// start.js - ROCK LEE BOT Termux Ready
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import chalk from 'chalk'
import cfonts from 'cfonts'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Aseguramos global.opts
global.opts = { legacy: false } // Cambia a true si usas legacy sockets

// Función de inicio
async function iniciarRockLee() {
    console.clear()
    console.log(chalk.green('💪🔥 ROCK LEE BOT INICIANDO 🔥💪'))
    cfonts.say('ROCK LEE', { font: 'block', align: 'center', colors: ['green','white'] })
}

// Crear archivo de arranque si no existe
if (!fs.existsSync(join(__dirname, '.arranque-ok'))) {
    await iniciarRockLee()
    fs.writeFileSync(join(__dirname, '.arranque-ok'), 'ROCKLEE_FINAL')
}

// Importar config.js desde núcleo•clover
import(join(__dirname, './núcleo•clover/config.js'))

// Importar simple.js desde lib (a nivel raíz)
import { makeWASocket } from './lib/simple.js'

// Conectar el bot
const conn = makeWASocket(global.opts.legacy ? { legacy: true } : {})

// Exportar conn si otros módulos lo usan
export { conn }