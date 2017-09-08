import React from 'react';
import InlineFlex from '../presentation/InlineFlex';


const Avatar = ({player}) => {
    const imgStyle = {
        border: '2px solid white',
        borderRadius: '50%',
        height: '48px',
        margin: '10px',
        width: '48px',
    };

    return (
        <InlineFlex>
           <img style={imgStyle} src={player.avatar} alt='' />
        </InlineFlex>
    );
}

export default Avatar;
