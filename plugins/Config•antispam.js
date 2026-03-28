const userSpamData = {}

let handler = m => m

handler.before = async function (m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, isPrems }) {
  const chat = global.db.data.chats[m.chat]
  const settings = global.db.data.settings[conn.user.jid] || {}

  if (!settings.antiSpam) return
  if (m.isGroup && chat.modoadmin) return  

  if (m.isGroup) {
    if (isOwner || isROwner || isAdmin || !isBotAdmin || isPrems) return
  }

  const sender = m.sender
  const user = global.db.data.users[sender]
  const now = Date.now()

  const timeWindow = 5000 // 5 seg
  const messageLimit = 10

  const punishTimes = [30000, 60000, 120000] // 30s, 1m, 2m

  if (!userSpamData[sender]) {
    userSpamData[sender] = {
      last: now,
      count: 1,
      strikes: 0
    }
    return
  }

  let data = userSpamData[sender]
  let diff = now - data.last

  // 📊 Contador
  if (diff <= timeWindow) {
    data.count++
  } else {
    data.count = 1
  }

  data.last = now

  // 🚨 Detectar spam
  if (data.count >= messageLimit) {
    if (data.strikes >= 3) return

    data.strikes++

    const userTag = `@${sender.split('@')[0]}`

    await conn.reply(m.chat,
      `🚨 *ANTI-SPAM*\n\n⚠️ ${userTag} detectado haciendo spam.\n🔢 Nivel: ${data.strikes}/3`,
      m,
      { mentions: [sender] }
    )

    user.banned = true

    // 💀 Expulsión en nivel 3
    if (data.strikes >= 3) {
      await conn.reply(m.chat,
        `💀 *SPAM EXTREMO*\n\n${userTag} fue eliminado del grupo.`,
        m,
        { mentions: [sender] }
      )

      await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')
    }

    // ⏳ Reset automático
    setTimeout(() => {
      if (userSpamData[sender]) {
        userSpamData[sender] = {
          last: Date.now(),
          count: 0,
          strikes: 0
        }
        user.banned = false
      }
    }, punishTimes[data.strikes - 1] || 30000)

    data.count = 0
  }
}

export default handler