import React from 'react';
import { Table, TableHeader, TableBody, TableVariant } from '@patternfly/react-table';
import { TextContent, Text } from '@patternfly/react-core';

import SendersReceiversToolbar from './senders-receivers-toolbar';

class SendersReceivers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{ title: 'Address' }, { title: 'Senders' }, { title: 'Receivers' }]
    };
  }

  actionResolver = () => [
    {
      title: 'Edit',
      onClick: (event, rowId, rowData, extra) => {
        this.props.handleEdit(rowData);
      }
    },
    {
      title: 'Delete',
      onClick: (event, rowId, rowData, extra) => {
        this.props.handleDeleteRow(rowData);
      }
    }
  ];

  render() {
    const { columns } = this.state;

    const emptyTable = () => {
      if (this.props.rows.length === 0) {
        return (
          <TextContent className="no-addresses">
            <Text component="p">No addresses defined</Text>
          </TextContent>
        );
      }
    };
    const showTable = () => {
      if (this.props.currentRouter) {
        return (
          <React.Fragment>
            <SendersReceiversToolbar
              handleSubmit={this.props.handleSubmit}
              handleCancel={this.props.handleCancel}
              currentRouterInfo={this.props.currentRouterInfo}
              edit={this.props.edit}
            />
            <Table
              variant={TableVariant.compact}
              cells={columns}
              rows={this.props.rows}
              actionResolver={this.actionResolver}
            >
              <TableHeader />
              <TableBody />
            </Table>
            {emptyTable()}
          </React.Fragment>
        );
      }
      return (
        <TextContent>
          <Text component="h1">No router chosen. Click on a router.</Text>
        </TextContent>
      );
    };
    return (
      <div className="address-table-container">
        <TextContent>
          <Text component="h1">
            Senders/receivers for router
            <br />
            {this.props.currentRouter ? this.props.currentRouter : ''}
          </Text>
        </TextContent>
        {showTable()}
      </div>
    );
  }
}

export default SendersReceivers;
