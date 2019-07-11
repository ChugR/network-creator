import React from "react";
import { Button, TextInput } from "@patternfly/react-core";
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant
} from "@patternfly/react-table";
import EdgeTableToolbar from "./edge-table-toolbar";
import EdgeTablePagination from "./edge-table-pagination";
import EmptyEdgeClassTable from "./empty-edge-class-table";

class EdgeTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{ title: "Name", cellFormatters: [this.formatName] }],
      filterText: "",
      sortDown: true,
      editingEdgeRow: -1
    };
  }

  onSelect = (event, isSelected, rowId) => {
    // the internal rows array may be different from the props.rows array
    const realRowIndex =
      rowId >= 0
        ? this.props.rows.findIndex(r => r.key === this.rows[rowId].key)
        : rowId;
    this.props.handleSelectEdgeRow(realRowIndex, isSelected);
  };

  handleEdgeNameBlur = () => {
    this.onSelect("", false, -1);
    this.setState({ editingEdgeRow: -1 });
  };

  handleEdgeNameClick = rowIndex => {
    this.onSelect("", true, rowIndex);
    this.setState({ editingEdgeRow: rowIndex, filterText: "" });
  };

  handleEdgeKeyPress = event => {
    if (event.key === "Enter") {
      this.handleEdgeNameBlur();
    }
  };

  formatName = (value, _xtraInfo) => {
    const realRowIndex = this.props.rows.findIndex(
      r => r.key === _xtraInfo.rowData.key
    );
    if (this.state.editingEdgeRow === _xtraInfo.rowIndex) {
      // the internal rows array may be different from the props.rows array
      return (
        <TextInput
          value={this.props.rows[realRowIndex].cells[0]}
          type="text"
          autoFocus
          onChange={val => this.props.handleEdgeNameChange(val, realRowIndex)}
          onBlur={this.handleEdgeNameBlur}
          onKeyPress={this.handleEdgeKeyPress}
          aria-label="text input example"
        />
      );
    }
    return (
      <Button
        variant="link"
        isInline
        onClick={() => this.handleEdgeNameClick(_xtraInfo.rowIndex)}
      >
        {this.rows[_xtraInfo.rowIndex].cells[0]}
      </Button>
    );
  };

  onSelect = (event, isSelected, rowId) => {
    console.log(`onSelect rowId is ${rowId}`);
    // the internal rows array may be different from the props.rows array
    const realRowIndex =
      rowId >= 0
        ? this.props.rows.findIndex(r => r.key === this.rows[rowId].key)
        : rowId;
    this.props.handleSelectEdgeRow(realRowIndex, isSelected);
  };

  toggleAlphaSort = () => {
    this.setState({ sortDown: !this.state.sortDown });
  };

  genTable = () => {
    console.log("regenning table");
    console.log(this.props.rows);
    const { columns, filterText } = this.state;
    if (this.props.rows.length > 0) {
      this.rows = this.props.rows.map(r => ({
        cells: [r.cells[0]],
        selected: r.selected,
        key: r.key
      }));
      // sort the rows
      this.rows = this.rows.sort((a, b) =>
        a.cells[0] < b.cells[0] ? -1 : a.cells[0] > b.cells[0] ? 1 : 0
      );
      if (!this.state.sortDown) {
        this.rows = this.rows.reverse();
      }
      // filter the rows
      if (filterText !== "") {
        this.rows = this.rows.filter(r => r.cells[0].indexOf(filterText) >= 0);
      }
      // only show to 5
      this.rows = this.rows.slice(0, 5);
      console.log(this.rows);
      return (
        <React.Fragment>
          <Table
            variant={TableVariant.compact}
            onSelect={this.onSelect}
            cells={columns}
            rows={this.rows}
          >
            <TableHeader />
            <TableBody />
          </Table>
        </React.Fragment>
      );
    }
    return <EmptyEdgeClassTable handleAddEdge={this.props.handleAddEdge} />;
  };

  handleChangeFilter = filterText => {
    this.setState({ filterText });
  };

  genToolbar = () => {
    if (this.props.rows.length > 0) {
      return (
        <React.Fragment>
          <label>Edge routers</label>
          <EdgeTableToolbar
            handleAddEdge={this.props.handleAddEdge}
            handleDeleteEdge={this.props.handleDeleteEdge}
            handleChangeFilter={this.handleChangeFilter}
            toggleAlphaSort={this.toggleAlphaSort}
            filterText={this.state.filterText}
            sortDown={this.state.sortDown}
            rows={this.props.rows}
          />
        </React.Fragment>
      );
    }
  };

  genPagination = () => {
    if (this.props.rows.length > 0) {
      return <EdgeTablePagination />;
    }
  };
  render() {
    return (
      <React.Fragment>
        {this.genToolbar()}
        {this.genTable()}
        {this.genPagination()}
      </React.Fragment>
    );
  }
}

export default EdgeTable;
