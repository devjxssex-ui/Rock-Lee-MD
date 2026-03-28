const handler = async (m, { conn }) => {
    if (!m.mentionedJid?.[0] && !m.quoted) {
        let text = `🩻 *ROCK LEE BOT 🩻*\n\n*Menciona o responde al usuario que deseas degradar de administrador.*`
        return m.reply(text, m.chat, { mentions: conn.parseMention(text) })
    }

    let user = m.mentionedJid?.[0] ? m.mentionedJid[0] : m.quoted.sender
    await conn.groupParticipantsUpdate(m.chat, [user], 'demote')
    
    m.reply(
        `✅ *Usuario degradado de administrador!* 🩻\n\n• Usuario: @${user.split`@`[0]}\n\n` +
        `⚡ Recuerda, ¡el camino del ninja requiere paciencia y disciplina!`,
        null,
        { mentions: [user] }
    )
}

handler.help = ['demote']
handler.tags = ['grupo']
handler.command = ['demote']
handler.group = true
handler.admin = true

export default handler