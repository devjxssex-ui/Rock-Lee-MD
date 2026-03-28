const handler = (m) => m

export async function all(m) {
  try {
    const users = global.db.data.users
    const now = Date.now()

    for (const jid in users) {
      const user = users[jid]

      if (!user?.premium || !user?.premiumTime) continue

      if (now >= user.premiumTime) {
        user.premiumTime = 0
        user.premium = false

        const fkontak = {
          key: {
            fromMe: false,
            participant: '0@s.whatsapp.net',
            remoteJid: 'status@broadcast'
          },
          message: {
            contactMessage: {
              vcard: `BEGIN:VCARD
VERSION:3.0
N:Bot;;;
FN:Bot
item1.TEL;waid=${jid.split('@')[0]}:${jid.split('@')[0]}
item1.X-ABLabel:Mobile
END:VCARD`
            }
          }
        }

        const texto = `╭━━〔 💎 PREMIUM 〕━━⬣
┃ ✖️ Tu suscripción ha expirado
┃ ⏳ Ya no tienes beneficios premium
╰━━━━━━━━━━━━━━⬣

> ✨ Puedes renovarlo cuando quieras`

        await this.sendMessage(
          jid,
          { text: texto, mentions: [jid] },
          { quoted: fkontak }
        )
      }
    }

  } catch (e) {
    console.error('❌ Error premium:', e)
  }
}

export default handler;