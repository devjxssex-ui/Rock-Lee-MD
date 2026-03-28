import similarity from 'similarity';

const threshold = 0.72;
const RIDDLE_PREFIX = 'ⷮ';

const handler = (m) => m;

handler.before = async function(m) {
  const id = m.chat;

  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !new RegExp(`^${RIDDLE_PREFIX}`, 'i').test(m.quoted.text)) return !0;

  this.tekateki = this.tekateki || {};
  if (!(id in this.tekateki)) {
    return m.reply('⚠️ *SISTEMA:* El acertijo expiró o ya fue resuelto.');
  }

  if (m.quoted.id == this.tekateki[id][0].id) {
    const json = JSON.parse(JSON.stringify(this.tekateki[id][1]));

    // asegurar usuario
    global.db.data.users[m.sender] = global.db.data.users[m.sender] || { monedas: 0 };

    const respuestaUser = m.text.toLowerCase().trim();
    const respuestaCorrecta = json.response.toLowerCase().trim();

    if (respuestaUser === respuestaCorrecta) {
      global.db.data.users[m.sender].monedas += this.tekateki[id][2];

      m.reply(`🧠⚡ *ACCESO CONCEDIDO*

> Respuesta correcta, ejecutor.

💰 +${this.tekateki[id][2]} monedas obtenidas`);

      clearTimeout(this.tekateki[id][3]);
      delete this.tekateki[id];

    } else if (similarity(respuestaUser, respuestaCorrecta) >= threshold) {

      m.reply(`🟡 *SEÑAL DETECTADA*

> Estás cerca... ajusta tu respuesta.`);

    } else {

      m.reply(`❌ *ACCESO DENEGADO*

> Respuesta incorrecta.
Intenta nuevamente.`);

    }
  }

  return !0;
};

handler.exp = 0;
export default handler;