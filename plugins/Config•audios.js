// Audios PRO - optimizado

let handler = m => m

handler.all = async function (m) {
  if (!m.isGroup) return
  if (!m.text) return

  const chat = global.db.data.chats[m.chat]
  if (!chat || chat.isBanned || !chat.audios) return

  // ✅ Crear usuario si no existe
  if (!global.db.data.users[m.sender]) {
    global.db.data.users[m.sender] = {
      money: 0,
      exp: 0,
      lastMsg: 0
    }
  }

  let user = global.db.data.users[m.sender]

  // ⏱️ Cooldown de recompensas (1 min)
  let now = Date.now()
  if (now - user.lastMsg > 60000) {
    user.money += 10
    user.exp += 10
    user.lastMsg = now
  }

  // 🔇 Cooldown de audios (5 seg por grupo)
  if (!chat.lastAudio) chat.lastAudio = 0
  if (now - chat.lastAudio < 5000) return

  // 🎧 Lista de audios
  const audios = [
    { regex: /^hola|hello|hi$/i, url: 'https://qu.ax/eGdW.mp3' },
    { regex: /^ara ara$/i, url: 'https://qu.ax/PPgt.mp3' },
    { regex: /bienvenido|🥳|🤗/i, url: 'https://qu.ax/cUYg.mp3' },
    { regex: /buenos dias|buen día/i, url: 'https://qu.ax/wLUF.mp3' },
    { regex: /buenas noches/i, url: 'https://qu.ax/TTfs.mp3' },
    { regex: /wtf|omaiga/i, url: 'https://qu.ax/aPtM.mp3' },
    { regex: /viernes/i, url: 'https://qu.ax/wqXs.mp3' },
    { regex: /siu/i, url: 'https://qu.ax/bfC.mp3' },
    { regex: /uwu/i, url: 'https://qu.ax/hfyX.mp3' },
    { regex: /triste/i, url: 'https://qu.ax/QSyP.mp3' },
    { regex: /among us|sus/i, url: 'https://qu.ax/Mnrz.mp3' }
  ]

  // 🔍 Buscar coincidencia
  for (let a of audios) {
    if (a.regex.test(m.text)) {

      chat.lastAudio = now

      this.sendPresenceUpdate('recording', m.chat)

      await this.sendMessage(m.chat, {
        audio: { url: a.url },
        mimetype: 'audio/mp4',
        ptt: true
      }, { quoted: m })

      break
    }
  }
}

export default handler