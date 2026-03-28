const linkRegex = /(https?:\/\/(?:www\.)?(?:t\.me|telegram\.me|whatsapp\.com)\/\S+)|(https?:\/\/chat\.whatsapp\.com\/\S+)|(https?:\/\/whatsapp\.com\/channel\/\S+)/i  

export async function before(m, { conn, isAdmin }) {
  if (m.isBaileys && m.fromMe) return true
  if (!m.isGroup) return false

  let chat = global.db.data.chats[m.chat]
  let settings = global.db.data.settings[conn.user.jid] || {}

  if (!chat.antiLink || !m.text) return true

  let isLink = linkRegex.test(m.text)
  if (!isLink) return true

  let metadata = await conn.groupMetadata(m.chat).catch(() => null)
  let participant = metadata?.participants?.find(p => 
    (p.id || p.jid) === (m.sender || m.key?.participant)
  )

  const groupLink = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`

  // 🛡️ Dueño del grupo
  if (participant?.admin === 'superadmin' && m.text.includes('chat.whatsapp.com')) {
    await conn.reply(m.chat, `⚡ *ANTI-LINK ACTIVADO*\n\n👑 Eres el creador del grupo… puedes romper las reglas 😎`, m)
    return true
  }

  // 🛡️ Admin
  if (isAdmin) {
    await conn.reply(m.chat, `⚡ *ANTI-LINK*\n\n🛡️ Eres admin, no serás eliminado.`, m)
    return true
  }

  // 🔗 Link del mismo grupo
  if (m.text.includes(groupLink)) return true

  // 🚨 Usuario normal
  await conn.reply(
    m.chat,
    `🚨 *ANTI-LINK DETECTADO*\n\n⚠️ @${m.sender.split('@')[0]} rompió las reglas.\n💀 Eliminación en proceso...`,
    m,
    { mentions: [m.sender] }
  )

  if (settings.restrict) {
    try {
      // eliminar mensaje
      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant || m.sender
        }
      })

      // expulsar
      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')

    } catch (e) {
      return conn.reply(m.chat, `❌ *Error al ejecutar Anti-Link:* ${e}`, m)
    }
  } else {
    await conn.reply(
      m.chat,
      `⚙️ *Modo restrict desactivado*\n\nNo puedo eliminar a @${m.sender.split('@')[0]}`,
      m,
      { mentions: [m.sender] }
    )
  }

  return true
}