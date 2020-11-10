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

    svg {
      height: 20px;
      width: 20px;
    }
  }

  div {
    position: absolute;
    top: 30px;

    img {
      width: 186px;
      border-radius: 50%;
    }

    div {
      top: 140px;
      right: 10px;
      border: 10px solid #ff9000;
      border-radius: 50%;
      background-color: #ff9000;

      button {
        background-color: #ff9000;
        border: 0;
        display: flex;
        align-items: center;
        width: 22px;
        height: 22px;

        svg {
          flex: 1;
          width: 18px;
          height: 18px;
          color: #232129;
          background-color: #ff9000;
        }
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
