/**
 * Security management for Node Growler
 */

var crypto = require('crypto');

/*
 * Always choose an algorithm which has a digest size which is at least as long
 * as the encryption algorithm's key length. Only applies if using encryption.
 */
var hashAlgorithms = {
  'MD5': {
    name: 'md5',
    digestSize: 16
  },
  'SHA1': {
    name: 'sha1',
    digestSize: 20
  },
  'SHA256': { // Default
    name: 'sha256',
    digestSize: 32
  },
  'SHA512': {
    name: 'sha512',
    digestSize: 64
  }
};

/*
 * Note that not all of these algorithms may exist on your system
 */
var encryptionAlgorithms = {
  'AES': { // Recommended
    name: 'aes192',
    keyLength: 24,
    ivSize: 16
  },
  'DES': {
    name: 'des',
    keyLength: 8,
    ivSize: 8
  },
  '3DES': {
    name: 'des3',
    keyLength: 24,
    ivSize: 8
  }
};

var SALT_SIZE = 16;

/**
 * @constructor
 *
 * Create a security guard. Note that salt and hashes are in binary form.
 * When an instance of this class is instantiated
 * with the 'new' keyword, it will return an object with the following keys:
 * - {string|null} hashAlg Will be hashAlgorithm if password was given
 * - {Buffer=} salt Hex-encoded salt used for key (only if hashAlg)
 * - {string=} keyHash Hex-encoded key hash (only if hashAlg)
 * - {string|null} encAlg Will be encryptionAlgorithm if hashAlg and
 *   encryptionAlgorithm was given
 * - {Buffer=} iv Hex-encoded initial vector for encryption (only if encAlg)
 * - {Function} writeSecure Writes data to socket, see below.
 *
 * @param {string|null} password The password to the Growl client. If null, no
 *   security will ever work. Password CAN be empty string.
 *
 * @param {string} hashAlgorithm Algorithm for hashing.
 *   Should be 'MD5', 'SHA1', 'SHA256' or 'SHA512'.
 *
 * @param {string|null} encryptionAlgorithm Encryption algorithm. Should be
 *   'AES', 'DES', '3DES' or null if no encryption should be enabled.
 */
var SecurityGuard = function(password, hashAlgorithm, encryptionAlgorithm) {
  password = typeof password == 'string' ? password : null;

  // Need to check for type since an empty string is a valid password
  this.passwordProtection = password != null;

  // Hashing and key generation
  if (this.passwordProtection) {
    this.hashAlg = hashAlgorithm;
    //
    var saltBuffer = crypto.randomBytes(SALT_SIZE);
    this.salt = saltBuffer.toString('hex');

    var hash = crypto.createHash(hashAlgorithms[this.hashAlg].name);
  
    hash.update(password);
    hash.update(saltBuffer);
    // The key is pass+salt hashed. Don't expose it
    var key = hash.digest();
    // Create a new hash object
    hash = crypto.createHash(hashAlgorithms[this.hashAlg].name);
    // Yo dawg, we put a hash in yo hash
    hash.update(key);
    // Retrieve the final hash (digest) in hex form
    this.keyHash = hash.digest('hex');
  }
  else
    this.hashAlg = null;

  if (this.passwordProtection && encryptionAlgorithm) {
    this.encAlg = encryptionAlgorithm;
    if (encryptionAlgorithms[this.encAlg].keyLength > hashAlgorithms[this.hashAlg].digestSize)
      throw new Error('Invalid combination of hash and encryption algorithm. '+
                      this.encAlg +' needs a '+ encryptionAlgorithms[this.encAlg].keyLength +
                      'B key but '+ this.hashAlg + ' only generates a '+
                      hashAlgorithms[this.hashAlg].digestSize +'B digest.');
    // For encryption, an initial vector is required
    var ivBuffer = crypto.randomBytes(encryptionAlgorithms[this.encAlg].ivSize);
    this.iv = ivBuffer.toString('hex');
  }
  else {
    this.encAlg = null;
  }

  password = null; // Remove password from memory

  /**
   * Writes data to the socket according to the object's encryption algorithm.
   * If not encrypted it just writes the data plain.
   *
   * @param {!Socket} socket The socket to write the data to. Must be writable.
   *
   * @param {string|!Buffer} data Data to write. If string assuming UTF-8.
   */
  this.writeSecure = function(socket, data) {
    var encryption = encryptionAlgorithms[this.encAlg] || null;
    if (encryption) {
      var cipher = crypto.createCipheriv(
          encryption.name,
          key.slice(0, encryption.keyLength),
          ivBuffer.toString('binary'));
      socket.write(cipher.update(data, typeof data == 'string' ? 'utf8' : 'binary'), 'binary');
      socket.write(cipher.final(), 'binary');
    }
    else
      socket.write(data);
  };
};

// Export using node.js module layer
module.exports = SecurityGuard;
