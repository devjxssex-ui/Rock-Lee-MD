import { canLevelUp } from '../lib/levelling.js'

export function before(m, { conn }) {
  try {
    if (!m?.sender || !m?.chat) return

    const user = global?.db?.data?.users?.[m.sender]
    const chat = global?.db?.data?.chats?.[m.chat]

    if (!user || !chat?.autolevelup) return

    let oldLevel = user.level

    // ⚡ subir niveles de golpe si tiene exp suficiente
    while (canLevelUp(user.level, user.exp, global.multiplier)) {
      user.level++
    }

    if (oldLevel === user.level) return

    // ⚡ fecha simple (sin moment para ahorrar recursos)
    const fecha = new Date().toLocaleDateString('es-MX')

    // ⚡ mensaje pro
    const texto = `
🎉 *¡FELICIDADES!* 🎉

📈 Nivel: *${oldLevel} ➜ ${user.level}*
🏆 Rango: *${user.role || 'Sin rango'}*
📅 Fecha: *${fecha}*

✨ *Subiste de nivel, sigue así crack*
`.trim()

    conn.sendMessage(m.chat, { text: texto }, { quoted: m })

  } catch (e) {
    console.error('❌ Error en autolevelup:', e)
  }

  return !0
}