import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import chalk from 'chalk'
import cfonts from 'cfonts'
import { load } from 'cheerio' // Cambio hecho para compatibilidad con cheerio moderna

// Para rutas relativas
const __dirname = dirname(fileURLToPath(import.meta.url))

// Función de inicio del bot
export async function iniciarBot() {
    console.clear()
    console.log(chalk.green('💪🔥 ROCK LEE BOT INICIANDO 🔥💪'))
    cfonts.say('ROCK LEE', { font: 'block', align: 'center', colors: ['green', 'white'] })
}

// Crear archivo de arranque si no existe
if (!fs.existsSync(join(__dirname, './.arranque-ok'))) {
    await iniciarBot()
    fs.writeFileSync(join(__dirname, './.arranque-ok'), 'ROCKLEE_FINAL')
}

// Export de cheerio para usar en otros archivos
export { load }