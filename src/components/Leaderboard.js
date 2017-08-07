import React from 'react';
import styled from 'styled-components';
import List from './List';
import ListItem from './ListItem';
import Streak from './Streak';
import InlineFlex from './InlineFlex';

const Leaderboard = ({currentPlayer, isSelectingOpponent, players, selectOpponent}) => {

    const StyledList = styled(List)`
        box-shadow: ${isSelectingOpponent ? '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' : 'none'};
        margin: 0 auto;
        max-width: 320px;
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
            {players.map(player => {
                const {displayName, key, streak, email} = player;
                const isCurrentPlayer = currentPlayer.key === player.key;

                return (
                    <StyledListItem
                        link={isSelectingOpponent && !isCurrentPlayer}
                        key={key}
                        onClick={isSelectingOpponent && !isCurrentPlayer && selectOpponent.bind(null, player)}
                    >
                        <span>{email}</span>
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
