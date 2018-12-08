// @flow
import * as React from 'react';
import { normalize } from 'polished';
import styled, { createGlobalStyle } from 'styled-components';
import { Helmet } from 'react-helmet';
import Ball from './Ball';

const BodyStyles = createGlobalStyle`
body {
    margin: 0px;
    height: 100vh;
    background-color: #000;
}
${normalize()}`;

type StateType = { ballCount: number, height: number, width: number };
export default class Bounce extends React.Component<{}, StateType> {
  state = { ballCount: 1, height: 0, width: 0 };
  ref: React.ElementRef<'div'> | null = null;

  onRef = (ref: ?React.ElementRef<'div'>) => {
    if (!ref) {
      return;
    }
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
        <Helmet>
          <title>BOUNCE</title>
        </Helmet>
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
