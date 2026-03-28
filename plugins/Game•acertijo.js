import fs from 'fs'

const timeout = 60000
const reward = 10000

const handler = async (m, { conn }) => {
  conn.tekateki = conn.tekateki || {}

  const id = m.chat

  // 🚫 Evitar duplicados
  if (id in conn.tekateki) {
    return conn.reply(
      m.chat,
      '⚠️ Ya hay un acertijo activo en este chat.',
      conn.tekateki[id][0]
    )
  }

  // 📂 Leer preguntas
  const data = JSON.parse(
    fs.readFileSync('./src/game/acertijo.json')
  )

  const json = data[Math.floor(Math.random() * data.length)]

  // 🧩 Crear pista (ocultar letras)
  const clue = json.response.replace(/[A-Za-zÁÉÍÓÚáéíóúÑñ]/g, '_')

  const caption = `
🧠 *ACERTIJO ACTIVADO*

❓ ${json.question}

🔎 Pista: *${clue}*

⏳ Tiempo: *${timeout / 1000}s*
💰 Premio: *+${reward} monedas*

🩻 Rock Lee MD
`.trim()

  const msg = await conn.reply(m.chat, caption, m)

  // 🧠 Guardar juego
  conn.tekateki[id] = [
    msg,
    json,
    reward,
    setTimeout(async () => {
      if (conn.tekateki[id]) {
        await conn.reply(
          m.chat,
          `⏰ Tiempo agotado\n\n💡 Respuesta: *${json.response}*`,
          msg
        )
        delete conn.tekateki[id]
      }
    }, timeout)
  ]
}

handler.help = ['acertijo']
handler.tags = ['fun']
handler.command = ['acertijo', 'acert', 'adivinanza', 'tekateki']

export default handler