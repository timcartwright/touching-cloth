const functions = require('firebase-functions');
const admin = require('firebase-admin');
const rp = require('request-promise');

admin.initializeApp(functions.config().firebase);

exports.updateLeaderboard = functions.database.ref('/matches/{pushId}')
.onWrite(event => {
    const match = event.data.val();
    let loser;
    let winner;
    let winnerKey;
    const leaderboard = admin.database().ref('leaderboard');
    let newLeaderboard = [];

    leaderboard.once('value').then(function(positions) {
        positions.forEach(function(position) {
            const playerKey = position.val();

            if (playerKey === match.winner.key) {
                winner = position.key;
                winnerKey = playerKey;
            } else if (playerKey === match.loser.key) {
                loser = position.key;
            }

            if ((!winner && !loser) || (winner && !loser) || (winner < loser)) {
                newLeaderboard.push(playerKey);
            } else if (loser === position.key) {
                newLeaderboard.push('replaceWithWinner');
                newLeaderboard.push(playerKey);
            } else if (winner !== position.key) {
                newLeaderboard.push(playerKey);
            }

        });

        newLeaderboard = newLeaderboard.map(value => value === 'replaceWithWinner' ? winnerKey : value);

        // You must return a Promise when performing asynchronous tasks inside a Functions such as
        // writing to the Firebase Realtime Database.
        return leaderboard.set(newLeaderboard);
    });
});

exports.requestMatch = functions.database.ref('/players/{player}')
.onUpdate(event => {
    const player = event.data.val();
    const playingState = player.playingState;

    if (player.playingState !== 'has been selected') return false;

    const slackToken = functions.config().slack.token;
    const userListUrl = 'https://slack.com/api/users.list?token=' + slackToken;
    const sendMessageUrl = 'https://slack.com/api/chat.postMessage';
    let slackUser;

    const options = {
        url: userListUrl,
        json: true
    };


    return rp(options)
    .then(response => {
        slackUser = response.members.find(member => member.profile.email === 'tim.cartwright@mediablazegroup.com');
        const opponentRef = admin.database().ref('players/' + player.opponent);
        return opponentRef.once('value');
    })
    .then(opponent => {
        const opponentName = opponent.child('displayName').val();
        console.log(opponentName);

        const sendMessageOptions = {
            method: 'POST',
            url: sendMessageUrl,
            formData: {
                token: slackToken,
                channel: '@' + slackUser.name,
                text: '@' + slackUser.name + ' Want to touch cloth with ' + opponentName + '?'
            }
        };

        return rp(sendMessageOptions);
    })
    .then(response => {
        console.log('response:', response);
    });

});
