let handler = async (m, { conn, text, args, usedPrefix, command }) => {

    if (!args[0]) throw `🩻 *ROCK LEE BOT 🩻*\n\n⚠️ *_Ingresa un texto para iniciar la encuesta._*\n\n📌 Ejemplo:\n*${usedPrefix + command}* opción1|opción2|opción3`
    
    if (!text.includes('|')) throw `🩻 *ROCK LEE BOT 🩻*\n\n⚠️ Separe las opciones de la encuesta con *|*\n\n📌 Ejemplo:\n*${usedPrefix + command}* opción1|opción2|opción3`
    
    let opciones = []
    let partes = text.split('|')
    for (let i = 0; i < partes.length; i++) {
        opciones.push([partes[i]])
    }

    return conn.sendPoll(
        m.chat,
        `🩻 *ENCUESTA ROCK LEE BOT 🩻*\n\n⚡ ¡Participa y demuestra tu espíritu ninja!`,
        opciones,
        m
    )
}

handler.help = ['encuesta <opcion1|opcion2>']
handler.tags = ['grupo']
handler.command = ['poll', 'encuesta']
handler.group = true

export default handler