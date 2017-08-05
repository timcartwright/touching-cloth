import React, { Component } from 'react';
import Header from './components/Header';
import PageTitle from './components/PageTitle';
import Button from './components/Button';
import Section from './components/Section';
import Wrap from './components/Wrap';
import Leaderboard from './components/Leaderboard';
import constants from './constants';
    
class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentUser: {
        fname: 'Tim',
        lname: 'Cartwright'
      },
      leaderboard: [
        {
          fname: 'Spike',
          lname: 'Bowen',
          streak: ['W', 'L', 'W', 'W', 'W']
        },
        {
          fname: 'James',
          lname: 'Clifton',
          streak: ['W', 'L', 'W', 'W', 'L']
        },
        {
          fname: 'Tim',
          lname: 'Cartwright',
          streak: ['W', 'L', 'L', 'L', 'W']
        },
      ],
      selectOpponent: null,
      stateOfPlay: constants.INACTIVE
    };
  }

  handleButtonClick() {
    let stateOfPlay;

    switch(this.state.stateOfPlay) {
    case constants.INACTIVE:
        stateOfPlay = constants.SELECTING_OPPONENT;
        break;
    case constants.SELECTING_OPPONENT:
        stateOfPlay = constants.INACTIVE;
        break;
    case constants.SELECTED_OPPONENT:
        stateOfPlay = constants.INACTIVE;
        break;
    }

    this.setState({stateOfPlay});
  }

  handleSelectOpponent() {
    this.setState({stateOfPlay: constants.SELECTING_OPPONENT});
  }

  selectOpponent(selectOpponent) {
    this.setState({
      selectOpponent,
      stateOfPlay: constants.SELECTED_OPPONENT
    });
  }

  render() {
    const {currentUser, stateOfPlay, leaderboard, selectOpponent} = this.state;
    let introText, buttonText;

    switch(stateOfPlay) {
    case constants.SELECTING_OPPONENT:
        introText = 'Select your opponent';
        buttonText = 'Cancel';
        break;
    case constants.SELECTED_OPPONENT:
        introText = `Waiting for ${selectOpponent.fname}`;
        buttonText = 'Cancel Request';
        break;
    // case constants.SELECTED_OPPONENT:
    //     introText = 'Cancel match';
    //     break;
    default:
        introText = `Hi ${currentUser.fname}`;
        buttonText = 'Request a Game';
    }

    return (
      <Wrap>
        <Header>
          <PageTitle>Touching Fire</PageTitle>
        </Header>
        <Section intro>
          {introText}
        </Section>
        <Leaderboard
          currentUser={currentUser}
          isSelectingOpponent={stateOfPlay === constants.SELECTING_OPPONENT}
          leaderboard={leaderboard}
          selectOpponent={this.selectOpponent.bind(this)}
        />
        <Section actions>
          <Button onClick={this.handleButtonClick.bind(this)}>
            {buttonText}
          </Button>
        </Section>
      </Wrap>
    );
  } 
}

export default App;
