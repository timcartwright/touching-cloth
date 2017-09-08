import React from 'react';

const StreakResult = ({result}) => {
    const fill = result === 'W' ? '#A1F899' : '#EC4A4A';

    return (
        <svg height="10" width="10" style={{marginRight: '3px'}}>
            <circle
                cx="5"
                cy="5"
                r="5"
                fill={fill}
            />
        </svg>
    );
}

export default StreakResult;

