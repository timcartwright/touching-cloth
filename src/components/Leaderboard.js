import React from 'react';
import styled from 'styled-components';
import List from './List';
import ListItem from './ListItem';
import Streak from './Streak';
import InlineFlex from './InlineFlex';

const Leaderboard = ({currentPlayer, isSelectingOpponent,leaderboard, players, selectOpponent}) => {

    if (!leaderboard || !players) return null;

    const StyledList = styled(List)`
        box-shadow: ${isSelectingOpponent ? '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' : 'none'};
        margin: 0 auto;
        max-width: 375px;
    `

    const StyledListItem = styled(ListItem)`
        ${props => props.link && `
            cursor: pointer;

            &:hover {
                text-decoration: underline;
            }
        `}
    `

    return (
        <StyledList>
            {leaderboard.map(playerKey => {
                const player = players.find(p => p.key === playerKey);
                const {displayName, key, streak, email, playingState} = player;
                const isCurrentPlayer = key === currentPlayer.key;
                const playerIsInactive = playingState === 'inactive';
                const selectable = isSelectingOpponent && playerIsInactive && !isCurrentPlayer;

                return (
                    <StyledListItem
                        link={selectable}
                        key={key}
                        onClick={selectable && selectOpponent.bind(null, player)}
                    >
                        <span>{email} - {playingState}</span>
                        <InlineFlex>
                            {streak && <Streak streak={streak.slice(-5)} />}
                        </InlineFlex>
                    </StyledListItem>
                )
            })}
        </StyledList>
    );
}

export default Leaderboard;
