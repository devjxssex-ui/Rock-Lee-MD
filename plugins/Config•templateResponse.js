// ⚡ Créditos:
// 💻 Base: Rock Lee-MD
// 🧠 Optimización: Devjxssex

import baileys from '@whiskeysockets/baileys'
const { proto, generateWAMessage, areJidsSameUser } = baileys

export async function all(m, chatUpdate) {
  try {
    if (!m || m.isBaileys || !m.message) return

    const msg = m.message

    // ⚡ detectar interacción
    if (
      !msg.buttonsResponseMessage &&
      !msg.templateButtonReplyMessage &&
      !msg.listResponseMessage &&
      !msg.interactiveResponseMessage
    ) return

    let id = ''

    // ⚡ obtener ID limpio
    if (msg.buttonsResponseMessage) {
      id = msg.buttonsResponseMessage.selectedButtonId

    } else if (msg.templateButtonReplyMessage) {
      id = msg.templateButtonReplyMessage.selectedId

    } else if (msg.listResponseMessage) {
      id = msg.listResponseMessage.singleSelectReply?.selectedRowId

    } else if (msg.interactiveResponseMessage) {
      try {
        const json = msg.interactiveResponseMessage.nativeFlowResponseMessage?.paramsJson
        id = JSON.parse(json || '{}').id || ''
      } catch {
        id = ''
      }
    }

    // ⚡ fallback seguro (sin "acción desconocida")
    const text =
      id ||
      msg.buttonsResponseMessage?.selectedDisplayText ||
      msg.templateButtonReplyMessage?.selectedDisplayText ||
      msg.listResponseMessage?.title ||
      ''

    if (!text) return

    // ⚡ generar mensaje simulado
    const message = await generateWAMessage(
      m.chat,
      { text, mentions: m.mentionedJid || [] },
      {
        userJid: this.user.id,
        quoted: m.quoted?.fakeObj,
        generateLinkPreview: false
      }
    )

    // ⚡ props correctas
    message.key.fromMe = areJidsSameUser(m.sender, this.user.id)
    message.key.id = m.key.id
    message.pushName = m.pushName || m.name

    if (m.isGroup) {
      message.key.participant = message.participant = m.sender
    }

    // ⚡ emitir evento
    this.ev.emit('messages.upsert', {
      ...chatUpdate,
      messages: [
        proto.WebMessageInfo.fromObject(message)
      ].map(v => (v.conn = this, v)),
      type: 'append'
    })

  } catch (e) {
    console.error('❌ Error templateresponse:', e)
  }
}