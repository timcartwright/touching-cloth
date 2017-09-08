import fire from './fire';
import firebase from 'firebase';

let exports = {

    updateLeaderboard(winner, loser, leaderboard) {
        let winnerIndex;
        let loserIndex;
  
        leaderboard.forEach((playerKey, index) => {
          if (playerKey === winner.key) {
            winnerIndex = index;
          } else if (playerKey === loser.key) {
            loserIndex = index;
          }
        });
  
        console.log(winnerIndex, loserIndex);
  
        if (winnerIndex > loserIndex) {
          const newLeaderboard = [...leaderboard.slice(0,loserIndex), winner.key, ...leaderboard.slice(loserIndex, winnerIndex), ...leaderboard.slice(winnerIndex + 1)];
          console.log(newLeaderboard);
        
          fire.post('leaderboard', {
              data: newLeaderboard
          });
        }
    },

    addToLeaderboard(playerKey) {
        const immediatelyAvailableReference = fire.push('leaderboard', {
            data: playerKey
        });
        //available immediately, you don't have to wait for the callback to be called
        return immediatelyAvailableReference.key;
    },

    addNewPlayer(player) {
        const immediatelyAvailableReference = fire.push('players', {
            data: player
        });
        this.addToLeaderboard(immediatelyAvailableReference.key);
        //available immediately, you don't have to wait for the callback to be called
        return immediatelyAvailableReference.key;
    },

    logOut() {
        firebase.auth().signOut().then(() => {
            console.log('logged out');
          }).catch(error => {
            console.log(error);
            // An error happened.
          });
    },

    updatePlayer(player) {
        return fire.update('players/' + player.key, {
          data: player
        });
    },
  
    updatePlayers(players) {
      return fire.post('players', {
        data: players
      });
    },
    
    updatePlayingState(player, playingState) {
        this.updatePlayer({
            ...player,
            playingState
        }) 
    },

    saveResult(winner, loser) {
        fire.push('matches', {
            data: {winner, loser}
        });
    }
    

};

export default exports;
    