const handler = async (m, { conn, command, text }) => {
  if (!text) {
    return conn.reply(m.chat, '🚩 Menciona a un usuario o escribe un nombre.', m)
  }

  // porcentaje real
  const porcentaje = Math.floor(Math.random() * 101)

  let emoji = ''
  let descripcion = ''

  switch (command) {
    case 'gay':
      emoji = '🏳️‍🌈'
      descripcion = `💙 ${text.toUpperCase()} es *${porcentaje}%* gay ${emoji}`
      break

    case 'lesbiana':
      emoji = '🏳️‍🌈'
      descripcion = `💗 ${text.toUpperCase()} es *${porcentaje}%* lesbiana ${emoji}`
      break

    case 'pajero':
    case 'pajera':
      emoji = '😏💦'
      descripcion = `🧡 ${text.toUpperCase()} es *${porcentaje}%* ${command} ${emoji}`
      break

    case 'puto':
    case 'puta':
      emoji = '🔥🥵'
      descripcion = `😼 ${text.toUpperCase()} es *${porcentaje}%* ${command} ${emoji}`
      break

    case 'manco':
    case 'manca':
      emoji = '💩'
      descripcion = `🥷 ${text.toUpperCase()} es *${porcentaje}%* ${command} ${emoji}`
      break

    case 'rata':
      emoji = '🐁'
      descripcion = `👑 ${text.toUpperCase()} es *${porcentaje}%* rata ${emoji}`
      break

    case 'prostituto':
    case 'prostituta':
      emoji = '🫦👅'
      descripcion = `✨ ${text.toUpperCase()} es *${porcentaje}%* ${command} ${emoji}`
      break

    default:
      return m.reply('☁️ Comando inválido.')
  }

  const frases = [
    "El universo habló 🪐",
    "Confirmado por ciencia 🧪",
    "Resultado definitivo ⚡"
  ]

  const final = `💫 *CALCULADORA ROCK LEE 🩻*

${descripcion}

➤ ${frases[Math.floor(Math.random() * frases.length)]}`

  // animación
  const frames = [
    "《 █▒▒▒▒▒▒▒▒▒▒》10%",
    "《 ███▒▒▒▒▒▒▒▒》30%",
    "《 █████▒▒▒▒▒》50%",
    "《 ████████▒▒》80%",
    "《 ██████████》100%"
  ]

  let { key } = await conn.sendMessage(m.chat, { text: '🤍 Calculando...' }, { quoted: m })

  for (let i = 0; i < frames.length; i++) {
    await new Promise(res => setTimeout(res, 700))
    await conn.sendMessage(m.chat, { text: frames[i], edit: key })
  }

  await conn.sendMessage(m.chat, { text: final, edit: key })
}

handler.help = ['gay @tag', 'lesbiana @tag', 'pajero @tag']
handler.tags = ['fun']
handler.command = ['gay', 'lesbiana', 'pajero', 'pajera', 'puto', 'puta', 'manco', 'manca', 'rata', 'prostituta', 'prostituto']
handler.group = true
handler.register = true

export default handler