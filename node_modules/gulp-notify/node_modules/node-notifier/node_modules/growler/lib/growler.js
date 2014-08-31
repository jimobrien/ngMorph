/**
 * @preserve
 *
 * Node Growler
 *
 * A node.js Growl server which communicates with Growl clients using GNTP
 * (Growl Notification Transport Protocol).
 *
 * Dependencies:
 * - node.js 0.6.0+
 * - Underscore.js 1.1.5+
 * - openssl determines encryptions available, only affects encrypted
 *   communication
 *
 * @author Didrik Nordström, http://betamos.se/
 *
 * @see http://nodejs.org/
 * @see http://growl.info/
 */
var util = require('util'),
  events = require('events'),
  net = require('net'),
  crypto = require('crypto'),
  SecurityGuard = require('./security-guard.js'),
  _ = require('underscore');

var nl = '\r\n', nl2 = nl+nl;

/**
 * Create a Growl application. This is sort of a server which communicates
 * with a Growl client over GNTP, a TCP protocol developed specifically for
 * Growl. This is also an event emitter with the following events, which mainly
 * are used for debugging:
 * - request: When a message is sent over the network, first argument will be
 *   a readable, unencrypted, plain version of the message being sent
 * - response: When the Growl client returns a response, first argument will be
 *   the raw string sent by the Growl client
 *
 * @see http://growl.info/documentation/developer/gntp.php
 *
 * @param {string} name Name of the application. Visible in the Growl client
 *   settings.
 *
 * @param {Object.<string, *>=} options An object with the following keys:
 *   - {?string} hostname E.g. '123.45.67.89', 'example.com'.
 *     Defaults to 'localhost'.
 *   - {?number} port Network port number. Defaults to 23053, the GNTP port
 *   - {?number} timeout Timeout for network requests
 *   - {Buffer} icon An application icon which will appear with all
 *     notifications sent by this application. Binary image file data.
 *   - {Object.<string, (string|number|boolean|Buffer|null)>} additionalHeaders
 *     More GNTP headers to append to every query
 *
 * @param {Object.<string, ?string>=} security An object with the following keys:
 *   - password Configured in the Growl client. Normally not required if on the
 *     the client is on the same machine.
 *   - hashAlgorithm Required if password given. Available algorithms:
 *     - MD5 (not very secure)
 *     - SHA1 (secure, but doesn't provide digest long enough for AES)
 *     - SHA256 (secure, default)
 *     - SHA512 (Pentagon)
 *   - encryptionsAlgorithm Note that Growl 1.3.1 for OS X does NOT support
 *     encryption yet because of stupid laws in some countries. Therefore
 *     encryption is disabled by default. In Growl for Windows it works though,
 *     and these are the available algorithms:
 *     - AES (recommended)
 *     - DES
 *     - 3DES
 */
var GrowlApplication = function(name, options, security) {
  this.name = name;
  this.options = {};
  security = security || {};

  _.defaults(this.options, options, {
    hostname: 'localhost',
    port: 23053,
    timeout: 5000, // Socket inactivity timeout
    icon: null, // Buffer,
    additionalHeaders: {}
  });

  this.persistentHeaders = {
    'Origin-Software-Name': 'Node Growler',
    'Origin-Software-Version': '0.0.1'
  };
  // Extend with user supplied headers
  _.defaults(this.persistentHeaders, this.options.additionalHeaders);

  // Our guard will take care of all security issues
  this.guard = new SecurityGuard(
      security.password || null,
      security.hashAlgorithm || 'SHA256',
      security.encryptionAlgorithm || null);

  this.notifications = {};
};

GrowlApplication.prototype = new events.EventEmitter();

// Export using node.js module layer
exports.GrowlApplication = GrowlApplication;

/**
 * Set notifications to this GrowlApplication instance. This does NOT send any
 * notification, this just makes it possible to register them to the Growl
 * client (required). After that it is possible to send notifications.
 *
 * @param {Object.<string, Object>} notifications An object where keys are the
 *   names of the notifications and the values are objects with these keys:
 *   - {?string} displayName: The name of the notification, as seen in the
 *     Growl client settings. Defaults to the name of the notification.
 *   - {?boolean} enabled: If this notification should be enabled be default.
 *     Defaults to true.
 *   - {Buffer} icon: An image file buffer to display as notification icon.
 */
GrowlApplication.prototype.setNotifications = function(notifications) {
  _.each(_.clone(notifications), function(options, name) {
    notifications[name] = {};
    _.defaults(notifications[name], options, {
      displayName: name, // Set display name
      enabled: true, // Enabled by default
      icon: null
    });
  });
  this.notifications = notifications;
};

/**
 * Register this application to the Growl client. All notifications that have
 * been added will be registered. If an application is registered multiple
 * times with the same name, the previous gets overwritten. It is required to
 * register before sending notifications. Registrations are persistent on the
 * client so there is no need to register if no updates to the application has
 * been made.
 *
 * @param {?function(boolean, Error=)} callback Always called. Possible errors
 *   are "not authorized" (usually wrong or lacking password), connection error
 */
GrowlApplication.prototype.register = function(callback) {

  var headerBlocks = [{
    'Application-Name': this.name,
    'Notifications-Count': _.keys(this.notifications).length,
    'Application-Icon': this.options.icon
  }];
  _.each(this.notifications, function(options, name) {
    headerBlocks.push({
      'Notification-Name': name,
      'Notification-Display-Name': options.displayName || name,
      'Notification-Enabled': !!options.enabled,
      // There is a bug in Growl 1.3.2 which ignores this icon
      // @see GrowlApplication.prototype.sendNotification
      'Notification-Icon': options.icon
    });
  });

  this.sendQuery('REGISTER', headerBlocks, callback);
};

/**
 * Send a notification to the host.
 *
 * @param {string} name Notification name, must have already been added to the
 *   GrowlApplication object. Throws an error if it doesn't exist.
 *
 * @param {Object=} options Additional options object with the following keys:
 *   - {?string} title: Title of the message on the screen, visible to user
 *   - {?string} text: Message text, visible to the user
 *   - {?boolean} sticky: Makes sure notification stays on screen until clicked
 *   - {Buffer} icon: Image file buffer
 *
 * @param {?function(boolean, Error=} callback Always called
 *
 * @return {string} The randomized notification ID
 */
GrowlApplication.prototype.sendNotification = function (name, options, callback) {

  var notification = this.notifications[name];
  if (!notification)
    throw new Error('Cannot find notification with name <'+ name +'>');

  var id = crypto.randomBytes(16).toString('hex');

  options = options ? _.clone(options) : {};

  _.defaults(options, {
    title: notification.displayName,
    text: null,
    sticky: null, // Stay on screen until clicked
    priority: null, // In range [-2, 2], 2 meaning emergency
    icon: notification.icon,
    coalescingID: null
  });

  var headerBlocks = [{
    'Application-Name': this.name,
    'Notification-Name': name,
    'Notification-ID': id,
    'Notification-Title': options.title,
    'Notification-Text': options.text,
    'Notification-Sticky': options.sticky,
    'Notification-Priority': options.priority,
    'Notification-Icon': options.icon, // @see GrowlApplication.prototype.register
    'Notification-Coalescing-ID': options.coalescingID
  }];

  this.sendQuery('NOTIFY', headerBlocks, callback);

  return id;
};

/* PRIVATE */

/**
 * Assemble a query into a message string and attachments as buffers.
 * One possible side effect is that the headerBlocks object may be altered.
 *
 * @param {Array.<Object.<string, (string|number|boolean|Buffer|null)>>}
 *   headerBlocks An array of header blocks, where each block is an object with
 *   a string key and one of these values:
 *   - string: (GNTP <string>)
 *   - number: (GNTP <int>) Will run through parseInt to assure integer
 *   - boolean: (GNTP <boolean>) May NOT be null, see below.
 *   - Buffer: (GNTP <uniqueid>) for sending binary data, e.g. an image.
 *   - null: omits the entire header
 *
 * @return {Object} An object with the keys:
 *   - {string} message: The message, does NOT begin nor end with CRLF
 *   - {Object.<string, !Buffer>} attachments: Keys are the GNTP <uniqueid>'s,
 *     values are their corresponding buffers.
 */
GrowlApplication.prototype.assembleQuery = function(headerBlocks) {
  var self = this,
    blocks = [],
    attachments = {}; // An object with <uniqueid> as keys and buffers as values
  _.each(headerBlocks, function(header, index) {
    var lines = [];
    if (index == 0) {
      // Additional headers belongs to the first block
      _.defaults(header, self.persistentHeaders);
    }
    _.each(header, function(value, key) {
      if (typeof key != 'string' || value == null)
        return;
  
      // Special case for buffers, they will be treated as attachments
      if (Buffer.isBuffer(value)) {
        // Create an md5 hash of the buffer
        var hash = crypto.createHash('md5');
        hash.update(value);
        var digest = hash.digest('hex');
        // Add to binary
        attachments[digest] = value;
        // Point to the binary attachment and alter value
        value = 'x-growl-resource://'+ digest;
      }
  
      // Alter value so that it is completely GNTP safe
      switch (typeof value) {
      case 'string':
        break;
      case 'number':
        value = parseInt(value);
        if (isNaN(value))
          return;
        break;
      case 'boolean':
        value = value ? 'True' : 'False';
        break;
      default:
        return;
      }
      // If everything worked out, add the line
      lines.push(key +': '+ value);
    });
    blocks.push(lines.join(nl));
  });
  return {
    message: blocks.join(nl2),
    attachments: attachments
  };
};

/**
 * Retrieve the GNTP information line which often looks something like
 * "GNTP/1.0 REGISTER NONE" or similar.
 *
 * @param {string} messageType GNTP message type, e.g. 'REGISTER'
 *
 * @return {string} GNTP information line, without CRLF.
 */
GrowlApplication.prototype.getInfoLine = function(messageType) {
  var infoLine = 'GNTP/1.0 '+ messageType +' ';
  if (this.guard.encAlg) // Encryption enabled
      infoLine += this.guard.encAlg +':'+ this.guard.iv.toString('hex');
  else // No encryption
    infoLine += 'NONE';
  if (this.guard.hashAlg) // Password protection
    infoLine += ' '+ this.guard.hashAlg +':'+
                this.guard.keyHash +'.'+ this.guard.salt.toString('hex');
  // Actually, GNTP only requires the algorithm id (e.g. sha1) to be uppercase
  // but their example GNTP information lines are all uppercase so better be safe.
  return infoLine.toUpperCase();
};

/**
 * Send a query and wait for response, then call provided callback.
 * Takes care of calling appropriate security methods and encryption.
 *
 * @param {string} messageType The GNTP message type, e.g. "NOTIFY"
 *
 * @param {Array.<Object.<string, (string|number|boolean|Buffer|null)>>}
 *   headerBlocks A list of header objects.
 * @see GrowlApplication.prototype.assembleQuery
 *
 * @param {function(boolean, Error=)} callback
 *   
 */
GrowlApplication.prototype.sendQuery = function(messageType, headerBlocks, callback) {
  var self = this;
  var socket = new net.Socket();
  callback = callback || function() {};
  // Since neither Growl for OS X or Windows encrypt their responses,
  // presume plain text
  socket.setEncoding('utf8');

  // Connect
  socket.connect(this.options.port, this.options.hostname, function() {
    // Retrieve the data that shall be sent
    var data = self.assembleQuery(headerBlocks),
      infoLine = self.getInfoLine(messageType);

    var readableRequest = infoLine + nl + data.message;
    // Information line never encrypted
    socket.write(infoLine+nl);
    self.guard.writeSecure(socket, data.message);

    _.each(data.attachments, function(buffer, uniqueid) {
      // Anonymous self-invoking function are useful sometimes
      (function(binaryHeader) {
        socket.write(binaryHeader);
        readableRequest += binaryHeader;
      })(nl2 +'Identifier: '+ uniqueid + nl +'Length: '+ buffer.length + nl2);
      
      self.guard.writeSecure(socket, buffer);
      readableRequest += '<'+ buffer.length +' bytes of binary data>';
    });
    socket.write(nl2);
    readableRequest += nl2;
    self.emit('request', readableRequest);
  });

  var recieved = '';
  // Aggregate data before parsing
  socket.on('data', function(data) {
    recieved += data;
  });

  // Actively wait for remote to close socket
  socket.once('close', function(error) {
    self.emit('response', recieved);
    var response = self.parseResponse(recieved);
    if (response && response.status) // All good
      callback(true);
    else if (response) { // GNTP responded with error
      var e = new Error('Host: '+
        (response.headers['Error-Description'] ? response.headers['Error-Description'] : ''));

      e.errorCode = response.headers['Error-Code'];
      callback(false, e);
    }

    else // Not even valid GNTP
      callback(false, new Error('The response was invalid GNTP.'));
  });

  // Exception management
  socket.on('error', function(exception) {
    // Could probably not connect to server
    callback(false, exception);
  });
  // We can not wait forever
  socket.setTimeout(this.options.timeout, function() {
    socket.destroy();
    callback(false, new Error('Server did not respond'));
  });
};


/**
 * Parses a raw response string into an object with information about the status
 * and other headers. Ignores lines that are not "key: value" structured.
 *
 * @param {string} data Raw response string
 *
 * @return {Object} If malformed GNTP response information line, then null
 *   or else an object with the following keys:
 *   - {boolean} status: Message type, true for '-OK', false for '-ERROR'
 *   - {Object.<string, string>} headers: An object with keys and values
 *     corresponding to the GNTP headers, e.g.
 *     - 'Response-Action': 'NOTIFY',
 *     - 'Error-Code': '402'
 */
GrowlApplication.prototype.parseResponse = function(data) {
  var lines = data.split(nl),
    matches;

  // Check for valid GNTP header
  if (!(lines.length &&
        (matches = /^GNTP\/1\.0\s\-(OK|ERROR)\sNONE\s*$/.exec(lines.shift())) &&
        matches.length == 2))
    return null; // Invalid, return null

  var status = matches[1] == 'OK';
  var headers = {};
  _(lines).chain()
    .filter(function(line) { return /^.+:\s.*$/.test(line); })
    .map(function(line) {
      // Match key: value pair
      var matches = /^(.+):\s(.*)$/.exec(line);
      if (!matches || matches.length < 3)
        throw new Error('GNTP Module internal error');

      headers[matches[1]] = matches[2];
    })
    .value(); // End chain
  return {
    status: status,
    headers: headers
  };
};
