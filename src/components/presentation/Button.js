import styled from 'styled-components';

const Button = styled.a`
    align-items: center;
    background-color: #FFFFFF;
    border-radius: 100px;
    box-shadow: 0 5px 10px 0 rgba(0,0,0,0.15);
    color: #00AEEF;
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
    height: 48px;
    display: inline-flex;
    justify-content: space-around;
    letter-spacing: 3px;
    line-height: 24px;
    max-width: 300px;
    opacity: .5;
    text-align: center;
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    width: 100%;

    &:hover {
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    }

    &:active {
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    }
`

export default Button;
