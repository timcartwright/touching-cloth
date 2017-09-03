import React, { Component } from 'react';
import fire from './fire';
import firebase from 'firebase';
import ContentWrap from './components/ContentWrap';
import Topbar from './components/Topbar';
import Header from './components/Header';
import PageTitle from './components/PageTitle';
import Button from './components/Button';
import Section from './components/Section';
import Wrap from './components/Wrap';
import Leaderboard from './components/Leaderboard';
import Login from './components/Login';
import constants from './constants';
import Logo from './img/tc-logo.svg';
import LeaderboardRow from './components/LeaderboardRow';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPlayerKey: null,
      players: null,
      leaderboard: null,
      loading: true
    };
  }

  componentDidMount() {
    this.bindLeaderboardToFirebase();
    this.fetchPlayersFromFirebase()
      .then(players => {
        this.setState({players}, () => {
          this.listenForAuth();
          this.bindPlayersToFirebase();
          this.setState({loading: false});
        })
      });
  }

  currentPlayer() {
    const {currentPlayerKey, players} = this.state;
    return players.find(player => player.key === currentPlayerKey);
  }

  adjustLeaderboard(winner, loser) {
      let players = this.state.players.slice();
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
        players = [...players.slice(0,loserIndex), winner, ...players.slice(loserIndex)];
        this.updatePlayers(players);
      }
  }

  listenForAuth() {
    firebase.auth().onAuthStateChanged(user => {
      this.fetchPlayersFromFirebase()
      .then(players => {
        if (user) {
          let currentPlayer = players.find(player => player.email === user.email);
          console.log('Logged in:', user);

          if (!currentPlayer && !this.state.currentPlayerKey) {
              console.log('Adding new player');

              currentPlayer = {
                avatar: user.photoURL,
                displayName: user.displayName,
                email: user.email,
                playingState: constants.INACTIVE
              };

              const key = this.addNewPlayer(currentPlayer);
              this.setState({currentPlayerKey: key});

          } else {
            if (!currentPlayer.avatar) {
              currentPlayer.avatar = user.photoURL;
              this.updatePlayer(currentPlayer);
            }
            this.setState({currentPlayerKey: currentPlayer.key});
          }
        }
      })
    });
  }

  handleButtonClick() {
    const {players} = this.state;
    const currentPlayer = this.currentPlayer();
    let opponent;
    let playingState;

    if (currentPlayer.opponent) {
      opponent = players.find(player => player.key === currentPlayer.opponent);
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
        this.updatePlayer({
          ...currentPlayer,
          playingState,
          streak: currentPlayer.streak ? [...currentPlayer.streak, 'L'] : ['L']
        })
      })
      .then(() => {
        this.saveResult(opponent, currentPlayer);
      });

      return;

    default:
      playingState = constants.INACTIVE;
      this.updatePlayingState(opponent, playingState);
    }

    this.updatePlayer({
      ...currentPlayer,
      playingState,
    });
  }

  handleLogOut() {
    this.setState({currentPlayerKey: null});

    firebase.auth().signOut().then(() => {
      console.log('logged out');
    }).catch(error => {
      console.log(error);
      // An error happened.
    });
  }

  selectOpponent(opponent) {
    const currentPlayer = this.currentPlayer();

    this.updatePlayer({
      ...opponent,
      playingState: constants.HAS_BEEN_SELECTED,
      opponent: currentPlayer.key
    });

    this.updatePlayer({
      ...currentPlayer,
      playingState: constants.HAS_SELECTED_OPPONENT,
      opponent: opponent.key
    });
  }

  addNewPlayer(player) {
      const immediatelyAvailableReference = fire.push('players', {
          data: player
      });
      this.addToLeaderboard(immediatelyAvailableReference.key);
      //available immediately, you don't have to wait for the callback to be called
      return immediatelyAvailableReference.key;
  }

  addToLeaderboard(playerKey) {
      const immediatelyAvailableReference = fire.push('leaderboard', {
          data: playerKey
      });
      //available immediately, you don't have to wait for the callback to be called
      return immediatelyAvailableReference.key;
  }

  updatePlayer(player) {
      return fire.update('players/' + player.key, {
        data: player
      });
  }

  updatePlayers(players) {
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
      fire.push('matches', {
          data: {winner, loser}
      });
  }

  bindPlayersToFirebase() {
    return fire.bindToState('players', {
      context: this,
      state: 'players',
      asArray: true
    })
  }

  bindLeaderboardToFirebase() {
    return fire.bindToState('leaderboard', {
      context: this,
      state: 'leaderboard',
      asArray: true
    })
  }

  fetchPlayersFromFirebase() {
    return fire.fetch('players', {
        context: this,
        asArray: true
      })
  }
  
  fetchLeaderboardFromFirebase() {
    return fire.fetch('leaderboard', {
        context: this,
        asArray: true
      })
  }

  render() {
    const {leaderboard, loading, players} = this.state;
    let opponent;
    let introText, buttonText;
    let isSelectingOpponent = false;
    let currentPlayerRank;

    if (loading) {
      return null;
    }

    const currentPlayer = this.currentPlayer();

    if (currentPlayer) {
      isSelectingOpponent = currentPlayer.playingState === constants.SELECTING_OPPONENT;
      currentPlayerRank = leaderboard.indexOf(currentPlayer.key) + 1;

      if (currentPlayer.opponent) {
        opponent = players.find(player => player.key === currentPlayer.opponent);
      }

      switch(currentPlayer.playingState) {
      case constants.SELECTING_OPPONENT:
          introText = 'Select an Opponent';
          buttonText = 'Cancel';
          break;
      case constants.HAS_SELECTED_OPPONENT:
          introText = `Waiting for ${opponent.displayName}`;
          buttonText = 'Cancel Request';
          break;
      case constants.HAS_BEEN_SELECTED:
          introText = `${opponent.displayName} wants to play you`;
          buttonText = 'Play';
          break;
      case constants.PLAYING:
          introText = `You are playing ${opponent.displayName}`;
          buttonText = 'I won';
          break;
      case constants.HAS_DECLARED_RESULT:
        introText = `Waiting for ${opponent.displayName} to confirm you won`;
        buttonText = 'Withdraw result';
        break;
      case constants.SHOULD_CONFIRM_RESULT:
        introText = `Did you lose to ${opponent.displayName}?`;
        buttonText = 'Yes I lost';
        break;
      default:
          introText = `Current Standings`;
          buttonText = 'Propose a Game';
      }
    } else {
      introText = 'Current Standings';
    }

    return (
      <Wrap>
        {currentPlayer &&
        <Topbar>
          <ContentWrap flex>
            <div style={{cursor: 'pointer'}} onClick={this.handleLogOut.bind(this)}>
              Logout
            </div>
          </ContentWrap>
        </Topbar>}

        <Header>
          <PageTitle>
            <img src={Logo} alt="Touching Cloth Logo" />
          </PageTitle>


        </Header>

        {currentPlayer ?
          <div>
            <Section intro>
              <ContentWrap>
                  Here's where you are at the moment
              </ContentWrap>
            </Section>
            <Section currentPlayer>
              <LeaderboardRow
                  selectable={false}
                  player={currentPlayer}
                  rank={currentPlayerRank}
              />
            </Section>
            <Section>
              <div className="leaderboard__title">
                  {introText}
              </div>
            </Section>
            <Section>
              <Button onClick={this.handleButtonClick.bind(this)}>
                {buttonText}
              </Button>
            </Section>
            <Leaderboard
              currentPlayer={currentPlayer}
              isSelectingOpponent={isSelectingOpponent}
              leaderboard={leaderboard}
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
