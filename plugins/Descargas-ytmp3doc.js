// YouTube MP3 DOC - Rock Lee MD
// Créditos: Devjxssex + upgrade by The Carlos 👑

import fetch from "node-fetch"
import yts from "yt-search"
import Jimp from "jimp"

const NAME = "Descargas - Black Clover ⚔️"

// 🖼️ Optimizar thumbnail
async function resizeImage(buffer, size = 300) {
  const img = await Jimp.read(buffer)
  return img.resize(size, size).quality(80).getBufferAsync(Jimp.MIME_JPEG)
}

// ⚙️ Core
const yt = {
  base: "https://cnv.cx",
  headers: {
    "accept-encoding": "gzip, deflate, br",
    origin: "https://frame.y2meta-uk.com",
    "user-agent": "Mozilla/5.0"
  },

  formats: ["128k", "320k"],

  buildPayload(link, format) {
    if (!this.formats.includes(format)) throw Error("Formato inválido")

    return {
      link,
      format: "mp3",
      audioBitrate: format.replace("k", ""),
      filenameStyle: "pretty"
    }
  },

  cleanName(name = "audio.mp3") {
    return name
      .replace(/[^a-zA-Z0-9]/g, "_")
      .replace(/_+/g, "_")
      .toLowerCase() + ".mp3"
  },

  async getKey() {
    const r = await fetch(this.base + "/v2/sanity/key", { headers: this.headers })
    return r.json()
  },

  async convert(url, format) {
    const { key } = await this.getKey()

    const r = await fetch(this.base + "/v2/converter", {
      method: "POST",
      headers: { ...this.headers, key },
      body: new URLSearchParams(this.buildPayload(url, format))
    })

    return r.json()
  },

  async download(url, format) {
    const data = await this.convert(url, format)

    if (!data?.url) throw Error("No se pudo obtener el audio")

    const res = await fetch(data.url)
    if (!res.ok) throw Error("Error descargando")

    const buffer = Buffer.from(await res.arrayBuffer())

    return {
      buffer,
      fileName: this.cleanName(data.filename)
    }
  }
}

// 🎯 Handler
const handler = async (m, { conn, args }) => {
  try {
    if (!args[0]) return m.reply("🎵 Pasa link o nombre")

    await m.react("⌛")

    let url, title, thumbnail

    // 🔗 Detectar link o búsqueda
    if (/youtu/.test(args[0])) {
      const id =
        args[0].split("v=")[1]?.split("&")[0] ||
        args[0].split("/").pop()

      const info = await yts({ videoId: id })

      url = `https://youtube.com/watch?v=${id}`
      title = info.title
      thumbnail = info.thumbnail
    } else {
      const search = await yts.search(args.join(" "))
      if (!search.videos.length) return m.reply("❌ No encontrado")

      const v = search.videos[0]
      url = v.url
      title = v.title
      thumbnail = v.thumbnail
    }

    // 🖼️ Thumbnail
    const thumb = await resizeImage(
      Buffer.from(await (await fetch(thumbnail)).arrayBuffer())
    )

    // 📦 Fake contacto
    const fkontak = {
      key: { fromMe: false, participant: "0@s.whatsapp.net" },
      message: {
        documentMessage: {
          title: `🎵 ${title}`,
          fileName: NAME,
          jpegThumbnail: thumb
        }
      }
    }

    // 🎧 Descargar audio
    const { buffer, fileName } = await yt.download(url, "128k")

    // 🛡️ Limite de peso (opcional)
    if (buffer.length > 50 * 1024 * 1024) {
      throw Error("El archivo es demasiado pesado")
    }

    await conn.sendMessage(
      m.chat,
      {
        document: buffer,
        mimetype: "audio/mpeg",
        fileName,
        jpegThumbnail: thumb
      },
      { quoted: fkontak }
    )

    await m.react("✅")

  } catch (e) {
    console.error(e)
    await m.react("❌")
    m.reply("❌ Error al descargar audio")
  }
}

handler.command = ["ytmp3doc"]
handler.tags = ["descargas"]
handler.help = ["ytmp3doc <link|nombre>"]

export default handler