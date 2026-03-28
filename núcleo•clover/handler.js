global.dfail = (type, m, usedPrefix, command, conn) => {
    const msg = {
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
    }[type];

if (msg) return m.reply(msg).then(_ => m.react('💥'))
}