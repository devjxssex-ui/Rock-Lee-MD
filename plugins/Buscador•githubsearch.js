import fetch from 'node-fetch'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(
    m.chat, 
    `⚡ *GITHUB SEARCH*

> Ingresa el nombre de un repositorio

📌 Ejemplo:
${usedPrefix + command} black-clover-MD`, 
    m
  )

  try {
    await m.react('⏳')

    const res = await fetch(global.API('https://api.github.com', '/search/repositories', {
      q: text,
    }))

    const json = await res.json()
    if (res.status !== 200) throw json

    let str = json.items.map((repo, index) => {
      return `
╭━━━〔 ⚡ RESULTADO ${index + 1} 〕━━━⬣
┃ 📦 *Repo:* ${repo.name}
┃ 👑 *Autor:* ${repo.owner.login}
┃ 🔗 *Link:* ${repo.html_url}
┃ ⭐ *Stars:* ${repo.stargazers_count}
┃ 🍴 *Forks:* ${repo.forks}
┃ 👀 *Watchers:* ${repo.watchers}
┃ ⚠️ *Issues:* ${repo.open_issues}
┃ 🗓 *Creado:* ${formatDate(repo.created_at)}
┃ 🔄 *Actualizado:* ${formatDate(repo.updated_at)}
┃ 📄 *Descripción:* ${repo.description || 'Sin descripción'}
┃ 📥 *Clone:* ${repo.clone_url}
╰━━━━━━━━━━━━━━━━━━⬣
      `.trim()
    }).join('\n\n')

    let img = await (await fetch(json.items[0].owner.avatar_url)).buffer()

    await conn.sendMini(
      m.chat, 
      '⚡ G I T H U B  -  S E A R C H ⚡', 
      global.dev, 
      str, 
      img, 
      img, 
      global.redes, 
      global.estilo
    )

    await m.react('✅')

  } catch (e) {
    await m.react('❌')
    conn.reply(
      m.chat, 
      `🚫 *Sin resultados para:* ${text}`, 
      m
    )
  }
}

handler.help = ['githubsearch']
handler.tags = ['buscador']
handler.command = ['githubsearch']
handler.register = true

export default handler

function formatDate(n, locale = 'es') {
  const d = new Date(n)
  return d.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}