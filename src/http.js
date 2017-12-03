import fire from './fire';
import firebase from 'firebase';
import callApi from './callApi';

let exports = {

    addNewPlayer(player) {
        const immediatelyAvailableReference = fire.push('players', {
            data: player
        });
        this.addToLeaderboard(immediatelyAvailableReference.key);
        //available immediately, you don't have to wait for the callback to be called
        return immediatelyAvailableReference.key;
    },

    async getPlayers() {
        const playersResponse = await callApi('GET', 'players');
        return playersResponse.body;
    },

    updatePlayer(player) {
        return callApi('PUT', 'players/' + player.id, player);
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
    