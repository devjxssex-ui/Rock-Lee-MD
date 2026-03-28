let handler = async (m, { conn }) => {
  const emoji = '⚠️'

  try {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''

    // ✔ validación correcta
    if (!/webp/.test(mime)) {
      return conn.reply(
        m.chat,
        `${emoji} Responde a un *sticker* para convertirlo en imagen.`,
        m
      )
    }

    await m.react?.('⏳')

    const media = await q.download()
    if (!media) throw 'No se pudo descargar el sticker'

    // 🚀 sin guardar archivo (más rápido)
    await conn.sendMessage(
      m.chat,
      {
        image: media,
        caption: '🖼 Imagen lista 😈'
      },
      { quoted: m }
    )

    await m.react?.('✅')

  } catch (e) {
    console.error('❌ Error toimg:', e)
    await m.react?.('❌')
    conn.reply(
      m.chat,
      `${emoji} Error al convertir el sticker`,
      m
    )
  }
}

handler.help = ['toimg']
handler.tags = ['herramientas']
handler.command = ['toimg']

export default handler