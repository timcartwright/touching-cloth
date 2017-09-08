import styled from 'styled-components';

const Section = styled.section`
    margin: 16px;
    text-align: center;

    ${props => props.intro && `
        border-bottom: 1px solid white;
        border-top: 1px solid white;
        margin: 16px auto;
        max-width: 375px;
		padding: 6px 0;
    `}
    
    ${props => props.currentPlayer && `
        margin: 16px auto;
        margin-bottom: 36px;
        max-width: 375px;
    `}
`

export default Section;
