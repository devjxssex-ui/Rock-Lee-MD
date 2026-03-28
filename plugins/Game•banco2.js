const handler = async (m, { conn, text, usedPrefix }) => {
  let user = global.db.data.users[m.sender]

  // 📊 Inicializar datos
  user.monedas = user.monedas || 0
  user.deuda = user.deuda || { monto: 0, interes: 0.05, vencimiento: 0 }
  user.bloqueado = user.bloqueado || false

  const args = text?.trim().split(/\s+/) || []
  const accion = args[0]?.toLowerCase()

  // 📌 Menú
  if (!accion) {
    return conn.reply(
      m.chat,
      `🏦 *BANCO ROCK LEE 🩻*

📌 Comandos:
• ${usedPrefix}banco pedir <cantidad>
• ${usedPrefix}banco pagar <cantidad>
• ${usedPrefix}banco estado

💰 Maneja tus préstamos con cuidado...`,
      m
    )
  }

  // 📊 ESTADO
  if (accion === 'estado') {
    if (user.deuda.monto <= 0) {
      return conn.reply(
        m.chat,
        '✅ No tienes deudas pendientes.',
        m
      )
    }

    const total = Math.ceil(user.deuda.monto * (1 + user.deuda.interes))
    const tiempo = user.deuda.vencimiento - Date.now()

    return conn.reply(
      m.chat,
      `📊 *Estado de deuda*

💸 Deuda base: *${user.deuda.monto}*
📈 Total a pagar: *${total}*
⏳ Tiempo restante: *${Math.max(0, Math.floor(tiempo / 1000))}s*`,
      m
    )
  }

  // 💰 PEDIR
  if (accion === 'pedir') {
    let monto = parseInt(args[1])

    if (!monto || monto <= 0) {
      return conn.reply(m.chat, '🚩 Ingresa un monto válido.', m)
    }

    if (monto > 1000000) {
      return conn.reply(m.chat, '🚩 Máximo préstamo: 1,000,000 monedas.', m)
    }

    if (user.deuda.monto > 0) {
      return conn.reply(
        m.chat,
        `⚠️ Ya tienes una deuda activa de ${user.deuda.monto}.`,
        m
      )
    }

    // 📌 Asignar préstamo
    user.deuda = {
      monto,
      interes: 0.05,
      vencimiento: Date.now() + 24 * 60 * 60 * 1000
    }

    user.monedas += monto
    user.bloqueado = true

    return conn.reply(
      m.chat,
      `💰 *Préstamo aprobado*

📥 Recibiste: *${monto}*
📈 Interés: *5%*
⏳ Tiempo: *24h*

⚠️ Si no pagas, habrá consecuencias...

🩻 Rock Lee Bank`,
      m
    )
  }

  // 💸 PAGAR
  if (accion === 'pagar') {
    if (user.deuda.monto <= 0) {
      return conn.reply(m.chat, '🚩 No tienes deuda.', m)
    }

    let pago = parseInt(args[1])
    if (!pago || pago <= 0) {
      return conn.reply(m.chat, '🚩 Ingresa un monto válido.', m)
    }

    if (pago > user.monedas) {
      return conn.reply(m.chat, '🚩 No tienes suficientes monedas.', m)
    }

    let total = Math.ceil(user.deuda.monto * (1 + user.deuda.interes))

    // ✅ Pago completo
    if (pago >= total) {
      user.monedas -= total
      user.deuda = { monto: 0, interes: 0.05, vencimiento: 0 }
      user.bloqueado = false

      return conn.reply(
        m.chat,
        `✅ *Deuda pagada*

🎉 Has quedado libre.
🔓 Comandos desbloqueados.`,
        m
      )
    }

    // 💸 Pago parcial
    user.monedas -= pago
    user.deuda.monto = total - pago

    return conn.reply(
      m.chat,
      `💸 Pagaste *${pago}*

📉 Deuda restante: *${user.deuda.monto}*`,
      m
    )
  }

  // ❌ Default
  return conn.reply(
    m.chat,
    '🚩 Usa: pedir / pagar / estado',
    m
  )
}

handler.command = ['banco2', 'bank2']
handler.tags = ['economy']
handler.group = true
handler.register = true

export default handler