import React from 'react';

const WinRatio = ({results}) => {
    if (!results.length) {
        return <span>-</span>;
    }
    
    const numberOfWins = results.filter(result => result === 'W').length;
    const winRatio = numberOfWins / results.length;
    const winPercentage = Math.round(winRatio * 100);

    return (
        <span>
            {winPercentage}%
        </span>
    );
}

export default WinRatio;
