import React from 'react';
import styled from 'styled-components';
import StreakResult from './StreakResult';
import InlineFlex from './InlineFlex';


const Streak = ({streak}) => {
    const StyledStreakResult = styled(StreakResult)`
        margin-right: 4px;
    `

    return (
        <div>
            {streak.map((result, key) =>
                <StyledStreakResult
                    key={key}
                    result={result}
                />
            )}
        </div>
    );
}

export default Streak;
