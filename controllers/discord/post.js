// This gets the authentication code from the tester and
// forwards directly to the server with a secure way (encryption)
const net = require('net');
const crypto = require('crypto');

const User = require('../../models/user/User');

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

  client.on('data', data =>{
      const discord_id = decrypt(data);
      User.setDiscordID(req.session.user._id, discord_id, (err, user) =>{
        if (err) res.write(JSON.stringify({success: "false"}));
        else res.write(JSON.stringify({success: "true"}));

        return res.end();
      });
  })

}

function encrypt(plain_text) {
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

  return base64iv + "," +encrypted;
}

function decrypt(parameters) {
  parameters = parseIV_cipher(parameters);
  let iv = Buffer.from(parameters.iv, 'base64');

  const ciphertext = parameters.cipher_text;
  const decipher = crypto.createDecipheriv('aes-256-cbc', KEY, iv);
  let decrypt = decipher.update(ciphertext, 'base64', 'utf8');
  decrypt += decipher.final();
  return decrypt;
}

function parseIV_cipher(byte_object){

  let iv = "";
  let cipher_text = "";
  let iv_decider = true;

  for ( b of byte_object){
    if ( b == 44 ) {
      iv_decider = false;
      continue;
    }
    if (iv_decider) iv += String.fromCharCode(b);
    else cipher_text += String.fromCharCode(b);
  }

  return {cipher_text: cipher_text, iv: iv};
}
