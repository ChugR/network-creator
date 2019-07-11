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
      editingEdgeRow: -1,
      page: 1,
      perPage: 5
    };

    this.rows = [];
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
    console.log("blur of edgename");
    this.onSelect("", false, -1);
    this.setState({ editingEdgeRow: -1 });
  };

  handleEdgeNameClick = rowIndex => {
    console.log(`click of edgename ${rowIndex}`);
    this.onSelect("", true, rowIndex);
    this.setState({ editingEdgeRow: rowIndex });
  };

  handleEdgeKeyPress = event => {
    if (event.key === "Enter") {
      this.handleEdgeNameBlur();
    }
  };

  formatName = (value, _xtraInfo) => {
    console.log("formatName called");
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
      if (this.state.editingEdgeRow === -1 || this.rows.length === 0) {
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
          this.rows = this.rows.filter(
            r => r.cells[0].indexOf(filterText) >= 0
          );
        }
        // only show rows on current page
        const start = (this.state.page - 1) * this.state.perPage;
        const end = Math.min(this.rows.length, start + this.state.perPage);
        this.rows = this.rows.slice(start, end);
      } else {
        // pickup any changed info
        this.rows.forEach(r => {
          const rrow = this.props.rows.find(rr => rr.key === r.key);
          if (rrow) {
            r.selected = rrow.selected;
            r.cells[0] = rrow.cells[0];
          }
        });
      }

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
    let { page } = this.state;
    if (filterText !== "") {
      page = 1;
    }
    this.setState({ filterText, page });
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

  onSetPage = (_event, pageNumber) => {
    this.setState({
      page: pageNumber
    });
  };

  onPerPageSelect = (_event, perPage) => {
    this.setState({
      perPage
    });
  };

  genPagination = () => {
    if (this.props.rows.length > 0) {
      return (
        <EdgeTablePagination
          rows={this.props.rows.length}
          perPage={this.state.perPage}
          page={this.state.page}
          onPerPageSelect={this.onPerPageSelect}
          onSetPage={this.onSetPage}
        />
      );
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
