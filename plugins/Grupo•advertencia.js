const handler = async (m, { conn, text, command, usedPrefix }) => {
    // Imagen de portada del bot
    const pp = 'https://i.imgur.com/vWnsjh8.jpg'; 
    let who;

    // Determinar a quién se va a advertir
    if (m.isGroup) who = m.mentionedJid?.[0] || m.quoted?.sender || text;
    else who = m.chat;

    if (!who) {
        const warntext = `🚩 *Etiqueta a alguien o responde a un mensaje para advertir*\n\n*Ejemplo:*\n*${usedPrefix + command} @tag*`;
        return conn.reply(m.chat, warntext, m, {
            contextInfo: { 
                externalAdReply: {
                    title: '•🩻 ROCK LEE BOT 🩻•',
                    body: 'Sistema de advertencias',
                    sourceUrl: 'https://t.me/RockLeeBot',
                    thumbnail: pp
                }
            }
        });
    }

    // Inicializar datos del usuario en la DB
    const user = global.db.data.users[who] || {};
    global.db.data.users[who] = user;
    user.warn = user.warn || 0;

    // Evitar advertir al propietario
    const usuario = conn.user.jid.split`@`[0] + '@s.whatsapp.net';
    for (let i = 0; i < global.owner.length; i++) {
        let ownerNumber = global.owner[i][0];
        if (usuario.replace(/@s\.whatsapp\.net$/, '') === ownerNumber) {
            let aa = ownerNumber + '@s.whatsapp.net';
            return conn.reply(m.chat, `⚠️ No puedes advertir al propietario del bot 🩻`, m, {
                contextInfo: { externalAdReply: { title: '•🩻 ROCK LEE BOT 🩻•', body: 'Advertencia denegada', thumbnail: pp, sourceUrl: 'https://t.me/RockLeeBot' } },
                mentions: [aa]
            });
        }
    }

    const dReason = 'Sin motivo';
    const msgtext = text || dReason;
    const sdms = msgtext.replace(/@\d+-?\d* /g, '');

    // Aumentar contador de advertencias
    user.warn += 1;
    await m.reply(
        `🩻 *ROCK LEE BOT* 🩻\n\n*@${who.split`@`[0]}* ha recibido una advertencia en este grupo!\nMotivo: ${sdms}\n*Advertencias: ${user.warn}/3*`,
        m, {
            contextInfo: {
                externalAdReply: {
                    title: '•🩻 Sistema de Advertencias 🩻•',
                    body: 'Mantén el orden en el grupo',
                    thumbnail: pp,
                    sourceUrl: 'https://t.me/RockLeeBot'
                }
            },
            mentions: [who]
        }
    );

    // Si alcanza 3 advertencias, se resetea y se expulsa
    if (user.warn >= 3) {
        user.warn = 0;
        await m.reply(
            `🚨 *ALERTA MAXIMA* 🚨\n*@${who.split`@`[0]}* ha superado las 3 advertencias!\nAhora será removido del grupo 🩻`,
            m, {
                contextInfo: {
                    externalAdReply: {
                        title: '•🩻 ROCK LEE BOT 🩻•',
                        body: 'Usuario expulsado',
                        thumbnail: pp,
                        sourceUrl: 'https://t.me/RockLeeBot'
                    }
                },
                mentions: [who]
            }
        );
        await conn.groupParticipantsUpdate(m.chat, [who], 'remove');
    }

    return false;
};

handler.command = ['advertir', 'advertencia', 'warn', 'warning'];
handler.group = true;
handler.admin = true;
export default handler;