import React, { useState, useRef } from "react";
import styled from "styled-components";

interface MagnifyImageProps {
  src: string;
  alt: string;
  width: string;
  height: string;
  magnifierHeight?: number;
  magnifieWidth?: number;
  zoomLevel?: number;
}

interface ImageWrapperProps {
  width: string;
  height: string;
}

const ImageWrapper = styled.div<ImageWrapperProps>`
  position: relative;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Magnifier = styled.div`
  position: absolute;
  pointer-events: none;
  opacity: 0;
  transform: scale(0);
  transition: opacity 0.3s, transform 0.3s;
  border: 1px solid #ccc;
  border-radius: 50%;
  overflow: hidden;

  ${ImageWrapper}:hover & {
    opacity: 1;
    transform: scale(1);
  }
`;

const MagnifyImage: React.FC<MagnifyImageProps> = ({
  src,
  alt,
  width,
  height,
  magnifierHeight = 100,
  magnifieWidth = 100,
  zoomLevel = 2.5,
}) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseEnter = () => {
    const elem = imageRef.current;
    const { width, height } = elem?.getBoundingClientRect() || {};
    setSize([width || 0, height || 0]);
    setShowMagnifier(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const elem = imageRef.current;
    const { top, left } = elem?.getBoundingClientRect() || {};
    const x = e.pageX - (left || 0) - window.pageXOffset;
    const y = e.pageY - (top || 0) - window.pageYOffset;
    setXY([x, y]);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  return (
    <ImageWrapper
      width={width}
      height={height}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Image ref={imageRef} src={src} alt={alt} />
      <Magnifier
        style={{
          display: showMagnifier ? "" : "none",
          height: `${magnifierHeight}px`,
          width: `${magnifieWidth}px`,
          top: `${y - magnifierHeight / 2}px`,
          left: `${x - magnifieWidth / 2}px`,
          backgroundImage: `url('${src}')`,
          backgroundSize: `${imgWidth * zoomLevel}px ${
            imgHeight * zoomLevel
          }px`,
          backgroundPositionX: `${-x * zoomLevel + magnifieWidth / 2}px`,
          backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
        }}
      />
    </ImageWrapper>
  );
};

export default MagnifyImage;
