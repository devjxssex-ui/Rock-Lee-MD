// código creado x The Carlos 👑 
import fetch from 'node-fetch';

const handler = async (m, { conn, command, usedPrefix }) => {
  if (!db.data.chats[m.chat].nsfw) {
    throw `🚫 *NSFW DESACTIVADO*

> Los comandos +18 están desactivados en este grupo.

⚙️ Actívalo con:
${usedPrefix}enable nsfw`;
  }

  await conn.reply(m.chat, `🔥 Ejecutando *${command}*...`, m, {
    contextInfo: {
      externalAdReply: {
        mediaUrl: null,
        mediaType: 1,
        showAdAttribution: true,
        title: global.packname || 'Pack',
        body: global.wm || 'Bot',
        previewType: 0,
        thumbnail: global.icons || null,
        sourceUrl: global.channel || null
      }
    }
  });

  switch (command) {
    case 'pack': {
      const url = global.pack[Math.floor(Math.random() * global.pack.length)];
      return conn.sendMessage(m.chat, { 
        image: { url }, 
        caption: `🔥 *PACK ACTIVADO* 🔥` 
      }, { quoted: m });
    }

    case 'pack2': {
      const url = global.packgirl[Math.floor(Math.random() * global.packgirl.length)];
      return conn.sendMessage(m.chat, { 
        image: { url }, 
        caption: `🔥 *PACK 2 ACTIVADO* 🔥` 
      }, { quoted: m });
    }

    case 'pack3': {
      const url = global.packmen[Math.floor(Math.random() * global.packmen.length)];
      return conn.sendMessage(m.chat, { 
        image: { url }, 
        caption: `🔥 *PACK 3 ACTIVADO* 🔥` 
      }, { quoted: m });
    }

    case 'videoxxx':
    case 'vídeoxxx': {
      const url = global.videosxxxc[Math.floor(Math.random() * global.videosxxxc.length)];
      return conn.sendMessage(m.chat, { 
        video: { url }, 
        caption: `🔥 Disfruta el video 🔥` 
      }, { quoted: m });
    }

    default: {
      const url = global.videosxxxc2[Math.floor(Math.random() * global.videosxxxc2.length)];
      return conn.sendMessage(m.chat, { 
        video: { url }, 
        caption: `🔥 Disfruta el video 🔥` 
      }, { quoted: m });
    }
  }
};

handler.command = [
  'pack','pack2','pack3','videoxxx','vídeoxxx',
  'videoxxxlesbi','videolesbixxx','pornolesbivid',
  'pornolesbianavid','pornolesbiv','pornolesbianav','pornolesv'
];

handler.register = true;
handler.tags = ['nsfw'];

export default handler;