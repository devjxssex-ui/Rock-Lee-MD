import { performance } from 'perf_hooks'

const handler = async (m, { conn, text }) => {

  if (!text) {
    return conn.reply(m.chat, '🚩 Menciona a un usuario para el doxeo (juego).', m)
  }

  const startMsg = '🚩 Iniciando escaneo...'
  const frames = ['10%', '30%', '50%', '80%', '100%']

  const { key } = await conn.sendMessage(m.chat, { text: startMsg }, { quoted: m })

  for (let i = 0; i < frames.length; i++) {
    await delay(700)
    await conn.sendMessage(m.chat, { text: `🛰️ ${frames[i]}`, edit: key })
  }

  const speed = (performance.now()).toFixed(4)

  const resultado = `🥷 *DOXEO SIMULADO - Rock Lee 🩻*

⚠️ *Esto es un juego, no es información real*

📅 ${new Date().toLocaleDateString()}
⏰ ${new Date().toLocaleTimeString()}

📢 *Resultados:*

👤 Nombre: ${text}
🌐 IP: 192.168.${rand(0,255)}.${rand(0,255)}
📡 ISP: RockNet Systems
🧠 Dispositivo: Android/Linux
🔐 Seguridad: ${pickRandom(['Alta','Media','Baja'])}
📍 Ubicación: Lat ${rand(10,99)}.${rand(1000,9999)} / Lon ${rand(10,99)}.${rand(1000,9999)}
💻 Puertos: ${rand(1000,9999)}, ${rand(1000,9999)}
🧬 ID: ${rand(100000,999999)}

⚡ Velocidad de escaneo: ${speed} ms`

  await conn.sendMessage(
    m.chat,
    { text: resultado, mentions: conn.parseMention(resultado) },
    { quoted: m }
  )
}

handler.help = ['doxear @tag']
handler.tags = ['fun']
handler.command = ['doxear', 'doxeo', 'doxxeo']
handler.group = true
handler.register = true

export default handler

// utils
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const delay = (ms) => new Promise(res => setTimeout(res, ms))