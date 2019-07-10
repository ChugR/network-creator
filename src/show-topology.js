import React from "react";
import Graph from "./graph";

class ShowTopology extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dimensions: null
    };
  }

  // catch-22: We need to set the width,height of the svg when it is created,
  // but we don't want to use fixed numbers; we want the size to be determined
  // by the browser. However, we don't have the size until after the component is
  // rendered.
  // Solution: - Render the svg's container but not the svg.
  //           - Get the size of the container in componentDidMount()
  //           - Set the size as a state variable which will trigger a re-render
  //           - re-render the svg's container AND render the svg with the correct size
  componentDidMount() {
    this.setState({
      dimensions: {
        width: this.container.offsetWidth,
        height: this.container.offsetHeight
      }
    });
  }

  render() {
    let { dimensions } = this.state;
    console.log(
      `rendering show-topology with routers = ${this.props.networkInfo.routers}`
    );
    return (
      <div className="force-graph" ref={el => (this.container = el)}>
        {dimensions && (
          <Graph
            nodes={this.props.networkInfo.nodes}
            links={this.props.networkInfo.links}
            dimensions={dimensions}
            notifyCurrentRouter={() => {}}
          />
        )}
      </div>
    );
  }
}

export default ShowTopology;
