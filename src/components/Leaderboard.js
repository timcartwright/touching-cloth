import React from 'react';
import styled, {css} from 'styled-components';
import List from './List';
import ListItem from './ListItem';
import Streak from './Streak';
import InlineFlex from './InlineFlex';

const Leaderboard = ({currentUser, isSelectingOpponent, leaderboard, selectOpponent}) => {

    const StyledList = styled(List)`
        box-shadow: ${isSelectingOpponent ? '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' : 'none'};
        cursor: ${isSelectingOpponent ? 'pointer' : 'initial'};
        margin: 0 auto;
        max-width: 320px;
    `

    return (
        <StyledList>
            {leaderboard.map(player => {
                const {fname, lname, streak} = player;

                return (
                    <ListItem
                        key={fname}
                        onClick={isSelectingOpponent && selectOpponent.bind(null, player)}
                    >
                        <span>{fname} {lname}</span>
                        <InlineFlex>
                            <Streak streak={streak} />
                        </InlineFlex>
                    </ListItem>
                )
            })}
        </StyledList>
    );
}

export default Leaderboard;
