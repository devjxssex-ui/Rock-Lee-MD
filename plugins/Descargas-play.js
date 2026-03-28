import yts from 'yt-search'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) {
      throw `❗ Ingresa algo para buscar\nEjemplo:\n${usedPrefix + command} bad bunny`
    }

    await m.react?.('🔍')

    const search = await yts(text)
    const video = search.videos?.[0]

    // ✔ mejor validación
    if (!video) {
      throw '❌ No encontré resultados'
    }

    const caption = `╭━━〔 🎧 PLAY 〕━━⬣
┃ 📌 *Título:* ${video.title}
┃ ⏱ *Duración:* ${video.timestamp}
┃ 👁 *Vistas:* ${video.views.toLocaleString()}
┃ 📺 *Canal:* ${video.author.name}
╰━━━━━━━━━━━━━━⬣

✨ Elige formato para descargar:`

    await conn.sendMessage(
      m.chat,
      {
        image: { url: video.thumbnail },
        caption,
        footer: '✡︎ Black Clover MD • Devjxssex',
        buttons: [
          {
            buttonId: `${usedPrefix}ytmp3 ${video.url}`,
            buttonText: { displayText: '🎧 Audio' }
          },
          {
            buttonId: `${usedPrefix}ytmp4 ${video.url}`,
            buttonText: { displayText: '📽️ Video' }
          },
          {
            buttonId: `${usedPrefix}ytmp3doc ${video.url}`,
            buttonText: { displayText: '💿 Audio doc' }
          },
          {
            buttonId: `${usedPrefix}ytmp4doc ${video.url}`,
            buttonText: { displayText: '🎥 Video doc' }
          }
        ],
        headerType: 4,
        viewOnce: true,
        contextInfo: {
          externalAdReply: {
            showAdAttribution: false,
            title: video.title,
            body: 'Descarga rápida ⚡',
            mediaType: 2,
            sourceUrl: video.url,
            thumbnail: global.icons || null
          }
        }
      },
      { quoted: m }
    )

    await m.react?.('✅')

  } catch (e) {
    console.error('❌ Error play:', e)
    await m.react?.('❌')
    m.reply(typeof e === 'string' ? e : '⚠ Ocurrió un error en la búsqueda')
  }
}

handler.command = ['play', 'playvid', 'play2']
handler.tags = ['descargas']
handler.group = true
handler.limit = 6

export default handler