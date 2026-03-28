import { watchFile, unwatchFile } from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import fs from 'fs'; 
import cheerio from 'cheerio';
import fetch from 'node-fetch';
import axios from 'axios';
import moment from 'moment-timezone';

// 💪🔥 CONFIGURACIÓN ROCK LEE MD 🔥💪

// Número del bot
global.botNumber = ''; // Ej: 527753208329

// Dueños
global.owner = [
  ['527751962946', '💪 Creador Rock Lee', true],
  ['', '', false]
];

global.mods = ['527751962946'];
global.prems = ['527751962946'];

// Info del bot
global.libreria = 'Baileys';
global.baileys = 'V 6.7.9';
global.languaje = 'Español';
global.vs = '1.0.0';
global.nameqr = '𝕽𝖔𝖈𝖐 𝕷𝖊𝖊';
global.sessions = 'rockleeSession';
global.jadi = 'rockleeJadiBot';
global.blackJadibts = true;

// Stickers
global.packsticker = `
💪 ROCK LEE BOT
EL PODER DE LA JUVENTUD 🔥`;

global.packname = 'Rock Lee 💪🔥';
global.author = 'Devjxssex';

// Branding
global.wm = '𝕽𝖔𝖈𝖐 𝕷𝖊𝖊 ?';
global.titulowm = '𝕽𝖔𝖈𝖐 𝕷𝖊𝖊 𝕸𝕯';
global.botname = '𝕽𝖔𝖈𝖐 𝕷𝖊𝖊 🪾🔥';
global.dev = 'Powered by esfuerzo puro 🔥';
global.textbot = '𝕽𝖔𝖈𝖐 𝕷𝖊𝖊 𝕭𝖔𝖙';
global.gt = '𝕽𝖔𝖈𝖐 𝕷𝖊𝖊 𝕸𝕯';
global.namechannel = '. ₊ ⊹ ʀօƈӄ ʟɛɛ . ⟡ . օʄʄɨƈɨǟʟ ƈɦǟ̈̄ռռɛʟ . ݁₊ ⊹ . ݁ ⊹';

// Moneda
global.monedas = 'energía';

// Links (puedes cambiar)
global.gp1 = 'https://chat.whatsapp.com/EndrcCsriueBIsd4r5RvLr?mode=gi_t';
global.gp2 = 'https://chat.whatsapp.com/KqORPSx4EaEKy2vSGZ0803?mode=gi_t';
global.comunidad1 = 'https://chat.whatsapp.com/FKDOZ6q46EY9Xo5PuvUYT4';
global.channel = 'https://whatsapp.com/channel/0029VbCogMA4IBh8kqwcES2c';
global.yt = 'https://youtube.com/';
global.md = 'https://github.com/';
global.correo = 'devjxssex@gmail.com';

// Imagen catálogo
global.catalogo = fs.readFileSync(new URL('../src/catalogo.jpg', import.meta.url));
global.photoSity = [global.catalogo];

// Estilo mensajes
global.estilo = { 
  key: {  
    fromMe: false, 
    participant: '0@s.whatsapp.net', 
  }, 
  message: { 
    orderMessage: { 
      itemCount : -999999, 
      status: 1, 
      surface : 1, 
      message: global.packname, 
      orderTitle: 'Rock Lee', 
      thumbnail: global.catalogo, 
      sellerJid: '0@s.whatsapp.net'
    }
  }
};

// Canal
global.ch = { ch1: "120363000000000000@newsletter" };
global.rcanal = global.ch.ch1;

// Librerías globales
global.cheerio = cheerio;
global.fs = fs;
global.fetch = fetch;
global.axios = axios;
global.moment = moment;

// Sistema
global.multiplier = 50;
global.maxwarn = 3;

// Hot reload
const file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright('Update config.js'));
  import(`${file}?update=${Date.now()}`);
});