
const handler = async (m, { conn }) => {

  const consejo = pickRandom(global.consejo)

  const texto = `🥷 *CONSEJO ROCK LEE 🩻*

『✧』 ${consejo}

💬 *Aplica esto hoy, no mañana.*`

  await conn.sendMessage(
    m.chat,
    { 
      text: texto,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: false,
          title: '🍀 Frase / Consejo',
          body: 'Rock Lee 🩻 • Devjxssex',
          mediaType: 1,
          sourceUrl: global.redes || '',
          thumbnail: global.icons || null
        }
      }
    },
    { quoted: m }
  )
}

handler.help = ['consejo']
handler.tags = ['fun']
handler.command = ['consejo']
handler.exp = 0

export default handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}