import axios from 'axios'
import cheerio from 'cheerio'

let handler = async (m, { conn, text, args, usedPrefix }) => {

if (!text) {
  return m.reply(`⚡ *PINTEREST SEARCH*

> Ingresa lo que deseas buscar

📌 Ejemplo:
${usedPrefix}pinterest gatos aesthetic`)
}

try {
  await m.react('⏳')

  // 🔗 Si es link directo
  if (text.includes("https://")) {
    let i = await dl(args[0])
    let isVideo = i.download.includes(".mp4")

    return await conn.sendMessage(m.chat, { 
      [isVideo ? "video" : "image"]: { url: i.download }, 
      caption: `⚡ *DESCARGA COMPLETA*\n\n📌 ${i.title}` 
    }, { quoted: m })
  }

  // 🔍 Búsqueda normal
  const results = await pins(text)

  if (!results.length) {
    return conn.reply(m.chat, `🚫 *Sin resultados para:* "${text}"`, m)
  }

  const medias = results.slice(0, 10).map(img => ({
    type: 'image',
    data: { url: img.image_large_url }
  }))

  await conn.sendSylphy(m.chat, medias, {
    caption: `⚡ *PINTEREST - SEARCH*

🔎 Búsqueda: ${text}
🖼 Resultados: ${medias.length}`,
    quoted: m
  })

  await m.react('✅')

} catch (e) {
  await m.react('❌')
  conn.reply(
    m.chat, 
    `🚫 Error en la búsqueda

📢 Usa ${usedPrefix}report si el error persiste.`,
    m
  )
}}

handler.help = ['pinterest']
handler.command = ['pinterest', 'pin']
handler.tags = ["download"]
handler.group = true

export default handler