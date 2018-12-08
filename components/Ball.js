// @flow
import * as React from 'react';
import styled from 'styled-components';

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

type StateType = {
  drawing: boolean,
  top: number,
  left: number,
  height: number,
  width: number,
  vDirection: number,
  hDirection: number,
  stream?: MediaStreamTrack,
};
type PropsType = {};

export default class Bounce extends React.Component<PropsType, StateType> {
  state = {
    drawing: true,
    top: 0,
    left: 0,
    height: 0,
    width: 0,
    vDirection: Math.random() * 5,
    hDirection: Math.random() * 5,
  };
  ref: React.ElementRef<'canvas'> | null = null;
  videoStreams: MediaStreamTrack[] = [];
  video: React.ElementRef<'video'> | null = null;

  componentDidMount = async () => {
    if (navigator && navigator.mediaDevices) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { min: 200 }, height: { min: 200 } },
        audio: false,
      });
      this.videoStreams = stream;
      if (this.video) {
        this.video.srcObject = stream;
      }
      this.setState({ stream: stream.getVideoTracks()[0] }, () => this.draw());
    } else {
      throw new Error('Could not get webcam');
    }
  };

  onCanvas = (canvas: ?React.ElementRef<'canvas'>) => {
    if (canvas) {
      this.ref = canvas;
      this.draw();
    }
  };

  onVideo = (video: ?React.ElementRef<'video'>) => {
    if (!video) {
      return;
    }

    this.video = video;
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
    let { vDirection, hDirection, top, left } = this.state;
    const pageHeight = window.innerHeight;
    const pageWidth = window.innerWidth;

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
