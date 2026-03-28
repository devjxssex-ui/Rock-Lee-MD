import fg from 'api-dylux'

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const EMOJI = {
    wait: '⏳',
    ok: '✅',
    error: '⚠️'
  }

  // 📌 Validación
  if (!args[0]) {
    return conn.reply(
      m.chat,
      `🚩 Ingresa un enlace de TikTok\n\nEjemplo:\n${usedPrefix + command} https://vm.tiktok.com/...`,
      m
    )
  }

  const url = args[0]

  // 🔍 Validar URL
  if (!/tiktok\.com/.test(url)) {
    return conn.reply(
      m.chat,
      '⚠️ Enlace inválido de TikTok.',
      m
    )
  }

  try {
    await m.react(EMOJI.wait)

    // 📡 Obtener datos
    const data = await fg.tiktok(url)
    const res = data?.result

    if (!res) throw new Error('No se pudo obtener el video')

    const {
      title = 'Sin título',
      play,
      duration = '0s',
      author = {}
    } = res

    const nickname = author.nickname || 'Desconocido'

    if (!play) throw new Error('No hay video disponible')

    // 📝 Caption PRO
    const caption = `
🎬 *TikTok Downloader*

👤 Autor: *${nickname}*
📌 Título: *${title}*
⏱️ Duración: *${duration}*

🩻 Rock Lee MD
`.trim()

    // 🚀 Enviar video (sin marca de agua)
    await conn.sendMessage(
      m.chat,
      {
        video: { url: play },
        caption
      },
      { quoted: m }
    )

    await m.react(EMOJI.ok)

  } catch (err) {
    console.error(err)

    await m.react(EMOJI.error)

    return conn.reply(
      m.chat,
      `⚠️ Error al descargar el TikTok.\n\n💡 Puede que:\n- El video sea privado\n- El link esté roto\n- TikTok cambió su API`,
      m
    )
  }
}

handler.help = ['tiktok <link>', 'tt <link>']
handler.tags = ['descargas']
handler.command = ['tt', 'tiktok', 'ttdl']

export default handler