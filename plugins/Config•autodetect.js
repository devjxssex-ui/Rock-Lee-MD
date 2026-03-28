export async function before(m, { conn }) {
  try {
    if (!m.isGroup || !m.messageStubType) return

    const chat = global?.db?.data?.chats?.[m.chat]
    if (!chat?.detect) return

    const senderId = m.sender || m.key?.participant
    const params = Array.isArray(m.messageStubParameters) ? m.messageStubParameters : []

    // ⚡ Obtener metadata UNA sola vez
    let metadata = null
    try {
      metadata = await conn.groupMetadata(m.chat)
    } catch {}

    // ⚡ Obtener nombre legible
    const getName = (id) => {
      if (!id) return 'Desconocido'
      const user = metadata?.participants?.find(p => p.id === id)
      return (
        user?.name ||
        user?.notify ||
        user?.pushname ||
        id.split('@')[0]
      )
    }

    const usuario = `*${getName(senderId)}*`

    // ⚡ Validación simple
    const isOn = (txt) => ['on', 'true', '1'].includes(String(txt).toLowerCase())

    let mensaje = null

    switch (m.messageStubType) {

      case 21: // cambio de nombre
        if (params[0] && params[0].length > 2 && !params[0].includes('@')) {
          mensaje = `${usuario}\n✨ Cambió el nombre del grupo\n\n📛 Nuevo nombre:\n*${params[0]}*`
        }
        break

      case 22: // cambio de foto
        mensaje = `${usuario}\n🖼️ Cambió la imagen del grupo`
        break

      case 23: // config grupo
        mensaje = `${usuario}\n⚙️ Configuración del grupo: ${isOn(params[0]) ? '*solo admins*' : '*todos*'}`
        break

      case 24: // reset link
        mensaje = `🔗 El enlace del grupo fue restablecido por:\n${usuario}`
        break

      case 25: // abrir/cerrar grupo
        const cerrado = isOn(params[0])
        mensaje = `🚪 El grupo fue ${cerrado ? '*cerrado 🔒*' : '*abierto 🔓*'} por ${usuario}\n\n💬 ${cerrado ? 'Solo admins' : 'Todos'} pueden enviar mensajes`
        break

      case 29: // ascender admin
      case 30: { // quitar admin
        const target = params[0]
        const nombre = getName(target)

        mensaje = m.messageStubType === 29
          ? `👑 *${nombre}* ahora es admin\n\n✨ Acción por: ${usuario}`
          : `📉 *${nombre}* ya no es admin\n\n✨ Acción por: ${usuario}`
        break
      }

      default:
        return
    }

    if (!mensaje) return

    // ⚡ menciones
    const mentions = [senderId, ...params]
      .filter(v => typeof v === 'string')
      .map(v => v.includes('@') ? v : `${v}@s.whatsapp.net`)

    // ⚡ foto solo si es necesario
    let msg = { text: mensaje, mentions }

    if (m.messageStubType === 22) {
      let pp
      try {
        pp = await conn.profilePictureUrl(m.chat, 'image')
      } catch {
        pp = global.icons || 'https://qu.ax/QGAVS.jpg'
      }

      msg = {
        image: { url: pp },
        caption: mensaje,
        mentions
      }
    }

    await conn.sendMessage(m.chat, msg, { quoted: m })

  } catch (e) {
    console.error('❌ Error autodetect:', e)
  }
}