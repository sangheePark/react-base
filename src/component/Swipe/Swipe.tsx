import React, { useCallback, useEffect, useRef, useState } from "react";

interface IProps {
  className?: string;
  onLeft?: () => void;
  onRight?: () => void;
  onDown?: () => void;
  weight?: number;
}

const SwipeCatcher: React.FC<IProps> = ({
  className = "",
  children,
  onLeft = () => {},
  onRight = () => {},
  onDown = () => {},
  weight = 50,
}): React.ReactElement => {
  const [startX, setStartX] = useState<number>();
  const [startY, setStartY] = useState<number>();
  const [diffX, setDiffX] = useState<number>();
  const [diffY, setDiffY] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      const { current } = containerRef;
      // current.addEventListener(
      //   "touchstart",
      //    (evt: AWS) {
      //     this.xDown = evt.touches[0].clientX;
      //     this.yDown = evt.touches[0].clientY;
      //   }.bind(this),
      //   false,
      // );
    }
  }, []);
  const onTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (startX !== undefined && startY !== undefined) {
        const x = e.changedTouches[0].clientX;
        const y = e.changedTouches[0].clientY;
        console.log(`onTouch:startX=${startX}, startY=${startY}`);
        console.log(`onTouch:x=${x}, y=${y}`);
        if (!startX || !startY) {
          return;
        }

        const xDiff = startX - x;
        const yDiff = startY - y;
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
          // Most significant.
          console.log(`xDiff:${xDiff}`);
          if (xDiff > weight) {
            console.log(`left~!!!!!`);
            onLeft();
          } else if (xDiff < -weight) {
            console.log(`RIGHT~!!!!!`);
            onRight();
          }
        } else {
          console.log(`yDiff:${yDiff}`);
          if (yDiff > 0) {
            console.log(`UP~!!!!!`);
          } else {
            console.log(`DOWN~!!!!!`);
            -yDiff > weight && onDown();
          }
        }
        setStartX(undefined);
        setStartY(undefined);
      }
    },
    [startX, startY],
  );
  return (
    <div
      className={className}
      ref={containerRef}
      onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => {
        const x = e.touches[0].clientX;
        const y = e.touches[0].clientY;
        // console.log(`onTouch:x=${x}, y=${y}`);
        setStartX(x);
        setStartY(y);
      }}
      onTouchMove={(e: React.TouchEvent<HTMLDivElement>) => {
        const x = e.touches[0].clientX;
        const y = e.touches[0].clientY;

        // console.log(
        //   `e.currentTarget.clientWidth:${e.currentTarget.clientWidth}`,
        // );
        // console.log(`onTouch:x=${x}, y=${y}`);
        // setStartX(x);
        // setStartY(y);
      }}
      onTouchEnd={(e: React.TouchEvent<HTMLDivElement>) => {
        onTouchEnd(e);
      }}
    >
      {children}
    </div>
  );
};

export default SwipeCatcher;
