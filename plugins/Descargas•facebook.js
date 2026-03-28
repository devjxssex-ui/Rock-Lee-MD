import { igdl } from 'ruhend-scraper'

const handler = async (m, { conn, args }) => {
  const EMOJI = {
    wait: '🕒',
    ok: '✅',
    error: '⚠️'
  }

  // 📌 Validación
  if (!args[0]) {
    return conn.reply(
      m.chat,
      '🚩 Ingresa un enlace válido de Facebook.\nEjemplo:\n.fb https://facebook.com/...',
      m
    )
  }

  const url = args[0]

  try {
    await m.react(EMOJI.wait)

    // 📡 Aviso
    await conn.reply(
      m.chat,
      '🕒 *Descargando video de Facebook...*',
      m
    )

    // 🔍 Obtener data
    const res = await igdl(url)
    const result = res?.data

    if (!result || !Array.isArray(result) || result.length === 0) {
      throw new Error('Sin resultados')
    }

    // 🎯 Elegir mejor calidad disponible
    const data =
      result.find(v => v.resolution.includes('720')) ||
      result.find(v => v.resolution.includes('360')) ||
      result[0]

    if (!data?.url) {
      throw new Error('No hay URL válida')
    }

    // 🚀 Enviar video
    await conn.sendMessage(
      m.chat,
      {
        video: { url: data.url },
        caption: `🎬 *Facebook Video*\n\n📺 Calidad: *${data.resolution}*\n\n🩻 Rock Lee MD`,
        fileName: 'facebook.mp4',
        mimetype: 'video/mp4'
      },
      { quoted: m }
    )

    await m.react(EMOJI.ok)

  } catch (err) {
    console.error(err)

    await m.react(EMOJI.error)

    return conn.reply(
      m.chat,
      `⚠️ Error al descargar el video.\n\n💡 Verifica que el enlace sea público.`,
      m
    )
  }
}

handler.help = ['facebook <link>', 'fb <link>']
handler.tags = ['descargas']
handler.command = ['facebook', 'fb']

export default handler