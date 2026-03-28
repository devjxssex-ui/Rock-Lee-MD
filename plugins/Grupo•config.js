const handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => 'https://i.imgur.com/vWnsjh8.jpg');

        const opciones = {
            open: 'not_announcement',
            close: 'announcement',
            abierto: 'not_announcement',
            cerrado: 'announcement',
            abrir: 'not_announcement',
            cerrar: 'announcement',
            desbloquear: 'not_announcement',
            bloquear: 'announcement'
        };

        const accion = opciones[(args[0] || '').toLowerCase()];
        if (!accion) {
            return conn.sendMessage(m.chat, {
                text: `🩻 *ROCK LEE BOT 🩻*\n\n*Elija una opción válida para configurar el grupo:*\n\n` +
                      `• ${usedPrefix + command} abrir / desbloquear\n` +
                      `• ${usedPrefix + command} cerrar / bloquear`
            }, { quoted: m });
        }

        await conn.groupSettingUpdate(m.chat, accion);

        if (accion === 'not_announcement') {
            await m.reply(
                `🔓 *¡Grupo abierto!* 🩻\n\nTodos los miembros pueden enviar mensajes.\n\n• Administrador: @${m.sender.split`@`[0]}`,
                null,
                { mentions: [m.sender] }
            );
        } else {
            await m.reply(
                `🔐 *¡Grupo cerrado!* 🩻\n\nSolo los administradores pueden enviar mensajes.\n\n• Administrador: @${m.sender.split`@`[0]}`,
                null,
                { mentions: [m.sender] }
            );
        }
    } catch (err) {
        console.error('Error al actualizar la configuración del grupo:', err);
        m.reply('❌ *Ocurrió un error al intentar actualizar la configuración del grupo.*');
    }
};

handler.help = ['group <abrir/cerrar>', 'grupo <abrir/cerrar>'];
handler.tags = ['grupo'];
handler.command = ['group', 'grupo'];
handler.admin = true;

export default handler;