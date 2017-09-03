import styled from 'styled-components';

const ContentWrap = styled.div`
    margin: 0 auto;
    max-width: 375px;
    padding: 0 16px;

    ${props => props.flex && `
        align-items: center;
        display: flex;
        height: 100%;
        justify-items: space-between;
	`}
`

export default ContentWrap;
