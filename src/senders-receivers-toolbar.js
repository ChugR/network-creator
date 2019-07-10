import React from 'react';
import { Toolbar, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';

import AddAddress from './add-address';

class SendersReceiversToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = fields => {
    this.props.handleSubmit(fields);
  };

  render() {
    return (
      <Toolbar className="pf-l-toolbar pf-u-justify-content-space-between pf-u-mx-xl pf-u-my-md">
        <ToolbarGroup>
          <ToolbarItem className="pf-u-mr-xl">
            <AddAddress
              handleSubmit={this.handleSubmit}
              handleCancel={this.props.handleCancel}
              client="senders"
              currentRouterInfo={this.props.currentRouterInfo}
              edit={this.props.edit.client === 'senders'}
              whichEdit={this.props.edit}
            />
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem className="pf-u-mx-md">
            <AddAddress
              handleSubmit={this.handleSubmit}
              handleCancel={this.props.handleCancel}
              client="receivers"
              currentRouterInfo={this.props.currentRouterInfo}
              edit={this.props.edit.client === 'receivers'}
              whichEdit={this.props.edit}
            />
          </ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

export default SendersReceiversToolbar;
