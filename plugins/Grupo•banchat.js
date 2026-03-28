
const handler = async (m, { conn, isAdmin, isOwner, isROwner }) => {
    const pp = 'https://i.imgur.com/vWnsjh8.jpg'; // Branding miniatura
    let chat = global.db.data.chats[m.chat];

    if (!m.isGroup) 
        return m.reply('*🩻 Este comando solo funciona en grupos 🩻*', m);

    if (!isAdmin && !isOwner && !isROwner) 
        return m.reply('> 🥷 Solo administradores pueden usar este comando 🥷', m);

    if (chat.isBanned) 
        return m.reply('> ❌ Este chat ya está baneado ❌', m);

    chat.isBanned = true;

    // Mensaje estilo Rock Lee 🩻
    await m.reply(
        `🩻 *ROCK LEE BOT 🩻*\n\n✅ El chat ha sido *baneado correctamente*.\n\n✦ Ahora no se podrán usar comandos aquí.`,
        m,
        {
            contextInfo: { 
                externalAdReply: { 
                    title: '•🩻 ROCK LEE BOT 🩻•', 
                    body: 'Sistema de administración de chats', 
                    thumbnail: pp, 
                    sourceUrl: 'https://t.me/RockLeeBot' 
                } 
            }
        }
    );
};

handler.command = ['banchat'];
handler.group = true;
handler.admin = true;

export default handler;