import { igdl } from "ruhend-scraper"

const handler = async (m, { args, conn }) => {
  const EMOJI = {
    wait: '⏳',
    ok: '✅',
    error: '⚠️'
  }

  // 📌 Validación
  if (!args[0]) {
    return conn.reply(
      m.chat,
      '🚩 Ingresa un enlace válido de Instagram.\nEjemplo:\n.ig https://instagram.com/...',
      m
    )
  }

  const url = args[0]

  // 🔍 Validar URL básica
  if (!/instagram\.com/.test(url)) {
    return conn.reply(
      m.chat,
      '⚠️ Ese no parece un enlace de Instagram.',
      m
    )
  }

  try {
    await m.react(EMOJI.wait)

    await conn.reply(
      m.chat,
      '⏳ *Descargando contenido de Instagram...*',
      m
    )

    // 📡 Obtener datos
    const res = await igdl(url)
    const data = res?.data

    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('No se encontraron medios')
    }

    // 🎯 Mejor calidad disponible
    const media =
      data.find(v => v.resolution?.includes('1080')) ||
      data.find(v => v.resolution?.includes('720')) ||
      data[0]

    if (!media?.url) {
      throw new Error('No hay media válida')
    }

    // 🚀 Enviar contenido (video o imagen)
    if (media.type === 'video') {
      await conn.sendMessage(
        m.chat,
        {
          video: { url: media.url },
          caption: `🎬 *Instagram Video*\n\n📺 Calidad: *${media.resolution || 'Desconocida'}*\n\n🩻 Rock Lee MD`
        },
        { quoted: m }
      )
    } else {
      await conn.sendMessage(
        m.chat,
        {
          image: { url: media.url },
          caption: `🖼️ *Instagram Imagen*\n\n🩻 Rock Lee MD`
        },
        { quoted: m }
      )
    }

    await m.react(EMOJI.ok)

  } catch (err) {
    console.error(err)

    await m.react(EMOJI.error)

    return conn.reply(
      m.chat,
      `⚠️ Error al descargar.\n\n💡 Puede que:\n- El link sea privado\n- No sea compatible\n- Instagram cambió algo`,
      m
    )
  }
}

handler.command = ['instagram', 'ig']
handler.tags = ['descargas']
handler.help = ['instagram <link>', 'ig <link>']

export default handler