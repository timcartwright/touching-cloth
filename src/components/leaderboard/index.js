import React from 'react';
import FlipMove from 'react-flip-move';
import LeaderboardRow from './LeaderboardRow';
import '../../App.css';

const Leaderboard = ({currentPlayer, isSelectingOpponent, players, selectOpponent}) => {

    if (!players) return null;

    const leaderboard = players.slice().sort(function(a, b) {
        if (a.ladderRank < b.ladderRank)
            return -1;
        if (a.ladderRank > b.ladderRank)
            return 1;
        return 0;
    });

    return (
        <div className={isSelectingOpponent ? 'leaderboard leaderboard--active' : 'leaderboard'}>
            <FlipMove
                appearAnimation="accordionVertical"
                duration={500}
                easing="ease-out"
                staggerDelayBy={100}
            >
                {leaderboard.map(player => {
                    const {key, ladderRank, playingState} = player;
                    const isCurrentPlayer = key === currentPlayer.key;
                    const playerIsInactive = playingState === 'inactive';
                    const selectable = isSelectingOpponent && playerIsInactive && !isCurrentPlayer;

                    return (
                        <LeaderboardRow
                            selectable={selectable}
                            key={ladderRank}
                            player={player}
                            rank={ladderRank}
                            selectOpponent={selectOpponent.bind(null, player)}
                        />
                    );
                })}
            </FlipMove>
        </div>
    );
}

export default Leaderboard;
