let handler = async (m, { conn, args, command, usedPrefix }) => {

  if (!db.data.chats[m.chat].nsfw && m.isGroup) {
    return m.reply('🚫 *Contenido +18 desactivado en este grupo*\n\n💪 Usa:\n.enable nsfw');
  }

  if (!args[0]) {
    return conn.reply(m.chat, 
      `💪 *Necesito una búsqueda*\n\nEjemplo:\n${usedPrefix + command} anime`, 
    m);
  }

  try {
    let searchResults = await searchPornhub(args[0]);

    let teks = searchResults.result.map((v, i) => 
`🎬 *RESULTADO ${i + 1}*

📌 *Título:* ${v.title}
⏱ *Duración:* ${v.duration}
👀 *Vistas:* ${v.views}
🔗 *Link:* ${v.url}

━━━━━━━━━━━━━━━`).join('\n\n');

    if (searchResults.result.length === 0) {
      teks = '❌ *No se encontraron resultados*';
    }

    conn.reply(m.chat, teks, m);

  } catch (e) {
    return conn.reply(m.chat, `⚠️ Error: ${e.message}`, m);
  }
};

handler.tags = ['buscador']; 
handler.help = ['pornhubsearch']; 
handler.command = ['phsearch', 'pornhubsearch'];

export default handler;