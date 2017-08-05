import styled, {css} from 'styled-components';

const Button = styled.a`
    align-items: center;
    color: #222;
    cursor: pointer;
    display: inline-flex;
    padding: 8px;
    border-radius: 3px;
	width: 11rem;
	background: transparent;
    border: 2px solid #222;
    justify-content: space-around;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);

    &:hover {
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    }

    &:active {
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    }
`

export default Button;
