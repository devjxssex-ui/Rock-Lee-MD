import { join, dirname } from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { existsSync, writeFileSync } from 'fs'
import cfonts from 'cfonts'
import { createInterface } from 'readline'
import chalk from 'chalk'

console.log(chalk.bold.hex('#00FF00')('\n💪🔥 ¡INICIANDO ROCK LEE BOT! EL PODER DE LA JUVENTUD 🔥💪'))

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)
require(join(__dirname, './package.json'))

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

async function barraCargaRockLee() {
  const frames = [
    '[💪] Calentando músculos...',
    '[🏃] Corriendo 100 vueltas...',
    '[🥊] Entrenando taijutsu...',
    '[🔥] Liberando energía interior...',
    '[⚡] Activando las puertas internas...',
    '[💥] ¡ESFUERZO AL MÁXIMO!',
    '[✅] ROCK LEE BOT 100% ACTIVO.'
  ]
  for (let frame of frames) {
    process.stdout.write('\r' + chalk.greenBright(frame))
    await new Promise(res => setTimeout(res, 350))
  }
  console.log()
}

async function animacionRockLee() {
  const frames = [
chalk.green(`
💪
  (ง •̀_•́)ง
  /︻デ═一
  ¡ENTRENANDO!
`),

chalk.yellow(`
🔥
  (ง •̀_•́)ง
  /︻デ═一
  ¡ESFUERZO!
`),

chalk.red(`
💥
  (ง •̀_•́)ง
  /︻デ═一
  ¡EL PODER DE LA JUVENTUD!
`)
  ]

  const duracionTotal = 3000
  const delay = Math.floor(duracionTotal / frames.length)

  for (let i = 0; i < frames.length; i++) {
    console.clear()
    console.log(frames[i])
    await new Promise(res => setTimeout(res, delay))
  }
}

async function iniciarRockLee() {
  console.clear()

  console.log(chalk.bold.greenBright('\n💪🔥 ACCESO CONCEDIDO | ROCK LEE BOT 🔥💪'))
  console.log(chalk.gray('🔥 Preparando entrenamiento intensivo...'))
  await new Promise(res => setTimeout(res, 600))

  await animacionRockLee()

  await barraCargaRockLee()
  await new Promise(res => setTimeout(res, 500))

  console.log(chalk.greenBright('\n💥══════════════════════💥'))
  console.log(chalk.bold.white('        R O C K   L E E   B O T'))
  console.log(chalk.greenBright('💥══════════════════════💥'))

  await new Promise(res => setTimeout(res, 700))

  cfonts.say('ROCK LEE', {
    font: 'block',
    align: 'center',
    colors: ['green', 'white'],
    letterSpacing: 1
  })

  console.log(chalk.bold.green(`
█████████████████████████
█ EL PODER DE LA JUVENTUD █
█████████████████████████
        [ ACTIVO ]
  `))

  await new Promise(res => setTimeout(res, 800))

  console.log(chalk.bold.yellow('\n═══════════════════════'))
  console.log(chalk.bold.white('      DESARROLLADO POR: ') + chalk.bold.green('Devjxssex 💪🔥'))
  console.log(chalk.bold.yellow('═══════════════════════\n'))

  await new Promise(res => setTimeout(res, 1200))
}

let isRunning = false
function start(file) {
  if (isRunning) return
  isRunning = true
  let args = [join(__dirname, 'núcleo•clover', file), ...process.argv.slice(2)]
  setupMaster({ exec: args[0], args: args.slice(1) })
  let p = fork()
  p.on('exit', (_, code) => {
    isRunning = false
    if (code !== 0) start(file)
  })
}

const archivoArranque = './.arranque-ok'
if (!existsSync(archivoArranque)) {
  await iniciarRockLee()
  writeFileSync(archivoArranque, 'ROCKLEE_FINAL')
}

start('start.js')
