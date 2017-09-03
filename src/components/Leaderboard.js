import React from 'react';
import FlipMove from 'react-flip-move';
import Streak from './Streak';
import InlineFlex from './InlineFlex';
import '../App.css';

const Leaderboard = ({currentPlayer, isSelectingOpponent,leaderboard, players, selectOpponent}) => {

    if (!leaderboard || !players) return null;

    return (
        <div className={isSelectingOpponent ? 'leaderboard leaderboard--active' : 'leaderboard'}>
            <FlipMove duration={750} easing="ease-out">
                {leaderboard.map(playerKey => {
                    const player = players.find(p => p.key === playerKey);
                    const {displayName, key, streak, email, playingState} = player;
                    const isCurrentPlayer = key === currentPlayer.key;
                    const playerIsInactive = playingState === 'inactive';
                    const selectable = isSelectingOpponent && playerIsInactive && !isCurrentPlayer;

                    return (
                        <div
                            className={selectable ? 'leaderboard__item leaderboard__item--active' : 'leaderboard__item'}
                            key={key}
                            onClick={selectable && selectOpponent.bind(null, player)}
                        >
                            <span>{email}</span>
                            <InlineFlex>
                                {streak && <Streak streak={streak.slice(-5)} />}
                            </InlineFlex>
                        </div>
                    )
                })}
            </FlipMove>
        </div>
    );
}

export default Leaderboard;
