const functions = require('firebase-functions');
const slackToken = functions.config().slack.token;
const admin = require('firebase-admin');
const rp = require('request-promise');

const postSlack = ({channel, text}) => {
    const postSlackUrl = 'https://slack.com/api/chat.postMessage';
    const options = {
        method: 'POST',
        url: postSlackUrl,
        formData: {
            token: slackToken,
            channel,
            text
        }
    };
    return rp(options);
}

exports.handler = (event) => {
    let slackUser;
    const player = event.data.val();
    const playingState = player.playingState;

    if (player.playingState !== 'has been selected') return false;

    const userListUrl = 'https://slack.com/api/users.list?token=' + slackToken;

    const options = {
        url: userListUrl,
        json: true
    };

    return rp(options)
    .then(response => {
        slackUser = response.members.find(member => member.profile.email === player.email);
        if (!slackUser) return false;
        const opponentRef = admin.database().ref('players/' + player.opponent);
        return opponentRef.once('value');
    })
    .then(opponent => {
        const opponentName = opponent.child('displayName').val();
        return postSlack({
            channel: '@' + slackUser.name,
            text: '@' + slackUser.name + ' Want to touch cloth with ' + opponentName + '?'
        })
    })
    .then(response => {
        console.log('response:', response);
    });
};
