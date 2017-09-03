const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const updateLeaderboard = require('./updateLeaderboard');
const requestMatch = require('./notifyUser');

// Pass database to child functions so they have access to it
exports.updateLeaderboard = functions.database.ref('/matches/{pushId}').onWrite(updateLeaderboard.handler);
exports.requestMatch = functions.database.ref('/players/{player}').onUpdate(requestMatch.handler);
