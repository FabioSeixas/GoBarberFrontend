import { shade } from 'polished';
import styled, { keyframes } from 'styled-components';

export const Container = styled.div``;

export const Header = styled.header`
  padding: 60px 0;
  background-color: #28262e;
  display: flex;
  justify-content: center;
  position: relative;

  a {
    position: absolute;
    top: 50px;
    left: 100px;
    color: #999591;
    transition: color 0.2s;

    svg {
      height: 20px;
      width: 20px;

      &:hover {
        color: ${shade(0.2, '#999591')};
      }
    }
  }

  div {
    position: absolute;
    top: 30px;

    img {
      width: 186px;
      border-radius: 50%;
    }

    label {
      display: flex;
      flex-direction: column;

      position: absolute;
      border: 0;
      width: 48px;
      height: 48px;
      right: 0;
      bottom: 0;
      border-radius: 50%;
      background-color: #ff9000;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background: ${shade(0.2, '#ff9000')};
      }

      input {
        display: none;
      }

      svg {
        flex: 1;
        margin: 0 auto;
        width: 18px;
        height: 18px;
        color: #232129;
      }
    }
  }
`;

export const Content = styled.div`
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
`;

const appearFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(+50px);
  }
  to {
    opacity: 1;
    transform: translateX(0px);
  }
`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation: ${appearFromRight} 1s;

  form {
    margin: 40px 0 40px 0;
    width: 340px;
    text-align: center;

    h2 {
      font-size: 20px;
      margin-bottom: 20px;
      text-align: left;
    }

    input[name='old_password'] {
      margin-top: 100px;
    }
  }
`;
