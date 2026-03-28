//⚡ código creado x The Carlos 👑 
//⚠️ no quiten créditos o se activa el caos 🤘

import { areJidsSameUser } from '@whiskeysockets/baileys'

export async function before(m, { participants, conn }) {
    if (!m.isGroup) return

    const chat = global?.db?.data?.chats?.[m.chat]
    if (!chat || !chat.antiBot2) return
    if (chat.__antiBot2Leaving) return

    const mainConn = global.mainBot?.user?.jid ? global.mainBot : global.conn
    if (!mainConn?.user?.jid || !conn?.user?.jid) return

    const mainJid = mainConn.user.jid
    const thisJid = conn.user.jid

    // 🤘 Si soy el bot principal, me quedo firme
    if (areJidsSameUser(mainJid, thisJid)) return

    async function getLidFromJid(id) {
        if (!id) return id
        if (id.endsWith('@lid')) return id
        const res = await conn.onWhatsApp(id).catch(() => [])
        return res?.[0]?.lid || id
    }

    const [mainLid, thisLid] = await Promise.all([
        getLidFromJid(mainJid),
        getLidFromJid(thisJid)
    ])

    const groupMetadata = (conn.chats?.[m.chat]?.metadata)
        || await conn.groupMetadata?.(m.chat).catch(() => null)

    const list = Array.isArray(participants) && participants.length
        ? participants
        : (groupMetadata?.participants || [])

    // 🔍 Buscar si el bot principal ya está en el grupo
    const isBotPresent = list.some(p => {
        const pid = p?.id || p?.jid
        if (!pid) return false
        return (
            areJidsSameUser(pid, mainJid) ||
            areJidsSameUser(pid, mainLid)
        )
    })

    if (!isBotPresent) return

    chat.__antiBot2Leaving = true

    try {
        await conn.reply(
            m.chat,
            `🤘⚡ *ANTI-SUBBOTS ACTIVADO* ⚡🤘

🔥 Ya está el *bot principal* en el grupo  
💀 Evitando conflictos entre máquinas...

🚪 *Me retiro del campo de batalla...*`,
            m
        )

        await conn.groupLeave(m.chat)

    } catch (err) {
        console.error('Error al salir del grupo:', err)
        setTimeout(() => {
            chat.__antiBot2Leaving = false
        }, 5000)
    }
}