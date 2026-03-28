const linkRegex = /\b((https?:\/\/|www\.)?[\w-]+\.[\w-]+(?:\.[\w-]+)*(\/[\w\.\-\/]*)?)\b/i

export async function before(m, { conn, isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return true
  if (!m.isGroup) return false

  const chat = global.db.data.chats[m.chat]
  const settings = global.db.data.settings[conn.user.jid] || {}

  if (!chat.antiLink2 || !m.text) return true

  const isLink = linkRegex.test(m.text)
  if (!isLink) return true

  const user = `@${m.sender.split('@')[0]}`
  const groupLink = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`

  // Links permitidos
  if (
    m.text.includes(groupLink) ||
    m.text.includes('youtube.com') ||
    m.text.includes('youtu.be')
  ) return true

  // Admin protegido
  if (isAdmin) return true

  // 🚨 ALERTA
  await conn.sendMessage(m.chat, {
    text: `🚨 *ANTI-LINK 2 ACTIVADO*\n\n⚠️ ${user} envió un enlace no permitido.\n💀 Eliminación en proceso...`,
    mentions: [m.sender]
  }, { quoted: m })

  if (!isBotAdmin) {
    return m.reply('❌ *No soy admin, no puedo eliminar usuarios.*')
  }

  if (!settings.restrict) {
    return m.reply('⚙️ *Modo restrict desactivado, no puedo ejecutar la acción.*')
  }

  try {
    // borrar mensaje
    await conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: m.key.id,
        participant: m.key.participant || m.sender
      }
    })

    // expulsar usuario
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')

  } catch (e) {
    return m.reply(`❌ *Error en Anti-Link2:* ${e}`)
  }

  return true
}