// Código mejorado estilo Rock Lee-MD 🔥
// Base original x The Carlos 👑 (créditos intactos)

import fs from 'fs'
import path from 'path'

export async function before(m, { conn }) {
  if (!m.text || !global.prefix) return

  global.prefix.lastIndex = 0
  if (!global.prefix.test(m.text)) return

  global.prefix.lastIndex = 0
  const usedPrefix = global.prefix.exec(m.text)[0]
  const command = m.text
    .slice(usedPrefix.length)
    .trim()
    .split(/\s+/)[0]
    .toLowerCase()

  // DB segura
  global.db.data ||= {}
  global.db.data.users ||= {}

  // ⚡ CACHE DE COMANDOS (mejora rendimiento brutal)
  if (!global._cmdCache) {
    global._cmdCache = new Set()

    for (const p of Object.values(global.plugins || {})) {
      if (!p?.command) continue
      const cmds = Array.isArray(p.command) ? p.command : [p.command]

      for (const cmd of cmds) {
        if (typeof cmd === 'string') {
          global._cmdCache.add(cmd)
        }
      }
    }
  }

  // ✔ comando válido
  if (global._cmdCache.has(command)) {
    const user = global.db.data.users[m.sender] ||= {}
    user.commands = (user.commands || 0) + 1
    return
  }

  // 🎮 Easter Eggs
  const easterEggs = {
    hacked: { recompensa: 100, mensaje: '👾 Acceso oculto... +100 XP' },
    glitch: { recompensa: 50, mensaje: '⚡ Glitch detectado... +50 coins' },
    neo: { recompensa: 77, mensaje: '🧬 Bienvenido Neo... +77 XP' },
    thematrix: { recompensa: 133, mensaje: '🟩 Has visto el código... +133 coins' },
    elcodigooculto: { recompensa: 250, mensaje: '🔐 Código secreto... +250 XP' }
  }

  const egg = easterEggs[command]
  if (egg) {
    const user = global.db.data.users[m.sender] ||= {}
    user.exp = (user.exp || 0) + egg.recompensa
    return m.reply(egg.mensaje)
  }

  const comando = usedPrefix + command

  // ⚠ respuestas inteligentes (NO tóxicas)
  const respuestas = [
    `⚠ Comando no válido:\n*${comando}*\n📕 Usa *${usedPrefix}menu*`,
    `❌ No existe ese comando\n👉 Prueba con *${usedPrefix}help*`,
    `🤔 No reconozco ese comando\n📚 Mira el menú con *${usedPrefix}menu*`,
    `🚫 Ese comando no está registrado`,
    `🧠 Tal vez escribiste mal el comando`
  ]

  // 😈 estilo Rock Lee (ligero, no ofensivo)
  const estilo = [
    `😈 Ese comando no existe... pero buen intento`,
    `🌀 Error en la ejecución... intenta otra vez`,
    `⚙️ Comando fuera del sistema`,
    `👁 No detectado en la base de datos`,
    `💻 Entrada inválida`
  ]

  const usarEstilo = Math.random() < 0.3
  const respuesta = usarEstilo
    ? estilo[Math.floor(Math.random() * estilo.length)]
    : respuestas[Math.floor(Math.random() * respuestas.length)]

  await m.reply(respuesta.trim())
}