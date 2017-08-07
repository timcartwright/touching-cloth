import React, { Component } from 'react';
import fire from './fire';
import firebase from 'firebase';
import Header from './components/Header';
import PageTitle from './components/PageTitle';
import Button from './components/Button';
import Section from './components/Section';
import Wrap from './components/Wrap';
import Leaderboard from './components/Leaderboard';
import Login from './components/Login';
import constants from './constants';
    
class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPlayer: null,
      players: null,
      loading: true
    };
  }

  componentDidMount() {
    this.fetchPlayersFromFirebase()
    .then(players => {
      this.setState({players}, () => {
        this.listenForAuth();
        this.bindPlayersToFirebase();
        this.setState({loading: false});
      })
    })
  }

  adjustLeaderboard(winner, loser) {
      let players = this.state.players.slice();
      console.log(players);
      let winnerIndex;
      let loserIndex;

      players.forEach((player, index) => {
        if (player.email === winner.email) {
          winnerIndex = index;
        } else if (player.email === loser.email) {
          loserIndex = index;
        }
      });

      if (winnerIndex > loserIndex) {
        players = [...players.slice(0,loserIndex), winner, ...players.slice(loserIndex, winnerIndex), ...players.slice(winnerIndex + 1)];
        console.log(players);
        
        this.updatePlayers(players);
      }
  }

  listenForAuth() {
    firebase.auth().onAuthStateChanged(user => {
      this.fetchPlayersFromFirebase()
      .then(players => {
        if (user) {
          let currentPlayer = players.find(player => player.email === user.email);
          console.log('Logged in', user, players);

          if (!currentPlayer) {
              console.log('Adding new player');

              currentPlayer = {
                displayName: user.displayName,
                email: user.email,
                playingState: constants.INACTIVE,
              }

              this.addNewPlayer(currentPlayer)
              .then(key => {
                this.syncCurrentPlayerWithFirebase(key);
              });
          } else {
            this.syncCurrentPlayerWithFirebase(currentPlayer.key);
          }
        }
      })
    });
  }

  handleButtonClick() {
    const {currentPlayer, players} = this.state;
    let opponent
    let playingState;

    if (currentPlayer.opponent) {
      opponent = players.find(player => player.email === currentPlayer.opponent.email);
    }

    switch(currentPlayer.playingState) {
    case constants.INACTIVE:
        playingState = constants.SELECTING_OPPONENT;
        break;

    case constants.SELECTING_OPPONENT:
        playingState = constants.INACTIVE;
        break;

    case constants.HAS_SELECTED_OPPONENT:
        playingState = constants.INACTIVE;
        this.updatePlayingState(opponent, playingState);
        break;

    case constants.HAS_BEEN_SELECTED:
        playingState = constants.PLAYING;
        this.updatePlayingState(opponent, playingState);
        break;

    case constants.PLAYING:
        playingState = constants.HAS_DECLARED_RESULT;
        this.updatePlayingState(opponent, constants.SHOULD_CONFIRM_RESULT);
        break;

    case constants.HAS_DECLARED_RESULT:
      playingState = constants.PLAYING;
      this.updatePlayingState(opponent, constants.PLAYING);
      break;

    case constants.SHOULD_CONFIRM_RESULT:
      playingState = constants.INACTIVE;
      this.updatePlayer({
        ...opponent,
        playingState,
        streak: opponent.streak ? [...opponent.streak, 'W'] : ['W']
      })
      .then(() => {
        console.log('update loser');
        this.setState({
          currentPlayer: {
            ...currentPlayer,
            playingState,
            streak: currentPlayer.streak ? [...currentPlayer.streak, 'L'] : ['L']
          }
        }, () => {
          this.saveResult(opponent, currentPlayer);
          this.adjustLeaderboard(opponent, currentPlayer);
        });
      })

      return;

    default:
      playingState = constants.INACTIVE;
      this.updatePlayingState(opponent, playingState);
    }

    console.log(currentPlayer, playingState);
    this.setState({
      currentPlayer: {...currentPlayer, playingState}
    });
  }

  handleLogOut() {
    firebase.auth().signOut().then(() => {
      fire.removeBinding(this.refSyncCurrent);
      this.setState({currentPlayer: null});
    }).catch(error => {
      // An error happened.
    });
  }

  handleSelectOpponent() {
    this.setState({stateOfPlay: constants.SELECTING_OPPONENT});
  }

  selectOpponent(opponent) {
    const {currentPlayer} = this.state;
    delete opponent.opponent;

    this.setState({
      currentPlayer: {
        ...currentPlayer,
        playingState: constants.HAS_SELECTED_OPPONENT,
        opponent
      }
    });

    this.updatePlayer({
      ...opponent,
      playingState: constants.HAS_BEEN_SELECTED,
      opponent: currentPlayer
    })
  }

  async addNewPlayer(player) {
      var immediatelyAvailableReference = fire.push('players', {
          data: player
      });
      //available immediately, you don't have to wait for the callback to be called
      return immediatelyAvailableReference.key;
  }

  updatePlayer(player) {
      console.log('updating player', player);
      return fire.update('players/' + player.key, {
        data: player
      });
  }

  updatePlayers(players) {
    players.forEach(player => console.log(player.email));
      return fire.post('players', {
        data: players
      });
  }
  
  updatePlayingState(player, playingState) {
      this.updatePlayer({
          ...player,
          playingState
      }) 
  }

  saveResult(winner, loser) {
      var immediatelyAvailableReference = fire.push('matches', {
          data: {winner, loser}
      });
      //available immediately, you don't have to wait for the callback to be called
      return immediatelyAvailableReference.key;
  }

  syncCurrentPlayerWithFirebase(ref) {
    this.refSyncCurrent = fire.syncState('players/' + ref, {
      context: this,
      state: 'currentPlayer',
      then(err){
        if(!err){
          this.setState({currentPlayer:
            {...this.state.currentPlayer, key: ref}
          })
        }
      }
    });
  }

  bindPlayersToFirebase() {
    return fire.bindToState('players', {
      context: this,
      state: 'players',
      asArray: true
    })
  }

  fetchPlayersFromFirebase() {
    return fire.fetch('players', {
        context: this,
        asArray: true
      })
  }

  render() {
    const {currentPlayer, loading, players} = this.state;
    let introText, buttonText;

    if (loading) {
      return null;
    }

    if (currentPlayer) {
      switch(currentPlayer.playingState) {
      case constants.SELECTING_OPPONENT:
          introText = 'Select your opponent';
          buttonText = 'Cancel';
          break;
      case constants.HAS_SELECTED_OPPONENT:
          introText = `Waiting for ${currentPlayer.opponent.displayName}`;
          buttonText = 'Cancel Request';
          break;
      case constants.HAS_BEEN_SELECTED:
          introText = `${currentPlayer.opponent.displayName} wants to play you`;
          buttonText = 'Play';
          break;
      case constants.PLAYING:
          introText = `You are playing ${currentPlayer.opponent.displayName}`;
          buttonText = 'I won';
          break;
      case constants.HAS_DECLARED_RESULT:
        introText = `Waiting for ${currentPlayer.opponent.displayName} to confirm you won`;
        buttonText = 'Withdraw result';
        break;
      case constants.SHOULD_CONFIRM_RESULT:
        introText = `Please confirm that you lost to ${currentPlayer.opponent.displayName}`;
        buttonText = 'Yes I lost';
        break;
      default:
          introText = `Hi ${currentPlayer.displayName}`;
          buttonText = 'Propose a Game';
      }
    } else {
      introText = 'Let\'s play pool';
    }

    return (
      <Wrap>
        <Header>
          <PageTitle>Touching Cloth</PageTitle>

          {currentPlayer &&
          <p style={{cursor: 'pointer'}} onClick={this.handleLogOut.bind(this)}>
            Log out
          </p>}

        </Header>
        <Section intro>
          {introText}
        </Section>

        {currentPlayer ?
          <div>
            <Section actions>
              <Button onClick={this.handleButtonClick.bind(this)}>
                {buttonText}
              </Button>
            </Section>
            <Leaderboard
              currentPlayer={currentPlayer}
              isSelectingOpponent={currentPlayer.playingState === constants.SELECTING_OPPONENT}
              players={players}
              selectOpponent={this.selectOpponent.bind(this)}
            />
          </div>
        :
          <Login />
        }

      </Wrap>
    );
  } 
}

export default App;
