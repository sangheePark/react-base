import { map } from "lodash";
import React from "react";
const d3 = require("d3");
// import * as d3 from "d3";

interface Props {
  data: Array<any>;
  width: number;
  height: number;
  useLabels: boolean;
}

interface State {
  data: Array<any>;
  minValue: number;
  maxValue: number;
  mounted: boolean;
}

type itemObj = {
  value: number;
  x: number;
  y: number;
  label: string;
  name: string;
  newYn?: string;
  rnkVrtnValue?: number;
};

//TODO  typescript 버전으로 import 및 사이즈 고정 문제 해결 필요
class BubbleChart extends React.Component<Props, State> {
  simulation: any;
  static defaultProps = {
    data: [],
    useLabels: false,
    width: 390,
    height: 350,
  };

  constructor(props: any) {
    super(props);

    this.state = {
      data: [],
      minValue: 1,
      maxValue: 100,
      mounted: false,
    };

    this.radiusScale = this.radiusScale.bind(this);
    this.simulatePositions = this.simulatePositions.bind(this);
    this.renderBubbles = this.renderBubbles.bind(this);
  }

  componentWillMount() {
    console.log("componentWillMount");
    if (this.props.data.length > 0) {
      this.setState({
        minValue:
          0.95 *
          d3.min(this.props.data, (item: any) => {
            return item.value;
          }),
        maxValue:
          1.05 *
          d3.max(this.props.data, (item: any) => {
            return item.value;
          }),
      });
      this.simulatePositions(this.props.data);
    }
  }

  componentDidMount() {
    console.log("componentDidMount");

    this.setState({
      mounted: true,
    });
  }

  componentWillReceiveProps(nextProps: any) {
    console.log("componentWillReceiveProps");
    // if (
    //   Object.entries(this.state.data).toString() !==
    //   Object.entries(nextProps.data).toString()
    // ) {
    //   console.log(`this.props.data:` + JSON.stringify(this.props.data));
    //   console.log(`nextProps:` + JSON.stringify(nextProps.data));
    if (nextProps.data.length > 0) {
      this.setState({
        minValue:
          0.95 *
          d3.min(nextProps.data, (item: any) => {
            return item.value;
          }),
        maxValue:
          1.05 *
          d3.max(nextProps.data, (item: any) => {
            return item.value;
          }),
      });
      this.simulatePositions(nextProps.data);
    }
    // }
  }

  // shouldComponentUpdate(nextProps: any, nextState: any) {
  //   console.log("shouldComponentUpdate");
  //   return (
  //     Object.entries(nextProps).toString() !==
  //     Object.entries(this.props).toString()
  //   );
  // }

  // componentWillUpdate(nextProps: any, nextState: any) {
  //   console.log("componentWillUpdate");
  // }

  componentDidUpdate(prevProps: any, prevState: any) {
    console.log("componentDidUpdate");
  }

  componentWillUnmount() {
    this.setState({
      mounted: false,
    });
  }

  radiusScale = (value: any) => {
    const fx = d3
      .scaleSqrt()
      .range([40, 80])
      .domain([this.state.minValue, this.state.maxValue]);

    return fx(value);
  };

  simulatePositions = (data: any) => {
    this.simulation = d3
      .forceSimulation()
      .nodes(data)
      // .velocityDecay(0.5)
      .force("x", d3.forceX().strength(0.01))
      .force("y", d3.forceY().strength(0.01))
      .force(
        "collide",
        d3.forceCollide((d: any) => {
          return this.radiusScale(d.value) + 2;
        }),
      )
      .tick(300)
      .on("tick", () => {
        if (this.state.mounted) {
          this.setState({ data });
        }
      });
    // .stop();
  };

  renderBubbles = (data: any) => {
    const minValue =
      0.95 *
      d3.min(data, (item: any) => {
        return item.value;
      });

    const maxValue =
      1.05 *
      d3.max(data, (item: any) => {
        return item.value;
      });

    const color = d3
      .scaleOrdinal()
      .domain(data)
      .range(["#1a6874", "#7b8a8f", "#7eb1ad", "#ecb880", "#f0a08b"]);
    // const color = d3
    //   .scaleLinear()
    //   .domain([minValue, maxValue])
    //   .interpolate(d3.interpolateHcl)
    //   .range(["#1a6874", "#7b8a8f"]);
    // "#4647c6", "#7d7ed7", "#a2a3e2", "#b5b5e8", "#b5b5e8"

    // render simple circle element
    if (!this.props.useLabels) {
      const circles = map(data, (item: itemObj, index: number) => {
        return (
          <circle
            key={index}
            r={this.radiusScale(item.value)}
            cx={item.x}
            cy={item.y}
            fill={color(item.value)}
            // stroke={d3.rgb(color(item.v)).brighter(2)}
            // strokeWidth="2"
          />
        );
      });

      return (
        <g
          transform={`translate(${this.props.width / 2}, ${
            this.props.height / 2
          })`}
        >
          {circles}
        </g>
      );
    }

    // render circle and text elements inside a group
    const texts = map(data, (item: itemObj, index: any) => {
      const props = this.props;
      const fontSize =
        item.name.length < 10
          ? this.radiusScale(item.value) / 4
          : this.radiusScale(item.value) / 5;
      return (
        <g
          key={index}
          transform={`translate(${props.width / 2 + item.x}, ${
            props.height / 2 + item.y
          })`}
        >
          <circle
            r={this.radiusScale(item.value)}
            fill={color(item.value)}
            // stroke={d3.rgb(color(item.value)).brighter(2)}
            // strokeWidth="2"
          />
          <text
            dy="6"
            fill="#fff"
            textAnchor="middle"
            fontSize={`${fontSize}px`}
          >
            {item.name}
          </text>
          {/* <text
            dy="6"
            fill="#fff"
            textAnchor="middle"
            y={fontSize}
            fontSize={`${fontSize / 2}px`}
          >
            {item.value}일
          </text> */}

          {item.newYn === "Y" ? (
            <svg
              x="-10"
              y="12"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10ZM10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM10.8867 13.1875H12.25V7.5H10.8828V11.0391L8.87109 7.5H7.5V13.1875H8.87109V9.64844L10.8867 13.1875Z"
                fill="white"
              />
            </svg>
          ) : item.rnkVrtnValue && item.rnkVrtnValue > 0 ? (
            <>
              {/* arrow-up */}
              <svg
                x="-10"
                y="10"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.81888 4.21484L5.21927 8.81494H5.22903C5.0886 8.95564 5.0101 9.14643 5.01028 9.34521C5.01047 9.544 5.08931 9.73457 5.23001 9.875C5.37071 10.0154 5.5615 10.0944 5.76028 10.0942C5.95907 10.0941 6.14915 10.0147 6.28958 9.87402L9.614 6.5512V15.25C9.614 15.6642 9.94979 16 10.364 16C10.7782 16 11.114 15.6642 11.114 15.25V6.53207L14.4576 9.87402C14.598 10.0147 14.789 10.0941 14.9878 10.0942C15.1866 10.0944 15.3774 10.0154 15.5181 9.875C15.6588 9.73457 15.7376 9.544 15.7378 9.34521C15.738 9.14643 15.6595 8.95564 15.5191 8.81494L10.9195 4.21484C10.7716 4.07282 10.5737 3.99365 10.3687 3.99365C10.1636 3.99365 9.96676 4.07282 9.81888 4.21484Z"
                  fill="#F25454"
                />
              </svg>
            </>
          ) : (
            item.rnkVrtnValue &&
            item.rnkVrtnValue < 0 && (
              <>
                {/* arrow-down */}
                <svg
                  x="-10"
                  y="10"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.81888 15.7788L5.21927 11.1787H5.22903C5.0886 11.038 5.0101 10.8472 5.01028 10.6484C5.01047 10.4496 5.08931 10.2591 5.23001 10.1187C5.37071 9.97822 5.5615 9.89923 5.76028 9.89941C5.95907 9.8996 6.14915 9.97893 6.28958 10.1196L9.614 13.4425V4.74365C9.614 4.32944 9.94979 3.99365 10.364 3.99365C10.7782 3.99365 11.114 4.32944 11.114 4.74365V13.4616L14.4576 10.1196C14.598 9.97893 14.789 9.8996 14.9878 9.89941C15.1866 9.89923 15.3774 9.97822 15.5181 10.1187C15.6588 10.2591 15.7376 10.4496 15.7378 10.6484C15.738 10.8472 15.6595 11.038 15.5191 11.1787L10.9195 15.7788C10.7716 15.9208 10.5737 16 10.3687 16C10.1636 16 9.96676 15.9208 9.81888 15.7788Z"
                    fill="#37BFF1"
                  />
                </svg>
              </>
            )
          )}
        </g>
      );
    });

    return texts;
  };

  render() {
    if (this.state.data.length) {
      return (
        <svg width={this.props.width} height={this.props.height}>
          {this.renderBubbles(this.state.data)}
        </svg>
      );
    }

    return <div>Loading</div>;
  }
}

export default BubbleChart;
