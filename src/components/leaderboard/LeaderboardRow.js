import React, {Component} from 'react';
import Avatar from './Avatar';
import Rank from './Rank';
import Name from './Name';
import Streak from './Streak';
import '../../App.css';

class LeaderboardRow extends Component {

    render() {
        const {rank, player, selectable, selectOpponent} = this.props;
        const {displayName, playingState, streak} = player;

        return (
            <div
                className={selectable ? 'leaderboard__item leaderboard__item--active' : 'leaderboard__item'}
                onClick={selectable && selectOpponent}
            >
                <Rank>{rank}</Rank>
                
                <Avatar player={player}></Avatar>

                <Name>
                    <div>
                        {displayName}
                        <div>
                            <sub>{playingState}</sub>
                        </div>
                    </div>
                </Name>

                <div style={{flex: '0 0 72px', textAlign: 'right'}}>
                    {streak && <Streak streak={streak.slice(-5)} />}
                </div>

            </div>
        );
    }
}

export default LeaderboardRow;
