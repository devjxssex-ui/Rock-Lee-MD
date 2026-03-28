
let handler = async (m, { conn }) => {
  try {
    if (!m.quoted) {
      return conn.sendMessage(
        m.chat,
        { text: '🚩 Responde a un *video* para convertirlo en GIF.' },
        { quoted: m }
      )
    }

    const q = m.quoted
    const mime = (q.msg || q).mimetype || ''

    // ✔ validación mejorada
    if (!/video/.test(mime)) {
      return conn.sendMessage(
        m.chat,
        { text: '🚩 El mensaje debe ser un *video*.' },
        { quoted: m }
      )
    }

    // ⏱ límite de duración (evita lag/crash)
    const seconds = (q.msg || q).seconds || 0
    if (seconds > 10) {
      return m.reply('⚠ El video no debe durar más de *10 segundos*')
    }

    await m.react?.('⏳')

    const media = await q.download()
    if (!media) throw 'No se pudo descargar el video'

    await conn.sendMessage(
      m.chat,
      {
        video: media,
        gifPlayback: true,
        caption: '🎞 GIF listo 😈',
        mimetype: 'video/mp4'
      },
      { quoted: m }
    )

    await m.react?.('✅')

  } catch (e) {
    console.error('❌ Error togifaud:', e)
    await m.react?.('❌')
    m.reply('⚠ Ocurrió un error al convertir el video')
  }
}

handler.help = ['togifaud']
handler.tags = ['transformador']
handler.command = ['togifaud']

export default handler;