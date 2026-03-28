import axios from 'axios'
import { writeFileSync, unlinkSync } from 'fs'
import { join } from 'path'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  const EMOJI = {
    wait: '⏳',
    ok: '✅',
    error: '⚠️'
  }

  // 📌 Validación
  if (!text) {
    return conn.reply(
      m.chat,
      `🚩 Ingresa una URL de GitHub\n\nEjemplo:\n${usedPrefix + command} https://github.com/user/repo`,
      m
    )
  }

  // 🔍 Validar URL básica
  if (!/github\.com\/.+\/.+/.test(text)) {
    return conn.reply(
      m.chat,
      '⚠️ URL inválida. Asegúrate de que sea un repositorio de GitHub.',
      m
    )
  }

  try {
    await m.react(EMOJI.wait)

    let repoUrl = text.trim().replace(/\/+$/, '')
    const repoPath = repoUrl.split('github.com/')[1]

    // 🎯 Intentar detectar rama (main / master)
    let branch = 'main'
    let zipUrl = `https://github.com/${repoPath}/archive/refs/heads/${branch}.zip`

    try {
      await axios.head(zipUrl)
    } catch {
      branch = 'master'
      zipUrl = `https://github.com/${repoPath}/archive/refs/heads/${branch}.zip`
    }

    // 📥 Descargar repo
    const res = await axios.get(zipUrl, { responseType: 'arraybuffer' })

    const fileName = `${repoPath.replace('/', '_')}.zip`
    const filePath = join('./', fileName)

    writeFileSync(filePath, res.data)

    // 🚀 Enviar archivo
    await conn.sendMessage(
      m.chat,
      {
        document: res.data,
        fileName,
        mimetype: 'application/zip',
        caption: `📦 *Repositorio clonado*\n\n🔗 ${repoUrl}\n🌿 Rama: *${branch}*\n\n🩻 Rock Lee MD`
      },
      { quoted: m }
    )

    unlinkSync(filePath)

    await m.react(EMOJI.ok)

  } catch (err) {
    console.error(err)

    await m.react(EMOJI.error)

    return conn.reply(
      m.chat,
      `⚠️ Error al clonar el repositorio.\n\n💡 Puede que:\n- No exista\n- Sea privado\n- No tenga rama main/master`,
      m
    )
  }
}

handler.help = ['gitclone <url>']
handler.tags = ['descargas']
handler.command = ['gitclone']

export default handler