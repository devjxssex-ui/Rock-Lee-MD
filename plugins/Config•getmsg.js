
// ⚡ Créditos:
// 💻 Base: Rock Lee-MD
// 🧠 Optimización: Devjxssex

export async function all(m) {
  try {
    // 🚫 filtros básicos
    if (!m?.chat?.endsWith('.net')) return
    if (m?.fromMe || m?.isBaileys) return
    if (m?.key?.remoteJid?.endsWith('status@broadcast')) return

    const chat = global?.db?.data?.chats?.[m.chat]
    const user = global?.db?.data?.users?.[m.sender]

    if (!chat || chat.isBanned) return
    if (!user || user.banned) return

    const msgs = global?.db?.data?.msgs
    if (!msgs) return

    const text = m.text?.trim()
    if (!text || !(text in msgs)) return

    // ⚡ parse seguro
    const raw = msgs[text]

    const parsed = JSON.parse(JSON.stringify(raw), (_, v) => {
      if (
        v &&
        typeof v === 'object' &&
        v.type === 'Buffer' &&
        Array.isArray(v.data)
      ) {
        return Buffer.from(v.data)
      }
      return v
    })

    const msg = this.serializeM(parsed)

    // ⚡ reenviar mensaje
    await msg.copyNForward(m.chat, true)

  } catch (e) {
    console.error('❌ Error getmsg:', e)
  }
}