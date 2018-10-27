// @flow
import * as React from 'react';
import { normalize } from 'polished';
import styled, { createGlobalStyle } from 'styled-components';
import Ball from './Ball';

const BodyStyles = createGlobalStyle`
body {
    margin: 0px;
    background-color: #000;
}
${normalize()}`;

export default class Bounce extends React.Component {
  state = { ballCount: 1 };
  ref: React.ElementRef<'div'> | null = null;

  onRef = ref => {
    const { clientWidth, clientHeight } = ref;
    this.setState({ width: clientWidth, height: clientHeight });
  };

  addBall = () => {
    this.setState({ ballCount: this.state.ballCount + 1 });
  };

  render() {
    const {
      addBall,
      onRef,
      state: { ballCount },
    } = this;
    return (
      <Background onClick={addBall} ref={onRef}>
        <BodyStyles />
        {[...Array(ballCount)].map((_, idx) => (
          <Ball key={idx} />
        ))}
      </Background>
    );
  }
}

const Background = styled.div`
  width: 100%;
  height: 100%;
  background: #000;
`;
