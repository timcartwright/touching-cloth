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
		background: #444;
	}
`

export default ListItem;
