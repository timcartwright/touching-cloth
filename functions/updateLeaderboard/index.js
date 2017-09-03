const admin = require('firebase-admin');

exports.handler = (event) => {
    const leaderboard = admin.database().ref('leaderboard');
    const match = event.data.val();
    let loser;
    let rank = 1;
    let winner;
    let winnerKey;
    let newLeaderboard = [];

    leaderboard.once('value')
    .then(positions => {
        positions.forEach(position => {
            const playerKey = position.val();

            if (playerKey === match.winner.key) {
                winner = rank;
                winnerKey = playerKey;

            } else if (playerKey === match.loser.key) {
                loser = rank;
            }

            if ((!winner && !loser) || (winner && !loser) || (winner < loser)) {
                newLeaderboard.push(playerKey);

            } else if (loser === rank) {
                newLeaderboard.push('replaceWithWinner');
                newLeaderboard.push(playerKey);

            } else if (winner !== rank) {
                newLeaderboard.push(playerKey);
            }

            rank ++;
        });

        newLeaderboard = newLeaderboard.map(value => value === 'replaceWithWinner' ? winnerKey : value);

        // You must return a Promise when performing asynchronous tasks inside a Functions such as
        // writing to the Firebase Realtime Database.
        return leaderboard.set(newLeaderboard);
    });
};
