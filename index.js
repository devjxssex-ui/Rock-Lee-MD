import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import chalk from 'chalk'
import cfonts from 'cfonts'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function iniciarRockLee() {
    console.clear()
    console.log(chalk.green('💪🔥 ROCK LEE BOT INICIANDO 🔥💪'))
    cfonts.say('ROCK LEE', { font: 'block', align: 'center', colors: ['green','white'] })
}

if (!fs.existsSync('./.arranque-ok')) {
    await iniciarRockLee()
    fs.writeFileSync('./.arranque-ok', 'ROCKLEE_FINAL')
}

import('./start.js')