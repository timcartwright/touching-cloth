import React, { Component } from 'react';
import fire from './fire';
import firebase from 'firebase';
import ContentWrap from './components/presentation/ContentWrap';
import Topbar from './components/presentation/Topbar';
import Header from './components/presentation/Header';
import PageTitle from './components/presentation/PageTitle';
import Button from './components/presentation/Button';
import Section from './components/presentation/Section';
import Wrap from './components/presentation/Wrap';
import Leaderboard from './components/leaderboard';
import Login from './components/login';
import constants from './constants';
import Logo from './img/tc-logo.svg';
import LeaderboardRow from './components/leaderboard/LeaderboardRow';
import utils from './helpers';

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

              const key = utils.addNewPlayer(currentPlayer);
              this.setState({currentPlayerKey: key});

          } else {
            if (!currentPlayer.avatar) {
              currentPlayer.avatar = user.photoURL;
              utils.updatePlayer(currentPlayer);
            }
            this.setState({currentPlayerKey: currentPlayer.key});
          }
        }
      })
    });
  }

  handleButtonClick() {
    const {leaderboard, players} = this.state;
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
        utils.updatePlayingState(opponent, playingState);
        break;

    case constants.HAS_BEEN_SELECTED:
        playingState = constants.PLAYING;
        utils.updatePlayingState(opponent, playingState);
        break;

    case constants.PLAYING:
        playingState = constants.HAS_DECLARED_RESULT;
        utils.updatePlayingState(opponent, constants.SHOULD_CONFIRM_RESULT);
        break;

    case constants.HAS_DECLARED_RESULT:
      playingState = constants.PLAYING;
      utils.updatePlayingState(opponent, constants.PLAYING);
      break;

    case constants.SHOULD_CONFIRM_RESULT:
      playingState = constants.INACTIVE;
      utils.updatePlayer({
        ...opponent,
        playingState,
        streak: opponent.streak ? [...opponent.streak, 'W'] : ['W']
      })
      .then(() => {
        console.log('update loser');
        utils.updatePlayer({
          ...currentPlayer,
          playingState,
          streak: currentPlayer.streak ? [...currentPlayer.streak, 'L'] : ['L']
        })
      })
      .then(() => {
        console.log(opponent, currentPlayer);
        utils.saveResult(opponent, currentPlayer);
        utils.updateLeaderboard(opponent, currentPlayer, leaderboard);
      });

      return;

    default:
      playingState = constants.INACTIVE;
      utils.updatePlayingState(opponent, playingState);
    }

    utils.updatePlayer({
      ...currentPlayer,
      playingState,
    });
  }

  handleLogOut() {
    this.setState({currentPlayerKey: null});
    utils.logOut();
  }

  selectOpponent(opponent) {
    const currentPlayer = this.currentPlayer();

    utils.updatePlayer({
      ...opponent,
      playingState: constants.HAS_BEEN_SELECTED,
      opponent: currentPlayer.key
    });

    utils.updatePlayer({
      ...currentPlayer,
      playingState: constants.HAS_SELECTED_OPPONENT,
      opponent: opponent.key
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
