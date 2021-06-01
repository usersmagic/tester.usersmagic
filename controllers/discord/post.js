// This gets the authentication code from the tester and
// forwards directly to the server with a secure way (encryption)
const net = require('net');
const crypto = require('crypto');

const BOT_URL = process.env.DISCORD_BOT_URL;
const BOT_PORT = process.env.DISCORD_BOT_PORT;
const KEY = process.env.SYMMETRIC_ENC_KEY;

const AESblocksize = 16;

const key = KEY;

module.exports = (req,res) => {
  const client = new net.Socket();
  client.connect(BOT_PORT, BOT_URL, ()=>{
    const discordCode = "code="+req.body.code;
    const ciphertext = encrypt(discordCode);

    client.write(ciphertext);
  })

  client.on('close', () =>{
    console.log('Connection closed!');
  })

  res.write(JSON.stringify({true: "yey"}));
  return res.end();
}

function encrypt(plain_text) {
  console.log(plain_text)
  const algorithm = 'aes-256-cbc';
  const inputEncoding = 'utf8';
  const outputEncoding = 'base64';
  const ivlength = AESblocksize; // AES blocksize

  const iv = crypto.randomBytes(ivlength);

  let cipher = crypto.createCipheriv(algorithm, KEY, iv);
  let encrypted = cipher.update(plain_text,inputEncoding, outputEncoding);
  encrypted += cipher.final('base64');

  let buff = new Buffer(iv);
  let base64iv = buff.toString('base64');
  console.log(base64iv)

  return base64iv + "," +encrypted;
}

function decrypt(str, iv) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', KEY, iv);
    let decrypt = decipher.update(str, 'base64', 'utf8');
    decrypt += decipher.final();
    return decrypt;
}
