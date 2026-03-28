import { areJidsSameUser } from '@whiskeysockets/baileys'

const handler = async (m, { conn, args, participants, command }) => {

    const memberIds = participants.map(u => u.id);
    let total = 0;
    let ghosts = [];

    for (let userId of memberIds) {
        const userDb = global.db.data.users[userId];
        const userInfo = m.isGroup ? participants.find(u => u.id === userId) : {};

        if ((!userDb || userDb.chat === 0) && !userInfo.isAdmin && !userInfo.isSuperAdmin) {
            if (userDb) {
                if (userDb.whitelist === false) {
                    total++;
                    ghosts.push(userId);
                }
            } else {
                total++;
                ghosts.push(userId);
            }
        }
    }

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    if (total === 0) {
        return conn.reply(m.chat, `🩻 *ROCK LEE BOT 🩻*\n\n🎌 Este grupo está activo, no tiene fantasmas 👻`, m)
    }

    let messageText = `🩻 *ROCK LEE BOT 🩻*\n\n💥 *REVISIÓN DE FANTASMAS*\n\n⚠️ *Lista de fantasmas detectados:*\n`
    messageText += ghosts.map(v => `@${v.split('@')[0]}`).join('\n')
    messageText += `\n\n📝 Nota: El conteo no es 100% exacto; el bot mide desde que se activa en este número.`

    await conn.sendMessage(m.chat, { text: messageText, mentions: ghosts })

    if (command === 'kickfantasmas') {
        const groupMeta = m.isGroup ? await conn.groupMetadata(m.chat) : null
        const botJid = conn.user.jid.split(':')[0] + '@s.whatsapp.net'
        const botIsAdmin = groupMeta.participants.find(p => p.jid === botJid)?.admin

        if (!botIsAdmin) {
            return conn.reply(
                m.chat,
                `🩻 *ROCK LEE BOT 🩻*\n\n🤖 No tengo permisos suficientes para eliminar fantasmas.\n> Necesito ser administrador.\n🔒 Estado actual: *no admin*`,
                m
            )
        }

        await conn.sendMessage(m.chat, {
            text: `🚨 Iniciando eliminación de fantasmas... cada 10 segundos ⚡`,
            mentions: ghosts
        })
        await delay(10000)

        let chat = global.db.data.chats[m.chat]
        chat.welcome = false

        try {
            const usersToKick = ghosts.filter(u => !areJidsSameUser(u, conn.user.jid))
            for (let user of usersToKick) {
                const participant = participants.find(v => areJidsSameUser(v.id, user))
                if (user.endsWith('@s.whatsapp.net') && !(participant?.admin)) {
                    await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
                    await delay(10000)
                }
            }
        } finally {
            chat.welcome = true
        }
    }
}

handler.tags = ['grupo']
handler.command = ['fantasmas', 'kickfantasmas']
handler.group = true
handler.admin = true

export default handler