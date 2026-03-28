// YouTube MP4 - Rock Lee 🩻
// Créditos: Devjxssex + upgrade by The Carlos 👑

import { spawn } from "child_process"
import fs from "fs"
import fetch from "node-fetch"
import yts from "yt-search"
import Jimp from "jimp"

const NAME = "Descargas - Rock Lee 🩻"

// 🖼️ Optimizar imagen
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

  formats: ["144p", "240p", "360p", "720p", "1080p"],

  buildPayload(link, format) {
    if (!this.formats.includes(format)) throw Error("Formato inválido")

    return {
      link,
      format: "mp4",
      videoQuality: format.replace("p", ""),
      filenameStyle: "pretty",
      vCodec: "h264"
    }
  },

  cleanName(name = "video.mp4") {
    return name
      .replace(/[^a-zA-Z0-9]/g, "_")
      .replace(/_+/g, "_")
      .toLowerCase() + ".mp4"
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

    if (!data?.url) throw Error("No se pudo obtener el video")

    const res = await fetch(data.url)
    if (!res.ok) throw Error("Error descargando")

    const buffer = Buffer.from(await res.arrayBuffer())

    return {
      buffer,
      fileName: this.cleanName(data.filename)
    }
  }
}

// ⚡ Optimizar video
async function fastVideo(buffer) {
  const inFile = "./tmp_in.mp4"
  const outFile = "./tmp_out.mp4"

  fs.writeFileSync(inFile, buffer)

  await new Promise((res, rej) => {
    spawn("ffmpeg", ["-i", inFile, "-c", "copy", "-movflags", "faststart", outFile])
      .on("close", code => code === 0 ? res() : rej())
  })

  const out = fs.readFileSync(outFile)
  fs.unlinkSync(inFile)
  fs.unlinkSync(outFile)

  return out
}

// 🎯 Handler
const handler = async (m, { conn, args }) => {
  try {
    if (!args[0]) return m.reply("🎬 Pasa link o nombre")

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
          title: `🎬 ${title}`,
          fileName: NAME,
          jpegThumbnail: thumb
        }
      }
    }

    // 🎥 Descargar
    let { buffer, fileName } = await yt.download(url, "720p")

    // ⚡ Optimizar
    buffer = await fastVideo(buffer)

    // 🛡️ Límite (opcional)
    if (buffer.length > 80 * 1024 * 1024) {
      throw Error("Video muy pesado")
    }

    await conn.sendMessage(
      m.chat,
      {
        video: buffer,
        mimetype: "video/mp4",
        fileName,
        jpegThumbnail: thumb
      },
      { quoted: fkontak }
    )

    await m.react("✅")

  } catch (e) {
    console.error(e)
    await m.react("❌")
    m.reply("❌ Error al descargar video")
  }
}

handler.command = ["ytmp4"]
handler.tags = ["descargas"]
handler.help = ["ytmp4 <link|nombre>"]

export default handler