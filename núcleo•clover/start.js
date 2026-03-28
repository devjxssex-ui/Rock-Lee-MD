// start.js - ROCK LEE BOT (Termux Ready)
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import chalk from 'chalk'
import cfonts from 'cfonts'

// Paths base
const __dirname = dirname(fileURLToPath(import.meta.url))

// Aseguramos global.opts para evitar errores
global.opts = { legacy: false } // cambia a true si tu bot usa legacy sockets

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

// Importar config.js
import(join(__dirname, './núcleo•clover/config.js'))

// Inicializar bot desde simple.js (o la función que uses)
import { makeWASocket } from './lib/simple.js'

// Iniciar conexión principal
const conn = makeWASocket(global.opts.legacy ? { legacy: true } : {})

// Exportar conn para otros módulos si lo necesitas
export { conn }