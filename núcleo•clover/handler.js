global.dfail = (type, m, usedPrefix, command, conn) => {
    const msgs = {
        rowner: `💪🔥 *ACCESO DE MAESTRO* 🔥💪

> Solo el *Sensei Supremo* puede usar esta técnica.

🥋 Usuario autorizado: GUY SENSEI
⚡ Poder de la juventud al máximo`,

        owner: `⚙️ *TÉCNICA PROHIBIDA*

> Solo el *entrenador principal* puede usar este comando.

🔥 Sigue entrenando para alcanzar este nivel.`,

        premium: `🔥 *ENTRENAMIENTO AVANZADO*

> Esta técnica es solo para usuarios *PREMIUM*.

💪 Mejora tu nivel y desbloquea más poder.`,

        private: `🔒 *SOLO ENTRENAMIENTO PRIVADO*

> Este comando solo se usa en chat privado.

🥊 Ve a entrenar a solas.`,

        admin: `🛡️ *SOLO LÍDERES*

> Solo los administradores pueden usar esto.

🔥 Entrena más para llegar a ese nivel.`,

        unreg: `📋 *NO ESTÁS REGISTRADO*

> No puedes usar técnicas sin registrarte.

🥋 Usa:
*/reg nombre.edad*

Ejemplo:
*/reg Lee.18*

💪 ¡Empieza tu entrenamiento ahora!`,

        restrict: `🚫 *TÉCNICA BLOQUEADA*

> Este comando fue deshabilitado.

⚡ Sigue entrenando.`
    }

    const msg = msgs[type]
    if (!msg) return

    // Usar conn.sendMessage en vez de m.react para evitar errores
    if (conn && m.chat) {
        conn.sendMessage(m.chat, { text: msg })
    } else if (m.reply) {
        m.reply(msg)
    }
}