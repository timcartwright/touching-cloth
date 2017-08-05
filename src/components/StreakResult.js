import React from 'react';

const StreakResult = ({result}) => {
    const fill = result === 'W' ? 'green' : 'red';

    return (
        <svg height="12" width="12" style={{marginRight: '2px'}}>
            <circle
                cx="6"
                cy="6"
                r="6"
                fill={fill}
            />
        </svg>
    );
}

export default StreakResult;

