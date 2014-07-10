var crypto    = require('crypto')
   ,key       = "G3@#qU1p"
   ,algorithm = "bf-ecb";

var BlowFish = module.exports = function(){};

BlowFish.prototype.encrypt = function(data) {
  var cipher = crypto.createCipheriv(algorithm, Buffer(key), '');
  cipher.setAutoPadding(false);
  try {
    return Buffer(cipher.update(pad(data), 'utf8', 'binary') + cipher.final('binary'), 'binary').toString('base64');
  } catch (e) {
    return null;
  }
}

BlowFish.prototype.decrypt = function(data) {
    var decipher = crypto.createDecipheriv(algorithm, Buffer(key), '');
    decipher.setAutoPadding(false);
    try {
      return (decipher.update(Buffer(data, 'base64').toString('binary'), 'binary', 'utf8') + decipher.final('utf8')).replace(/\x00+$/g, '');
    } catch (e) {
      return null;
    }
  }

function pad(text) {
  var pad_bytes = 8 - (text.length % 8);
  for (var x = 1; x <= pad_bytes; x++)
    text = text + String.fromCharCode(0)
  return text;
}