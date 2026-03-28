process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
import './config.js'
import cluster from 'cluster'
const { setupMaster, fork } = cluster
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts'
import {createRequire} from 'module'
import {fileURLToPath, pathToFileURL} from 'url'
import {platform} from 'process'
import * as ws from 'ws'
import fs, {readdirSync, statSync, unlinkSync, existsSync, mkdirSync, readFileSync, rmSync, watch} from 'fs'
import yargs from 'yargs';
import {spawn} from 'child_process'
import lodash from 'lodash'
import { blackJadiBot } from '../plugins/jadibot-serbot.js';
import chalk from 'chalk'
import syntaxerror from 'syntax-error'
import {tmpdir} from 'os'
import {format} from 'util'
import boxen from 'boxen'
import P from 'pino'
import pino from 'pino'
import Pino from 'pino'
import path, { join, dirname } from 'path'
import {Boom} from '@hapi/boom'
import {makeWASocket, protoType, serialize} from '../lib/simple.js'
import {Low, JSONFile} from 'lowdb'
import {mongoDB, mongoDBV2} from '../lib/mongoDB.js'
import store from '../lib/store.js'
const {proto} = (await import('@whiskeysockets/baileys')).default
import pkg from 'google-libphonenumber'
const { PhoneNumberUtil } = pkg
const phoneUtil = PhoneNumberUtil.getInstance()
const {DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser} = await import('@whiskeysockets/baileys')
import readline, { createInterface } from 'readline'
import NodeCache from 'node-cache'
const {CONNECTING} = ws
const {chain} = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000
protoType()
serialize()

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
    return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
}; 
global.__dirname = function dirname(pathURL) {
    return path.dirname(global.__filename(pathURL, true))
}; 
global.__require = function require(dir = import.meta.url) {
    return createRequire(dir)
}

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({...query, ...(apikeyqueryname ? {[apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]} : {})})) : '');

global.timestamp = {start: new Date}

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[#/!.]')

global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile('./src/database/database.json'))

global.DATABASE = global.db 
global.loadDatabase = async function loadDatabase() {
    if (global.db.READ) {
        return new Promise((resolve) => setInterval(async function() {
            if (!global.db.READ) {
                clearInterval(this)
                resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
            }}, 1 * 1000))
    }
    if (global.db.data !== null) return
    global.db.READ = true
    await global.db.read().catch(console.error)
    global.db.READ = null
    global.db.data = {
        users: {},
        chats: {},
        stats: {},
        msgs: {},
        sticker: {},
        settings: {},
        ...(global.db.data || {}),
    }
    global.db.chain = chain(global.db.data)
}
loadDatabase()

const { state, saveState, saveCreds } = await useMultiFileAuthState(global.sessions);
const msgRetryCounterMap = (MessageRetryMap) => {};
const msgRetryCounterCache = new NodeCache();
const { version } = await fetchLatestBaileysVersion();
let phoneNumber = global.botNumber;

const methodCodeQR = process.argv.includes("qr");
const methodCode = !!phoneNumber || process.argv.includes("code");
const MethodMobile = process.argv.includes("mobile");

const theme = {
    banner: chalk.bgGreen.black,
    accent: chalk.bold.yellowBright,
    highlight: chalk.bold.greenBright,
    text: chalk.bold.white,
    prompt: chalk.bold.magentaBright
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver));

let opcion;
if (methodCodeQR) opcion = '1';

const credsExist = fs.existsSync(`./${global.sessions}/creds.json`);

if (!methodCodeQR && !methodCode && !credsExist) {
    do {
        opcion = await question(
            theme.banner('⌬ Elija una opción:\n') +
            theme.highlight('1. Con código QR\n') +
            theme.text('2. Con código de texto de 8 dígitos\n--> ')
        );

        if (!/^[1-2]$/.test(opcion)) {
            console.log(chalk.bold.redBright(`✞ No se permiten numeros que no sean 1 o 2.`));
        }
    } while ((opcion !== '1' && opcion !== '2') || credsExist);
}

const connectionOptions = {
    logger: pino({ level: 'silent' }),
    printQRInTerminal: opcion == '1' ? true : methodCodeQR ? true : false,
    mobile: MethodMobile, 
    browser: ['RockLee-MD', 'Edge', '110.0.1587.56'],
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
    },
    markOnlineOnConnect: true, 
    generateHighQualityLinkPreview: true
}

global.conn = makeWASocket(connectionOptions)

async function connectionUpdate(update) {
    const { connection } = update;

    if (connection === 'open') {
        console.log(chalk.bold.green('\n💪🔥 ROCK LEE BOT CONECTADO 🔥💪'));
    }

    if (connection === 'close') {
        console.log(chalk.bold.redBright(`\n⚠︎ CONEXIÓN CERRADA`));
    }
}

conn.ev.on('connection.update', connectionUpdate)
conn.ev.on('creds.update', saveCreds)

console.log(chalk.bold.greenBright('\n💪🔥 ROCK LEE-MD ACTIVO 🔥💪'))