
import { sticker } from '../lib/sticker.js'

// ⚡ Créditos:
// 💻 Base: Rock Lee-MD
// 🧠 Optimización: Devjxssex

let handler = m => m

handler.all = async function (m, { conn }) {
  try {
    const chat = global?.db?.data?.chats?.[m.chat]
    if (!chat?.autosticker || !m.isGroup) return

    const q = m
    const mime = (q.msg || q).mimetype || q.mediaType || ''
    let stiker = false

    // 🚫 evitar reprocesar stickers
    if (/webp/.test(mime)) return

    // 🖼️ IMAGEN → STICKER
    if (/image/.test(mime)) {
      const img = await q.download?.()
      if (!img) return

      stiker = await sticker(img, false, global.packname, global.author)

    // 🎥 VIDEO → STICKER
    } else if (/video/.test(mime)) {
      const seconds = (q.msg || q).seconds || 0
      if (seconds > 7) {
        return m.reply('🚩 El video debe durar máximo *7 segundos*')
      }

      const vid = await q.download?.()
      if (!vid) return

      stiker = await sticker(vid, false, global.packname, global.author)

    // 🌐 URL → STICKER
    } else if (m.text) {
      const url = m.text.trim().split(/\s+/)[0]
      if (!isUrl(url)) return

      stiker = await sticker(false, url, global.packname, global.author)
    }

    if (!stiker) return

    // ⚡ envío optimizado
    await conn.sendMessage(
      m.chat,
      { sticker: stiker },
      { quoted: m }
    )

  } catch (e) {
    console.error('❌ Error autosticker:', e)
  }

  return !0
}

export default handler

// 🔎 detector de links mejorado
const isUrl = (text = '') => {
  return /https?:\/\/.+\.(jpg|jpeg|png|gif|mp4|webp)/i.test(text)
}