import styled from 'styled-components';

const ListItem = styled.li`
    align-items: center;
    color: white;
    display: flex;
    justify-content: space-between;
    list-style-type: none;
    margin: 0;
    padding: 16px;

    &:nth-child(even) {
        background: linear-gradient(0deg, rgba(255,255,255,0.2) 3.06%, rgba(255,255,255,0.2) 97.96%);
	}
`

export default ListItem;
