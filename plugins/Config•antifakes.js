let handler = m => m

handler.before = async function (m, { conn, isBotAdmin }) {
  if (!m.isGroup) return !1

  let chat = global.db.data.chats[m.chat]
  if (!isBotAdmin || !chat.antifake) return !1

  // Prefijos bloqueados
  const fakePrefixes = [
    '6', '90', '212', '92', '93',
    '94', '7', '49', '2', '91', '48'
  ]

  const isFake = fakePrefixes.some(prefix => 
    m.sender.startsWith(prefix)
  )

  if (isFake) {
    global.db.data.users[m.sender].block = true

    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')

    await conn.sendMessage(m.chat, {
      text: `⚡ *ANTI-FAKE ACTIVADO*\n\n🚫 Usuario eliminado automáticamente.\n🔍 Prefijo detectado como sospechoso.`
    }, { quoted: m })
  }

  return !1
}

export default handler