import React from 'react';
import FlipMove from 'react-flip-move';
import LeaderboardRow from './LeaderboardRow';
import '../App.css';

const Leaderboard = ({currentPlayer, isSelectingOpponent,leaderboard, players, selectOpponent}) => {

    if (!leaderboard || !players) return null;

    return (
        <div className={isSelectingOpponent ? 'leaderboard leaderboard--active' : 'leaderboard'}>
            <FlipMove
                appearAnimation="accordionVertical"
                duration={500}
                easing="ease-out"
                staggerDelayBy={100}
            >
                {leaderboard.map((playerKey, index) => {
                    const player = players.find(p => p.key === playerKey);
                    const {key, playingState} = player;
                    const isCurrentPlayer = key === currentPlayer.key;
                    const playerIsInactive = playingState === 'inactive';
                    const selectable = isSelectingOpponent && playerIsInactive && !isCurrentPlayer;

                    return (
                        <LeaderboardRow
                            selectable={selectable}
                            key={key}
                            player={player}
                            rank={index + 1}
                            selectOpponent={selectOpponent.bind(null, player)}
                        />
                    );
                })}
            </FlipMove>
        </div>
    );
}

export default Leaderboard;
