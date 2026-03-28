import { generateWAMessage, proto, areJidsSameUser } from '@whiskeysockets/baileys'

// ⚡ Créditos:
// 💻 Base: Rock Lee-MD
// 🧠 Optimización: Devjxssex

export async function all(m, chatUpdate) {
  try {
    if (!m?.message || !m?.msg?.fileSha256) return

    // 🔑 obtener hash
    const fileSha = Buffer.from(m.msg.fileSha256).toString('base64')

    const data = global?.db?.data?.sticker?.[fileSha]
    if (!data) return

    const { text = '', mentionedJid = [] } = data

    // ⚡ generar mensaje rápido
    const msgGen = await generateWAMessage(
      m.chat,
      { text, mentions: mentionedJid },
      {
        userJid: this.user.id,
        quoted: m.quoted?.fakeObj
      }
    )

    // ⚡ ajustar propiedades
    msgGen.key.fromMe = areJidsSameUser(m.sender, this.user.id)
    msgGen.key.id = m.key.id
    msgGen.pushName = m.pushName

    if (m.isGroup) msgGen.participant = m.sender

    // ⚡ emitir mensaje
    this.ev.emit('messages.upsert', {
      ...chatUpdate,
      messages: [proto.WebMessageInfo.fromObject(msgGen)],
      type: 'append'
    })

  } catch (e) {
    console.error('❌ Error cmdWithMedia:', e)
  }
}