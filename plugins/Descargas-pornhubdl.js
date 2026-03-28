import fetch from 'node-fetch'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) {
      return conn.sendMessage(
        m.chat,
        {
          text: `🍭 Ingresa un enlace válido\nEjemplo:\n${usedPrefix + command} https://www.pornhub.com/view_video.php?viewkey=XXXX`
        },
        { quoted: m }
      )
    }

    // ✔ validación básica de URL
    if (!/pornhub\.com/.test(text)) {
      return m.reply('⚠ Ese enlace no parece ser de Pornhub')
    }

    await m.react?.('🔍')

    const apiUrl = `https://www.dark-yasiya-api.site/download/phub?url=${encodeURIComponent(text)}`
    const res = await fetch(apiUrl)

    if (!res.ok) throw 'Error al conectar con la API'

    const json = await res.json()

    const result = json?.result
    const formats = result?.format || []

    if (!formats.length) {
      throw 'No se encontraron formatos disponibles'
    }

    // ✔ mejor calidad disponible
    const videoInfo = formats.find(v => v.quality === '720p') || formats[0]

    const url = videoInfo?.download_url
    const title = result?.video_title || 'Video descargado'

    if (!url) throw 'No se pudo obtener el video'

    await m.react?.('⏳')

    await conn.sendMessage(
      m.chat,
      {
        video: { url },
        caption: `╭━━〔 🎬 DESCARGA 〕━━⬣
┃ 📌 ${title}
╰━━━━━━━━━━━━━━⬣`
      },
      { quoted: m }
    )

    await m.react?.('✅')

  } catch (e) {
    console.error('❌ Error phdl:', e)

    await m.react?.('❌')

    await conn.sendMessage(
      m.chat,
      {
        text: `❌ Error:\n${typeof e === 'string' ? e : 'No se pudo procesar el video'}`
      },
      { quoted: m }
    )
  }
}

handler.command = ['pornhubdl', 'phdl']
handler.tags = ['descargas']
handler.help = ['pornhubdl']

export default handler