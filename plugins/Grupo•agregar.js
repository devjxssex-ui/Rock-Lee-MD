const handler = async (m, { conn, args, text, usedPrefix, command }) => {
    // Miniatura del bot para branding
    const pp = 'https://i.imgur.com/vWnsjh8.jpg';
    
    // Determinar a quién añadir
    let who = m.isGroup
        ? m.mentionedJid?.[0] || m.quoted?.sender || text
        : m.chat;

    if (!global.db.data.settings[conn.user.jid].restrict) 
        return conn.reply(m.chat, `🚩 *Este comando está deshabilitado por mi creador*`, m);

    if (!text) 
        return m.reply(`🍟 Ingrese el número de la persona que quieres añadir al grupo.\n\n🚩 Ejemplo:\n*${usedPrefix + command} 5556667777*`);

    if (text.includes('+')) 
        return m.reply(`🍟 Ingrese el número todo junto, sin el *(+)*`);

    if (isNaN(text)) 
        return m.reply(`🍟 El número debe contener solo dígitos`);

    // Preparar datos
    let group = m.chat;
    let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group);
    let jid = text.replace(/\D/g, '') + '@s.whatsapp.net';
    let nom = await conn.getName(m.sender);
    let fecha = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    let tiempo = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Enviar invitación privada al usuario
    await conn.reply(jid, 
        `🩻 *ROCK LEE BOT 🩻* 🥷\n\n🍟 ¡Hola! ${nom} te ha invitado a un grupo.\n\n*Link de invitación:*\n${link}`, 
        m, 
        { contextInfo: { externalAdReply: { title: '•🩻 ROCK LEE BOT 🩻•', body: 'Invitación de grupo', thumbnail: pp, sourceUrl: 'https://t.me/RockLeeBot' } }, mentions: [m.sender] }
    );

    // Confirmación en el grupo
    await m.reply(
        `🍟 *Enviando invitación al privado de ${nom}*\n\n📅 *${fecha}*\n⏰ *${tiempo}*`,
        m,
        { contextInfo: { externalAdReply: { title: '•🩻 ROCK LEE BOT 🩻•', body: 'Sistema de invitación', thumbnail: pp, sourceUrl: 'https://t.me/RockLeeBot' } } }
    );
};

handler.help = ['add'];
handler.tags = ['grupo'];
handler.command = ['add', 'agregar', 'añadir'];
handler.group = true;
handler.admin = true;
handler.fail = null;

export default handler;