import React from "react";
import {
  Button,
  PageSection,
  PageSectionVariants,
  Split,
  SplitItem,
  Toolbar,
  ToolbarGroup,
  ToolbarItem
} from "@patternfly/react-core";

import {} from "@patternfly/react-core";

import Graph from "./graph";
import NetworkName from "./network-name";
import TopologyContext from "./topology-context";
import NodesLinks from "./nodeslinks";

class ChooseTopology extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      networkInfo: {
        name: "network name",
        nodes: [],
        links: []
      },
      dimensions: null,
      selectedKey: null
    };
    this.nodesLinks = new NodesLinks();
  }

  componentDidMount() {
    this.setState({
      dimensions: {
        width: this.container.offsetWidth,
        height: this.container.offsetHeight
      }
    });
  }

  handleNetworkNameChange = name => {
    const { networkInfo } = this.state;
    networkInfo.name = name;
    this.setState({ networkInfo });
  };

  handleAddInterior = () => {
    const { networkInfo, dimensions } = this.state;
    let { selectedKey } = this.state;
    const newNode = this.nodesLinks.addNode(
      "interior",
      networkInfo,
      dimensions
    );
    selectedKey = newNode.key;
    this.setState({ selectedKey, networkInfo });
  };

  handleAddEdgeClass = () => {
    const { networkInfo, dimensions } = this.state;
    let { selectedKey } = this.state;
    const newNode = this.nodesLinks.addNode(
      "edgeClass",
      networkInfo,
      dimensions
    );
    selectedKey = newNode.key;
    this.setState({ networkInfo, selectedKey });
  };

  handleAddEdge = () => {
    const { networkInfo, selectedKey } = this.state;
    const currentNode = networkInfo.nodes.find(n => n.key === selectedKey);
    if (currentNode && currentNode.type === "edgeClass") {
      currentNode.rows.push({
        cells: [this.nodesLinks.getEdgeName()],
        selected: false,
        key: `edgeKey-${this.nodesLinks.getEdgeKey()}`
      });
    }
    this.setState({ networkInfo });
  };

  handleDeleteEdge = () => {
    const { networkInfo, selectedKey } = this.state;
    const currentNode = networkInfo.nodes.find(n => n.key === selectedKey);
    if (currentNode && currentNode.type === "edgeClass") {
      currentNode.rows = currentNode.rows.filter(r => !r.selected);
    }
    this.setState({ networkInfo });
  };

  handleEdgeNameChange = (value, rowIndex) => {
    const { networkInfo, selectedKey } = this.state;
    const currentNode = networkInfo.nodes.find(n => n.key === selectedKey);
    if (currentNode && currentNode.type === "edgeClass") {
      currentNode.rows[rowIndex].cells[0] = value;
    }
    this.setState({ networkInfo });
  };

  handleSelectEdgeRow = (rowId, isSelected) => {
    const { networkInfo, selectedKey } = this.state;
    const currentNode = networkInfo.nodes.find(n => n.key === selectedKey);
    if (currentNode && currentNode.type === "edgeClass") {
      // set all row's selected to isSelected
      if (rowId === -1) {
        currentNode.rows = currentNode.rows.map(r => ({
          cells: r.cells,
          selected: isSelected,
          key: r.key
        }));
      } else {
        currentNode.rows[rowId].selected = isSelected;
      }
    }
    this.setState({ networkInfo });
  };

  handleEditField = (newVal, fieldName, key) => {
    const { networkInfo } = this.state;
    const currentNode = networkInfo.nodes.find(n => n.key === key);
    if (currentNode) {
      currentNode[fieldName] = newVal;
      this.setState({ networkInfo });
    }
  };

  handleDeleteRouter = () => {
    const { networkInfo } = this.state;
    let { selectedKey } = this.state;
    const nodeIndex = networkInfo.nodes.findIndex(n => n.key === selectedKey);
    if (nodeIndex >= 0) {
      // remove all links
      let linkIndex = this.nodesLinks.linkIndex(networkInfo.links, nodeIndex);
      while (linkIndex >= 0) {
        networkInfo.links.splice(linkIndex, 1);
        linkIndex = this.nodesLinks.linkIndex(networkInfo.links, nodeIndex);
      }
      // if this routers was selected, unselect it
      if (networkInfo.nodes[nodeIndex].key === selectedKey) {
        selectedKey = null;
      }
      // remove the router
      networkInfo.nodes.splice(nodeIndex, 1);
      this.setState({ networkInfo, selectedKey });
    }
  };

  handleRadioChange = (o, title) => {
    const { networkInfo, selectedKey } = this.state;
    const currentNode = networkInfo.nodes.find(n => n.key === selectedKey);
    if (currentNode) {
      currentNode[title] = o;
    }
    this.setState({ networkInfo });
  };

  handleDeleteConnection = () => {
    const { networkInfo, selectedKey } = this.state;
    const currentLinkIndex = networkInfo.links.findIndex(
      l => l.key === selectedKey
    );
    if (currentLinkIndex >= 0) {
      networkInfo.links.splice(currentLinkIndex, 1);
    }
    this.setState({ networkInfo });
  };

  handleReverseConnection = () => {
    const { networkInfo } = this.state;
    let { selectedKey } = this.state;
    const currentLink = networkInfo.links.find(l => l.key === selectedKey);
    const to = currentLink.target.key;
    const from = currentLink.source.key;

    this.handleDeleteConnection();
    const newLink = this.notifyCreateLink(to, from);
    selectedKey = newLink.key;
    this.setState({ selectedKey });
  };

  updateNodesLinks = networkInfo => {
    const { nodes, links } = this.nodesLinks.setNodesLinks(
      networkInfo,
      this.state.dimensions
    );
    networkInfo.nodes = nodes;
    networkInfo.links = links;
  };

  onToggle = isOpen => {
    this.setState({
      isOpen
    });
  };

  onSelect = event => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  notifyCurrentRouter = selectedKey => {
    this.setState({ selectedKey });
  };

  notifyCurrentConnector = d => {
    const selectedKey = d.key;
    this.setState({ selectedKey });
  };

  notifyCreateLink = (to, from) => {
    const { networkInfo } = this.state;
    let toIndex = networkInfo.nodes.findIndex(n => n.key === to);
    let fromIndex = networkInfo.nodes.findIndex(n => n.key === from);
    if (toIndex >= 0 && fromIndex >= 0) {
      if (
        networkInfo.nodes[toIndex].type === "edgeClass" &&
        networkInfo.nodes[fromIndex].type === "interior"
      ) {
        const tmp = toIndex;
        toIndex = fromIndex;
        fromIndex = tmp;
      }
      if (networkInfo.nodes[toIndex].type === "interior") {
        const newLink = this.nodesLinks.addLink(
          fromIndex,
          toIndex,
          networkInfo.links,
          networkInfo.nodes
        );
        this.setState({ networkInfo });
        return newLink;
      }
    }
  };

  render() {
    return (
      <React.Fragment>
        <PageSection variant={PageSectionVariants.light}>
          <NetworkName
            handleNetworkNameChange={this.handleNetworkNameChange}
            networkInfo={this.state.networkInfo}
          />
        </PageSection>
        <PageSection variant={PageSectionVariants.light}>
          <Toolbar className="pf-l-toolbar pf-u-justify-content-space-between pf-u-mx-xl pf-u-my-md network-toolbar">
            <ToolbarGroup>
              <ToolbarItem className="pf-u-mx-md">
                <Button
                  aria-label="add interior router"
                  onClick={this.handleAddInterior}
                  variant="tertiary"
                >
                  Add Cluster
                </Button>
              </ToolbarItem>
              <ToolbarItem className="pf-u-mx-md">
                <Button
                  aria-label="add edge class"
                  variant="tertiary"
                  onClick={this.handleAddEdgeClass}
                >
                  Add Edge class
                </Button>
              </ToolbarItem>
            </ToolbarGroup>
          </Toolbar>
        </PageSection>
        <PageSection variant={PageSectionVariants.light}>
          <Split gutter="md">
            <SplitItem isFilled>
              <div className="force-graph" ref={el => (this.container = el)}>
                {this.state.dimensions && (
                  <Graph
                    nodes={this.state.networkInfo.nodes}
                    links={this.state.networkInfo.links}
                    dimensions={this.state.dimensions}
                    notifyCurrentRouter={this.notifyCurrentRouter}
                    notifyCurrentConnector={this.notifyCurrentConnector}
                    notifyCreateLink={this.notifyCreateLink}
                    selectedKey={this.state.selectedKey}
                  />
                )}
              </div>
            </SplitItem>
            <SplitItem className="context-form">
              <TopologyContext
                selectedKey={this.state.selectedKey}
                networkInfo={this.state.networkInfo}
                handleEditField={this.handleEditField}
                handleDeleteRouter={this.handleDeleteRouter}
                handleAddEdge={this.handleAddEdge}
                handleDeleteEdge={this.handleDeleteEdge}
                handleEdgeNameChange={this.handleEdgeNameChange}
                handleSelectEdgeRow={this.handleSelectEdgeRow}
                handleRadioChange={this.handleRadioChange}
                handleDeleteConnection={this.handleDeleteConnection}
                handleReverseConnection={this.handleReverseConnection}
              />
            </SplitItem>
          </Split>
        </PageSection>
      </React.Fragment>
    );
  }
}

export default ChooseTopology;
