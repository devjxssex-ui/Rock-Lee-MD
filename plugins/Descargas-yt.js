// YouTube Downloader PRO - Rock Lee MD
// Créditos: Devjxssex + upgrade by The Carlos 👑

import { spawn } from 'child_process'
import fs from 'fs'
import fetch from 'node-fetch'
import yts from 'yt-search'
import Jimp from 'jimp'

const NAME = 'Descargas - Black Clover ⚔️'

// 🖼️ Optimizar thumbnail
async function resizeImage(buffer, size = 300) {
  const img = await Jimp.read(buffer)
  return img.resize(size, size).quality(80).getBufferAsync(Jimp.MIME_JPEG)
}

// ⚙️ Core downloader
const yt = {
  baseUrl: 'https://cnv.cx',

  headers: {
    'accept-encoding': 'gzip, deflate, br',
    origin: 'https://frame.y2meta-uk.com',
    'user-agent': 'Mozilla/5.0'
  },

  formats: ['128k', '320k', '144p', '240p', '360p', '720p', '1080p'],

  buildPayload(link, f) {
    if (!this.formats.includes(f)) throw Error('Formato inválido')

    const isAudio = f.includes('k')

    return {
      link,
      format: isAudio ? 'mp3' : 'mp4',
      audioBitrate: isAudio ? f.replace('k', '') : '128',
      videoQuality: !isAudio ? f.replace('p', '') : '720',
      filenameStyle: 'pretty',
      vCodec: 'h264'
    }
  },

  cleanName(name) {
    return name
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .toLowerCase()
  },

  async getKey() {
    const res = await fetch(this.baseUrl + '/v2/sanity/key', { headers: this.headers })
    return res.json()
  },

  async convert(url, format) {
    const { key } = await this.getKey()

    const res = await fetch(this.baseUrl + '/v2/converter', {
      method: 'POST',
      headers: { ...this.headers, key },
      body: new URLSearchParams(this.buildPayload(url, format))
    })

    return res.json()
  },

  async download(url, format) {
    const { url: dl, filename } = await this.convert(url, format)

    if (!dl) throw Error('No se pudo obtener el enlace')

    const res = await fetch(dl)
    if (!res.ok) throw Error('Error descargando archivo')

    const buffer = Buffer.from(await res.arrayBuffer())

    return {
      buffer,
      fileName: this.cleanName(filename || 'file')
    }
  }
}

// ⚡ Optimizar video (faststart)
async function fastVideo(buffer) {
  const inFile = './tmp_in.mp4'
  const outFile = './tmp_out.mp4'

  fs.writeFileSync(inFile, buffer)

  await new Promise((res, rej) => {
    spawn('ffmpeg', ['-i', inFile, '-c', 'copy', '-movflags', 'faststart', outFile])
      .on('close', code => code === 0 ? res() : rej())
  })

  const out = fs.readFileSync(outFile)
  fs.unlinkSync(inFile)
  fs.unlinkSync(outFile)

  return out
}

// 🎯 Handler principal
const handler = async (m, { conn, args, command }) => {
  try {
    if (!args[0]) return m.reply('🚩 Ingresa un nombre o link')

    await m.react('⌛')

    let url, title, thumbnail

    // 🔗 Detectar link o búsqueda
    if (/youtu/.test(args[0])) {
      const id =
        args[0].split('v=')[1]?.split('&')[0] ||
        args[0].split('/').pop()

      const info = await yts({ videoId: id })

      url = `https://youtube.com/watch?v=${id}`
      title = info.title
      thumbnail = info.thumbnail
    } else {
      const res = await yts.search(args.join(' '))
      if (!res.videos.length) return m.reply('❌ No encontrado')

      const v = res.videos[0]
      url = v.url
      title = v.title
      thumbnail = v.thumbnail
    }

    // 🖼️ Thumbnails
    const thumb = await resizeImage(
      Buffer.from(await (await fetch(thumbnail)).arrayBuffer())
    )

    // 📦 Fake contacto
    const fkontak = {
      key: { fromMe: false, participant: '0@s.whatsapp.net' },
      message: {
        documentMessage: {
          title: `🎬 ${title}`,
          fileName: NAME,
          jpegThumbnail: thumb
        }
      }
    }

    // 🎧 AUDIO
    if (command === 'ytmp3') {
      const { buffer, fileName } = await yt.download(url, '128k')

      await conn.sendMessage(
        m.chat,
        {
          audio: buffer,
          mimetype: 'audio/mpeg',
          fileName: fileName + '.mp3',
          jpegThumbnail: thumb
        },
        { quoted: fkontak }
      )
    }

    // 🎥 VIDEO DOC
    if (command === 'ytmp4doc') {
      let { buffer, fileName } = await yt.download(url, '720p')

      buffer = await fastVideo(buffer)

      await conn.sendMessage(
        m.chat,
        {
          document: buffer,
          mimetype: 'video/mp4',
          fileName: fileName + '.mp4',
          jpegThumbnail: thumb
        },
        { quoted: fkontak }
      )
    }

    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply('❌ Error al descargar, intenta con otro video')
  }
}

handler.command = ['ytmp3', 'ytmp4doc']
handler.tags = ['descargas']
handler.help = ['ytmp3 <link|nombre>', 'ytmp4doc <link|nombre>']

export default handler