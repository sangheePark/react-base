import * as React from "react";
import Animater from "./animates";
import "./style.css";

interface Props {
  refresh: () => Promise<unknown>;
  threshold?: number;
  onStateChange?: (status: string | null, option?: any) => void;
}

class PullToRefresh extends React.Component<Props, any> {
  rootRef: any;
  iconRef: any;
  refresh: () => Promise<unknown>;

  constructor(props: any) {
    super(props);
    this.state = {};
    this.refresh = props.refresh;
  }

  scrollHanders = (() => {
    let distance: number | null, offset: number | null, state: string | null; // state: pulling, aborting, reached, refreshing, restoring
    let touchId: number, startX: number, startY: number;
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    let deltaX: number, deltaY: number;
    let startPosition: number;

    const {
      threshold = 150,
      onStateChange = (status: string | null, option?: any) => {},
    } = this.props;
    const addClass = (cls: any) => {
      (this.rootRef as HTMLDivElement).classList.add("pull-to-refresh--" + cls);
    };

    const removeClass = (cls: any) => {
      (this.rootRef as HTMLDivElement).classList.remove(
        "pull-to-refresh--" + cls,
      );
    };

    const scrollTop = () => {
      // return document.body.scrollTop
      // document.body
      return document.body.getBoundingClientRect().top;
    };

    const calcMovement = (e: TouchEvent) => {
      const touch = Array.prototype.slice
        .call(e.changedTouches)
        .filter((touch) => touch.identifier === touchId)[0];
      if (!touch) return false;
      deltaX = touch.screenX - startX;
      deltaY = touch.screenY - startY;
      return true;
    };

    const onpanmove = (e: TouchEvent) => {
      let d = deltaY;
      if (
        scrollTop() > 0 ||
        (d < 0 && !state) ||
        state === "aborting" ||
        state === "refreshing" ||
        state === "restoring"
      )
        return;

      if (e.cancelable) {
        e.preventDefault();
      }

      if (distance == null) {
        offset = d;
        state = "pulling";
        addClass(state);
        onStateChange(state);
      }

      d = d - (offset || 0);
      if (d < 0) d = 0;
      distance = d;

      if (
        (d >= threshold && state !== "reached") ||
        (d < threshold && state !== "pulling")
      ) {
        removeClass(state);
        state = state === "reached" ? "pulling" : "reached";
        addClass(state);
        onStateChange(state);
      }

      Animater.pulling(d, {
        el: this.iconRef as HTMLDivElement,
        threshold: threshold,
      });
    };

    const onpanend = () => {
      if (state == null) return;
      if (state === "pulling") {
        removeClass(state);
        state = "aborting";
        onStateChange(state);
        addClass(state);
        Animater.aborting({
          el: this.iconRef as HTMLDivElement,
        }).then(() => {
          removeClass(state);
          distance = state = offset = null;
          onStateChange(state);
        });
      } else if (state === "reached") {
        removeClass(state);
        state = "refreshing";
        addClass(state);
        onStateChange(state);
        Animater.refreshing({
          el: this.iconRef as HTMLDivElement,
          threshold,
        });

        this.refresh().then(() => {
          removeClass(state);
          state = "restoring";
          addClass(state);
          onStateChange(state);

          Animater.restoring({
            el: this.iconRef as HTMLDivElement,
          }).then(() => {
            removeClass(state);
            distance = state = offset = null;
            onStateChange(state);
          });
        });
      }
    };

    return {
      touchstart: (e: TouchEvent) => {
        const touch = e.changedTouches[0];
        touchId = touch.identifier;
        startX = touch.screenX;
        startY = touch.screenY;
        startPosition = scrollTop();
        console.log("startPosition: " + startPosition);
      },
      touchmove: (e: TouchEvent) => {
        if (startPosition > -150 && calcMovement(e)) {
          console.log("touchmove: " + startPosition);
          onpanmove(e);
        }
      },
      touchend: (e: TouchEvent) => {
        if (calcMovement(e)) onpanend();
      },
      touchcancel: (e: TouchEvent) => {
        if (calcMovement(e)) onpanend();
      },
    };
  })();

  componentDidMount() {
    document.body.addEventListener("touchstart", this.scrollHanders.touchstart);
    document.body.addEventListener("touchmove", this.scrollHanders.touchmove);
    document.body.addEventListener("touchend", this.scrollHanders.touchend);
    document.body.addEventListener(
      "touchcancel",
      this.scrollHanders.touchcancel,
    );
  }

  componentWillUnmount() {
    document.body.removeEventListener(
      "touchstart",
      this.scrollHanders.touchstart,
    );
    document.body.removeEventListener(
      "touchmove",
      this.scrollHanders.touchmove,
    );
    document.body.removeEventListener("touchend", this.scrollHanders.touchend);
    document.body.removeEventListener(
      "touchcancel",
      this.scrollHanders.touchcancel,
    );
  }

  componentDidUpdate() {
    /*
      The refresh function need to be updated from the props
      to able to keep the filter data when re-new content
    */
    this.refresh = this.props.refresh;

    // this.props.select(this.state.selectedValue, this.itemHeight, this.scrollToWithoutAnimation)
  }

  render() {
    return (
      <div
        className="container pull-to-refresh-material"
        ref={(el) => (this.rootRef = el)}
      >
        <div
          className="pull-to-refresh-material__control"
          ref={(el) => (this.iconRef = el)}
        >
          <svg
            className="pull-to-refresh-material__icon"
            fill="#860000"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>

          <svg
            className="pull-to-refresh-material__spinner"
            width="24"
            height="24"
            viewBox="25 25 50 50"
          >
            <circle
              className="pull-to-refresh-material__path"
              cx="50"
              cy="50"
              r="20"
              fill="none"
              stroke="#860000"
              strokeWidth="4"
              strokeMiterlimit="10"
            />
          </svg>
        </div>
      </div>
    );
  }
}
export default PullToRefresh;
