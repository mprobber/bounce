// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';
import { normalize } from 'polished';
import styled, { createGlobalStyle } from 'styled-components';

const BodyStyles = createGlobalStyle`
body {
    margin: 0px;
    background-color: #000;
}
${normalize()}`;

const calculateSize = (src, dst) => {
  const srcRatio = src.width / src.height;
  const dstRatio = dst.width / dst.height;
  if (dstRatio > srcRatio) {
    return {
      width: dst.height * srcRatio,
      height: dst.height,
    };
  } else {
    return {
      width: dst.width,
      height: dst.width / srcRatio,
    };
  }
};

export default class Bounce extends React.Component {
  state = {
    drawing: true,
    top: 0,
    left: 0,
    vDirection: Math.random() * 5,
    hDirection: Math.random() * 5,
  };
  ref: React.ElementRef<'canvas'> | null = null;
  videoStreams: MediaStreamTrack[] = [];
  video: React.ElementRef<'video'> | null = null;

  componentDidMount = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { min: 200 }, height: { min: 200 } },
      audio: false,
    });
    this.videoStreams = stream;
    if (this.video) {
      this.video.srcObject = stream;
    }
    this.setState({ stream: stream.getVideoTracks()[0] }, () => this.draw());
  };

  onCanvas = (canvas: React.ElementRef<'canvas'>) => {
    this.ref = canvas;
    this.draw();
  };

  onVideo = video => {
    this.video = video;
    this.video.srcObject = this.stream;
    const { width, height } = calculateSize(
      { width: video.videoWidth, height: video.videoHeight },
      { width: 200, height: 200 },
    );
    this.setState({ width, height });
    this.draw();
  };

  draw = () => {
    const {
      ref,
      video,
      state: { drawing },
    } = this;

    if (!ref || !drawing) {
      return;
    }

    if (!video) {
      requestAnimationFrame(this.draw);
      return;
    }

    const ctx = ref.getContext('2d');

    ref.width = video.videoWidth;
    ref.height = video.videoHeight;

    if (
      this.state.width !== video.videoWidth ||
      this.state.height !== video.videoHeight
    ) {
      this.setState({ width: video.videoWidth, height: video.videoHeight });
    }
    ctx.drawImage(video, 0, 0);
    requestAnimationFrame(this.draw);
  };

  stop = () => {
    this.setState({ drawing: !this.state.drawing }, () => {
      requestAnimationFrame(this.move);
      requestAnimationFrame(this.draw);
    });
  };

  move = () => {
    const { height, width, drawing } = this.state;
    const pageHeight = window.innerHeight;
    const pageWidth = window.innerWidth;
    let { vDirection, hDirection, top, left } = this.state;

    if (drawing) {
      return;
    }

    if (!height || !width || !pageHeight || !pageWidth) {
      return;
    }

    if (top <= 0) {
      vDirection = Math.abs(vDirection);
    }
    if (left <= 0) {
      hDirection = Math.abs(hDirection);
    }
    if (top + 200 >= pageHeight) {
      vDirection = -Math.abs(vDirection);
    }
    if (left + 200 >= pageWidth) {
      hDirection = -Math.abs(hDirection);
    }

    top += vDirection;
    left += hDirection;

    this.setState({ top, left, vDirection, hDirection }, () =>
      requestAnimationFrame(this.move),
    );
  };

  render() {
    return (
      <React.Fragment>
        <Canvas
          onClick={this.stop}
          ref={this.onCanvas}
          style={{ top: this.state.top, left: this.state.left }}
        />
        <Video autoPlay ref={this.onVideo} />
      </React.Fragment>
    );
  }
}

const Canvas = styled.canvas`
  position: fixed;
  width: 200px;
  height: 200px;
  border-radius: 100%;
  background: #000;
`;

const Video = styled.video`
  display: none;
`;
