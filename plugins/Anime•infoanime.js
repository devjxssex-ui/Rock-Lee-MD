
import fetch from 'node-fetch'

var handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) 
    return conn.sendMessage(m.chat, { 
      text: `💪🔥 *¡NECESITO UN OBJETIVO DE ENTRENAMIENTO!* 🔥💪\n\n🥋 Ejemplo:\n${usedPrefix + command} black clover` 
    }, { quoted: m })

  let res = await fetch('https://api.jikan.moe/v4/manga?q=' + encodeURIComponent(text))
  if (!res.ok) 
    return conn.sendMessage(m.chat, { text: `💥 *¡FALLO EN EL ENTRENAMIENTO!*` }, { quoted: m })

  let json = await res.json()
  if (!json.data || !json.data[0]) 
    return conn.sendMessage(m.chat, { 
      text: `❌ *NO ENCONTRÉ ESE ANIME, ENTRENA MÁS DURO*\n\n🔍 Búsqueda: ${text}` 
    }, { quoted: m })

  let manga = json.data[0]
  let author = manga.authors?.[0]?.name || 'Desconocido'

  let animeInfo = `
🥋 *TÍTULO:* ${manga.title_japanese || manga.title}
📺 *TIPO:* ${manga.type || 'N/A'}
📊 *ESTADO:* ${manga.status || 'N/A'}
📚 *CAPÍTULOS:* ${manga.chapters || 'N/A'}
📦 *VOLÚMENES:* ${manga.volumes || 'N/A'}
⭐ *PUNTAJE:* ${manga.score || 'N/A'}
🔥 *FAVORITOS:* ${manga.favorites || 'N/A'}
👥 *MIEMBROS:* ${manga.members || 'N/A'}
👨‍🏫 *AUTOR:* ${author}

🔗 *LINK:* ${manga.url || 'N/A'}

📝 *SINOPSIS:*
${manga.synopsis || 'N/A'}
  `.trim()

  await conn.sendMessage(m.chat, {
    image: { url: manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url },
    caption: `
💪🔥 *ANÁLISIS COMPLETADO* 🔥💪

${animeInfo}

⚡ *¡SIGUE ENTRENANDO HASTA SER EL MÁS FUERTE!*`
  }, { quoted: m })
}

handler.help = ['infoanime']
handler.tags = ['anime']
handler.command = ['infoanime', 'animeinfo']
handler.register = true

export default handler