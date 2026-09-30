const TOOLS = [
  { id: 'Base64', cat: 'Encoding', label: 'Base64', icon: 'fa-file-code' },
  { id: 'URL', cat: 'Encoding', label: 'URL Encode', icon: 'fa-link' },
  { id: 'Hex', cat: 'Encoding', label: 'Hex', icon: 'fa-hashtag' },
  { id: 'Binary', cat: 'Encoding', label: 'Binary', icon: 'fa-0' },
  { id: 'Morse', cat: 'Encoding', label: 'Morse Code', icon: 'fa-ellipsis' },
  { id: 'Caesar', cat: 'Encoding', label: 'Caesar Cipher', icon: 'fa-user-secret' },
  { id: 'Hash', cat: 'Encoding', label: 'Hash Generator', icon: 'fa-fingerprint' },
  { id: 'BaseConv', cat: 'Numbers & Bits', label: 'Base Converter', icon: 'fa-right-left' },
  { id: 'Bitwise', cat: 'Numbers & Bits', label: 'Bitwise Calc', icon: 'fa-calculator' },
  { id: 'Twos', cat: 'Numbers & Bits', label: "Two's Complement", icon: 'fa-plus-minus' },
  { id: 'Float', cat: 'Numbers & Bits', label: 'IEEE-754 Float', icon: 'fa-square-root-variable' },
  { id: 'Ascii', cat: 'Numbers & Bits', label: 'ASCII Table', icon: 'fa-table-cells' },
  { id: 'Subnet', cat: 'Networking', label: 'Subnet / CIDR', icon: 'fa-network-wired' },
  { id: 'CRC', cat: 'Networking', label: 'CRC-32', icon: 'fa-shield-halved' },
  { id: 'Ohm', cat: 'Electrical', label: "Ohm's Law", icon: 'fa-bolt' },
  { id: 'Resistor', cat: 'Electrical', label: 'Resistor Code', icon: 'fa-microchip' },
  { id: 'Units', cat: 'General', label: 'Unit Converter', icon: 'fa-ruler-combined' },
  { id: 'Epoch', cat: 'General', label: 'Epoch Converter', icon: 'fa-clock' },
  { id: 'Counter', cat: 'General', label: 'Text Counter', icon: 'fa-font' },
];

let currentTool = null;

function buildSidebar(filter = '') {
  const nav = document.getElementById('tool-nav');
  const f = filter.trim().toLowerCase();
  const cats = [];
  TOOLS.forEach(t => { if (!cats.includes(t.cat)) cats.push(t.cat); });
  let html = '';
  cats.forEach(cat => {
    const items = TOOLS.filter(t => t.cat === cat && t.label.toLowerCase().includes(f));
    if (!items.length) return;
    html += `<div class="tool-cat">${cat}</div>`;
    items.forEach(t => {
      html += `<button class="tool-link" data-id="${t.id}" onclick="selectTool('${t.id}')">`
        + `<i class="fa-solid ${t.icon}"></i><span>${t.label}</span></button>`;
    });
  });
  nav.innerHTML = html || '<div class="tool-empty">No tools match.</div>';
  markActive(currentTool);
}

function markActive(id) {
  document.querySelectorAll('.tool-link').forEach(b =>
    b.classList.toggle('active', b.dataset.id === id));
}

function selectTool(id) {
  document.querySelectorAll('.tabcontent').forEach(p => { p.style.display = 'none'; });
  const panel = document.getElementById(id);
  if (panel) panel.style.display = 'block';
  currentTool = id;
  markActive(id);
  document.getElementById('toolbox-container').classList.add('show-detail');
  document.getElementById('tool-detail').scrollTop = 0;
}

function showList() {
  document.getElementById('toolbox-container').classList.remove('show-detail');
}

document.addEventListener('DOMContentLoaded', () => {
  buildAscii();
  initResistor();
  initUnits();
  buildSidebar();
  selectTool(TOOLS[0].id);
  if (window.matchMedia('(max-width: 860px)').matches) showList();
});

function decodeBase64() {
  const input = document.getElementById('base64-input').value;
  const outputEl = document.getElementById('decoded-output');
  try {
    outputEl.textContent = atob(input);
  } catch (e) {
    outputEl.textContent = 'Invalid Base64 string. ' + e.message;
  }
}

function encodeURL() {
  document.getElementById('url-output').textContent = encodeURIComponent(document.getElementById('url-input').value);
}

function decodeURL() {
  try {
    document.getElementById('url-output').textContent = decodeURIComponent(document.getElementById('url-input').value);
  } catch (e) {
    document.getElementById('url-output').textContent = 'Invalid URL encoding. ' + e.message;
  }
}

// convert ascii string to hex byte pairs
function encodeHex() {
  const input = document.getElementById('hex-input').value;
  let hex = '';
  for (let i = 0; i < input.length; i++) {
    hex += input.charCodeAt(i).toString(16).padStart(2, '0');
  }
  document.getElementById('hex-output').textContent = hex;
}

// convert paired hex bytes back to text
function decodeHex() {
  const input = document.getElementById('hex-input').value.trim();
  const outputEl = document.getElementById('hex-output');
  let str = '';
  if (input.length % 2 !== 0) {
    outputEl.textContent = 'Invalid Hex string: Must have an even number of characters.';
    return;
  }
  try {
    for (let i = 0; i < input.length; i += 2) {
      str += String.fromCharCode(parseInt(input.substr(i, 2), 16));
    }
    outputEl.textContent = str;
  } catch (e) {
    outputEl.textContent = 'Could not decode Hex string.';
  }
}

const morseCodeMap = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/', ',': '--..--', '.': '.-.-.-', '?': '..--..', ';': '-.-.-.', ':': '---...', "'": '.----.', '-': '-....-', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '_': '..--.-'
};
const reverseMorseCodeMap = Object.fromEntries(Object.entries(morseCodeMap).map(([k, v]) => [v, k]));

// lookup table mapper for morse chars
function encodeMorse() {
  const input = document.getElementById('morse-input').value.toUpperCase();
  document.getElementById('morse-output').textContent = input.split('').map(c => morseCodeMap[c] || c).join(' ');
}

function decodeMorse() {
  const input = document.getElementById('morse-input').value.trim();
  document.getElementById('morse-output').textContent = input.split(' ').map(c => reverseMorseCodeMap[c] || c).join('');
}

function encodeBinary() {
  const input = document.getElementById('binary-input').value;
  document.getElementById('binary-output').textContent = input.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
}

function decodeBinary() {
  const input = document.getElementById('binary-input').value.trim();
  try {
    document.getElementById('binary-output').textContent = input.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('');
  } catch (e) {
    document.getElementById('binary-output').textContent = 'Invalid Binary string. ' + e.message;
  }
}

// rot-n shift preserving letter case
function runCaesarCipher(isEncrypt) {
  const text = document.getElementById('caesar-input').value;
  const shift = parseInt(document.getElementById('caesar-shift').value, 10);
  let result = '';

  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    if (char.match(/[a-z]/i)) {
      const code = text.charCodeAt(i);
      let shiftedCode;
      if ((code >= 65) && (code <= 90)) {
        shiftedCode = isEncrypt ? ((code - 65 + shift) % 26) + 65 : ((code - 65 - shift + 26) % 26) + 65;
      } else if ((code >= 97) && (code <= 122)) {
        shiftedCode = isEncrypt ? ((code - 97 + shift) % 26) + 97 : ((code - 97 - shift + 26) % 26) + 97;
      }
      result += String.fromCharCode(shiftedCode);
    } else {
      result += char;
    }
  }
  document.getElementById('caesar-output').textContent = result;
}

// cryptojs hashing dispatcher
function generateHash() {
  const text = document.getElementById('hash-input').value;
  const algo = document.getElementById('hash-algo').value;
  let hash;

  switch (algo) {
    case 'MD5': hash = CryptoJS.MD5(text); break;
    case 'SHA-1': hash = CryptoJS.SHA1(text); break;
    case 'SHA-256': hash = CryptoJS.SHA256(text); break;
    case 'SHA-512': hash = CryptoJS.SHA512(text); break;
    default: hash = 'Unknown algorithm';
  }

  document.getElementById('hash-output').textContent = hash.toString(CryptoJS.enc.Hex);
}

// count chars, words, and line breaks
function updateTextCount() {
  const text = document.getElementById('counter-input').value;
  document.getElementById('char-count').textContent = text.length;
  document.getElementById('word-count').textContent = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  document.getElementById('line-count').textContent = text.split('\n').length;
}

function setGrid(id, rows) {
  const el = document.getElementById(id);
  el.innerHTML = (rows && rows.length)
    ? rows.map(([k, v]) => `<div class="k">${k}</div><div class="v">${v}</div>`).join('')
    : '';
}
function msgGrid(id, msg) {
  document.getElementById(id).innerHTML = `<div class="k">Error</div><div class="v">${msg}</div>`;
}
function groupBits(s, n = 4) {
  while (s.length % n !== 0) s = '0' + s;
  return s.replace(new RegExp(`(.{${n}})`, 'g'), '$1 ').trim();
}

// parse hex, bin, oct or dec string into bigint
function parseIntSmart(str) {
  str = str.trim().toLowerCase();
  if (str === '') throw new Error('empty value');
  let neg = false;
  if (str[0] === '-') { neg = true; str = str.slice(1); }
  const v = (/^0[xbo]/.test(str)) ? BigInt(str) : BigInt(str);
  return neg ? -v : v;
}

// arbitrary base string to bigint parser
function parseInBase(str, base) {
  str = str.trim().toLowerCase();
  if (str === '') throw new Error('empty value');
  let neg = false;
  if (str[0] === '-') { neg = true; str = str.slice(1); }
  str = str.replace(/^0x|^0b|^0o/, '');
  if (str === '') throw new Error('no digits');
  const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
  let v = 0n; const b = BigInt(base);
  for (const ch of str) {
    const d = digits.indexOf(ch);
    if (d < 0 || d >= base) throw new Error(`"${ch}" is not a valid base-${base} digit`);
    v = v * b + BigInt(d);
  }
  return neg ? -v : v;
}

// convert number across dec, hex, oct, and bin
function convertBase() {
  const raw = document.getElementById('bc-input').value;
  const base = parseInt(document.getElementById('bc-base').value, 10);
  if (raw.trim() === '') { setGrid('bc-out', []); return; }
  try {
    const v = parseInBase(raw, base);
    const sign = v < 0n ? '-' : '';
    const a = v < 0n ? -v : v;
    setGrid('bc-out', [
      ['Decimal', sign + a.toString(10)],
      ['Hex', sign + '0x' + a.toString(16).toUpperCase()],
      ['Octal', sign + '0o' + a.toString(8)],
      ['Binary', sign + '0b ' + groupBits(a.toString(2))],
    ]);
  } catch (e) { msgGrid('bc-out', e.message); }
}

// evaluate bitwise expression with bit width mask
function calcBitwise() {
  const op = document.getElementById('bw-op').value;
  const w = BigInt(document.getElementById('bw-width').value);
  const width = Number(w);
  const mask = (1n << w) - 1n;
  const aRaw = document.getElementById('bw-a').value;
  const bRaw = document.getElementById('bw-b').value;
  if (aRaw.trim() === '') { setGrid('bw-out', []); return; }
  try {
    const a = parseIntSmart(aRaw) & mask;
    const b = (bRaw.trim() === '') ? 0n : (parseIntSmart(bRaw) & mask);
    let r;
    switch (op) {
      case 'and': r = a & b; break;
      case 'or': r = a | b; break;
      case 'xor': r = a ^ b; break;
      case 'not': r = (~a) & mask; break;
      case 'shl': r = (a << b) & mask; break;
      case 'shr': r = a >> b; break;
    }
    r &= mask;
    const signed = r >= (1n << (w - 1n)) ? r - (1n << w) : r;
    setGrid('bw-out', [
      ['Hex', '0x' + r.toString(16).toUpperCase().padStart(width / 4, '0')],
      ['Decimal (unsigned)', r.toString(10)],
      ['Decimal (signed)', signed.toString(10)],
      ['Binary', groupBits(r.toString(2).padStart(width, '0'))],
    ]);
  } catch (e) { msgGrid('bw-out', e.message); }
}

// compute signed/unsigned two's complement values
function calcTwos() {
  const raw = document.getElementById('tc-input').value;
  const w = BigInt(document.getElementById('tc-width').value);
  const width = Number(w);
  if (raw.trim() === '') { setGrid('tc-out', []); return; }
  try {
    const val = parseIntSmart(raw);
    const mask = (1n << w) - 1n;
    const pattern = val & mask;
    const min = -(1n << (w - 1n));
    const max = (1n << (w - 1n)) - 1n;
    const signed = pattern >= (1n << (w - 1n)) ? pattern - (1n << w) : pattern;
    setGrid('tc-out', [
      ['Width', width + '-bit'],
      ['Unsigned', pattern.toString(10)],
      ['Signed', signed.toString(10)],
      ['Hex', '0x' + pattern.toString(16).toUpperCase().padStart(width / 4, '0')],
      ['Binary', groupBits(pattern.toString(2).padStart(width, '0'))],
      ['Fits in width?', (val >= min && val <= max) ? 'yes' : 'no — value was truncated'],
    ]);
  } catch (e) { msgGrid('tc-out', e.message); }
}

// unpack ieee-754 sign, exponent, and mantissa bits
function calcFloat() {
  const raw = document.getElementById('fl-input').value.trim();
  const prec = document.getElementById('fl-prec').value;
  if (raw === '') { setGrid('fl-out', []); return; }
  const x = Number(raw);
  if (Number.isNaN(x) && raw.toLowerCase() !== 'nan') { msgGrid('fl-out', 'not a number'); return; }
  let bits, totalBits, expBits, stored;
  if (prec === '32') {
    const dv = new DataView(new ArrayBuffer(4));
    dv.setFloat32(0, x);
    bits = BigInt(dv.getUint32(0));
    stored = dv.getFloat32(0);
    totalBits = 32; expBits = 8;
  } else {
    const dv = new DataView(new ArrayBuffer(8));
    dv.setFloat64(0, x);
    bits = (BigInt(dv.getUint32(0)) << 32n) | BigInt(dv.getUint32(4));
    stored = dv.getFloat64(0);
    totalBits = 64; expBits = 11;
  }
  const bin = bits.toString(2).padStart(totalBits, '0');
  const sign = bin[0];
  const exp = bin.slice(1, 1 + expBits);
  const man = bin.slice(1 + expBits);
  setGrid('fl-out', [
    ['Stored value', String(stored)],
    ['Hex', '0x' + bits.toString(16).toUpperCase().padStart(totalBits / 4, '0')],
    ['Sign', sign + (sign === '1' ? ' (−)' : ' (+)')],
    ['Exponent', exp + '  (' + parseInt(exp, 2) + ')'],
    ['Mantissa', man],
    ['All bits', groupBits(bin)],
  ]);
}

// populate ascii reference table rows
function buildAscii() {
  const names = { 0: 'NUL', 1: 'SOH', 2: 'STX', 3: 'ETX', 4: 'EOT', 5: 'ENQ', 6: 'ACK', 7: 'BEL', 8: 'BS', 9: 'TAB', 10: 'LF', 11: 'VT', 12: 'FF', 13: 'CR', 14: 'SO', 15: 'SI', 16: 'DLE', 17: 'DC1', 18: 'DC2', 19: 'DC3', 20: 'DC4', 21: 'NAK', 22: 'SYN', 23: 'ETB', 24: 'CAN', 25: 'EM', 26: 'SUB', 27: 'ESC', 28: 'FS', 29: 'GS', 30: 'RS', 31: 'US', 32: 'SP', 127: 'DEL' };
  let rows = '';
  for (let i = 0; i < 128; i++) {
    let ch = names[i] !== undefined ? names[i] : String.fromCharCode(i);
    ch = ch.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    rows += `<tr><td>${i}</td><td>0x${i.toString(16).toUpperCase().padStart(2, '0')}</td><td>0${i.toString(8)}</td><td>${ch}</td></tr>`;
  }
  document.getElementById('ascii-out').innerHTML =
    `<table class="ascii-table"><thead><tr><th>Dec</th><th>Hex</th><th>Oct</th><th>Char</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function ipToInt(ip) {
  const p = ip.split('.');
  if (p.length !== 4) throw new Error('IPv4 needs four octets');
  let v = 0;
  for (const o of p) {
    const n = Number(o);
    if (o === '' || !Number.isInteger(n) || n < 0 || n > 255) throw new Error(`bad octet "${o}"`);
    v = (v * 256) + n;
  }
  return v >>> 0;
}
function intToIp(v) { return [(v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255].join('.'); }

// calculate cidr subnet bounds and usable hosts
function calcSubnet() {
  const raw = document.getElementById('sn-input').value.trim();
  if (raw === '') { setGrid('sn-out', []); return; }
  try {
    const [ip, pfxStr] = raw.split('/');
    if (pfxStr === undefined) throw new Error('add a prefix, e.g. /24');
    const pfx = Number(pfxStr);
    if (!Number.isInteger(pfx) || pfx < 0 || pfx > 32) throw new Error('prefix must be 0–32');
    const ipi = ipToInt(ip.trim());
    const mask = pfx === 0 ? 0 : (0xFFFFFFFF << (32 - pfx)) >>> 0;
    const network = (ipi & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    let firstHost, lastHost, hosts;
    if (pfx >= 31) { firstHost = network; lastHost = broadcast; hosts = pfx === 32 ? 1 : 2; }
    else { firstHost = (network + 1) >>> 0; lastHost = (broadcast - 1) >>> 0; hosts = broadcast - network - 1; }
    setGrid('sn-out', [
      ['CIDR', intToIp(network) + '/' + pfx],
      ['Netmask', intToIp(mask)],
      ['Wildcard', intToIp(~mask >>> 0)],
      ['Network', intToIp(network)],
      ['Broadcast', intToIp(broadcast)],
      ['Usable host range', intToIp(firstHost) + ' – ' + intToIp(lastHost)],
      ['Usable hosts', hosts.toLocaleString()],
    ]);
  } catch (e) { msgGrid('sn-out', e.message); }
}

let crcTable = null;
function makeCrcTable() {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
}

// compute standard crc-32 checksum from string bytes
function calcCRC() {
  const raw = document.getElementById('crc-input').value;
  if (raw === '') { setGrid('crc-out', []); return; }
  if (!crcTable) crcTable = makeCrcTable();
  const bytes = new TextEncoder().encode(raw);
  let crc = 0xFFFFFFFF;
  for (const b of bytes) crc = (crc >>> 8) ^ crcTable[(crc ^ b) & 0xFF];
  crc = (crc ^ 0xFFFFFFFF) >>> 0;
  setGrid('crc-out', [
    ['CRC-32 (hex)', '0x' + crc.toString(16).toUpperCase().padStart(8, '0')],
    ['CRC-32 (dec)', crc.toString(10)],
    ['Input bytes', bytes.length.toString()],
  ]);
}

// solve ohm's law from two given parameters
function calcOhm() {
  const get = id => { const v = document.getElementById(id).value.trim(); return v === '' ? null : Number(v); };
  let V = get('ohm-v'), I = get('ohm-i'), R = get('ohm-r'), P = get('ohm-p');
  const filled = [V, I, R, P].filter(x => x !== null && !Number.isNaN(x));
  if (filled.length === 0) { setGrid('ohm-out', []); return; }
  if (filled.length !== 2) { msgGrid('ohm-out', 'enter exactly two values'); return; }
  if (V != null && I != null) { R = V / I; P = V * I; }
  else if (V != null && R != null) { I = V / R; P = V * V / R; }
  else if (V != null && P != null) { I = P / V; R = V * V / P; }
  else if (I != null && R != null) { V = I * R; P = I * I * R; }
  else if (I != null && P != null) { V = P / I; R = P / (I * I); }
  else if (R != null && P != null) { V = Math.sqrt(P * R); I = Math.sqrt(P / R); }
  const f = n => Number.isFinite(n) ? String(Math.round(n * 1e6) / 1e6) : '—';
  setGrid('ohm-out', [
    ['Voltage', f(V) + ' V'],
    ['Current', f(I) + ' A'],
    ['Resistance', f(R) + ' Ω'],
    ['Power', f(P) + ' W'],
  ]);
}

const RC_COLORS = [['black', '#1c1c1c', 0], ['brown', '#6b3f1d', 1], ['red', '#d32f2f', 2], ['orange', '#ef6c00', 3], ['yellow', '#fbc02d', 4], ['green', '#388e3c', 5], ['blue', '#1976d2', 6], ['violet', '#7b1fa2', 7], ['grey', '#9e9e9e', 8], ['white', '#eeeeee', 9]];
const RC_MULT = [['black', '#1c1c1c', 0], ['brown', '#6b3f1d', 1], ['red', '#d32f2f', 2], ['orange', '#ef6c00', 3], ['yellow', '#fbc02d', 4], ['green', '#388e3c', 5], ['blue', '#1976d2', 6], ['violet', '#7b1fa2', 7], ['gold', '#c9a227', -1], ['silver', '#bdbdbd', -2]];
const RC_TOL = [['brown', '#6b3f1d', 1], ['red', '#d32f2f', 2], ['green', '#388e3c', 0.5], ['blue', '#1976d2', 0.25], ['violet', '#7b1fa2', 0.1], ['gold', '#c9a227', 5], ['silver', '#bdbdbd', 10]];
function fillSelect(id, arr, sel) {
  document.getElementById(id).innerHTML = arr.map((c, i) => `<option value="${i}"${i === sel ? ' selected' : ''}>${c[0]}</option>`).join('');
}
function initResistor() {
  fillSelect('rc-b1', RC_COLORS, 1);
  fillSelect('rc-b2', RC_COLORS, 0);
  fillSelect('rc-mult', RC_MULT, 2);
  fillSelect('rc-tol', RC_TOL, 5);
  calcResistor();
}
function fmtOhms(v) {
  const r = x => String(Math.round(x * 1000) / 1000);
  if (v >= 1e9) return r(v / 1e9) + ' GΩ';
  if (v >= 1e6) return r(v / 1e6) + ' MΩ';
  if (v >= 1e3) return r(v / 1e3) + ' kΩ';
  return r(v) + ' Ω';
}

// calculate resistance value and band preview
function calcResistor() {
  const b1 = RC_COLORS[+document.getElementById('rc-b1').value];
  const b2 = RC_COLORS[+document.getElementById('rc-b2').value];
  const m = RC_MULT[+document.getElementById('rc-mult').value];
  const tol = RC_TOL[+document.getElementById('rc-tol').value];
  const val = (b1[2] * 10 + b2[2]) * Math.pow(10, m[2]);
  document.getElementById('rc-preview').innerHTML =
    [b1, b2, m, tol].map(c => `<span class="band" style="background:${c[1]}"></span>`).join('');
  setGrid('rc-out', [
    ['Resistance', fmtOhms(val)],
    ['Tolerance', '±' + tol[2] + '%'],
    ['Range', fmtOhms(val * (1 - tol[2] / 100)) + ' – ' + fmtOhms(val * (1 + tol[2] / 100))],
  ]);
}

const UNIT_DATA = {
  Length: { units: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 } },
  Mass: { units: { mg: 0.001, g: 1, kg: 1000, oz: 28.349523125, lb: 453.59237 } },
  Data: { units: { bit: 0.125, B: 1, KB: 1e3, MB: 1e6, GB: 1e9, KiB: 1024, MiB: 1048576, GiB: 1073741824 } },
  Temperature: { special: true, units: { '°C': 1, '°F': 1, 'K': 1 } },
};
function initUnits() {
  document.getElementById('un-cat').innerHTML = Object.keys(UNIT_DATA).map(k => `<option>${k}</option>`).join('');
  buildUnits();
}
function buildUnits() {
  const cat = document.getElementById('un-cat').value;
  const units = Object.keys(UNIT_DATA[cat].units);
  const opts = units.map(u => `<option>${u}</option>`).join('');
  document.getElementById('un-from').innerHTML = opts;
  document.getElementById('un-to').innerHTML = opts;
  document.getElementById('un-to').selectedIndex = Math.min(1, units.length - 1);
  convertUnits();
}

// scale magnitude across measurement units
function convertUnits() {
  const cat = document.getElementById('un-cat').value;
  const val = Number(document.getElementById('un-val').value);
  const from = document.getElementById('un-from').value;
  const to = document.getElementById('un-to').value;
  if (document.getElementById('un-val').value.trim() === '' || Number.isNaN(val)) { setGrid('un-out', []); return; }
  let result;
  if (UNIT_DATA[cat].special) {
    let c;
    if (from === '°C') c = val; else if (from === '°F') c = (val - 32) * 5 / 9; else c = val - 273.15;
    if (to === '°C') result = c; else if (to === '°F') result = c * 9 / 5 + 32; else result = c + 273.15;
  } else {
    const u = UNIT_DATA[cat].units;
    result = val * u[from] / u[to];
  }
  setGrid('un-out', [[`${val} ${from} =`, (Math.round(result * 1e9) / 1e9) + ' ' + to]]);
}

// format unix timestamp into local, utc, and iso
function epochToDate() {
  const raw = document.getElementById('ep-ts').value.trim();
  if (raw === '') { setGrid('ep-out', []); return; }
  const n = Number(raw);
  if (Number.isNaN(n)) { msgGrid('ep-out', 'not a number'); return; }
  const ms = Math.abs(n) >= 1e12 ? n : n * 1000;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) { msgGrid('ep-out', 'invalid timestamp'); return; }
  setGrid('ep-out', [
    ['Local', d.toString()],
    ['UTC', d.toUTCString()],
    ['ISO 8601', d.toISOString()],
  ]);
}
function epochNow() {
  document.getElementById('ep-ts').value = Math.floor(Date.now() / 1000);
  epochToDate();
}
function dateToEpoch() {
  const raw = document.getElementById('ep-date').value.trim();
  if (raw === '') { setGrid('ep-out2', []); return; }
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) { msgGrid('ep-out2', 'could not parse date'); return; }
  setGrid('ep-out2', [
    ['Unix (s)', Math.floor(d.getTime() / 1000).toString()],
    ['Unix (ms)', d.getTime().toString()],
  ]);
}
