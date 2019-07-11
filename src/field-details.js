import React from "react";
import {
  ActionGroup,
  Button,
  ClipboardCopy,
  Form,
  FormGroup,
  TextInput,
  Radio
} from "@patternfly/react-core";
import EdgeTable from "./edge-table";
import Graph from "./graph";

class FieldDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  formElement = (field, currentNode) => {
    if (field.type === "text") {
      let isRequired = field.isRequired;
      if (typeof field.isRequired === "function")
        isRequired = field.isRequired(
          field.title,
          this.props.networkInfo,
          this.props.selectedKey
        );
      return (
        <TextInput
          isRequired={isRequired}
          type="text"
          id={field.title}
          name={field.title}
          aria-describedby="simple-form-name-helper"
          value={currentNode[field.title]}
          onChange={newVal =>
            this.props.handleEditField(newVal, field.title, currentNode.key)
          }
        />
      );
    }
    if (field.type === "radio") {
      const currentNode = this.props.networkInfo.nodes.find(
        n => n.key === this.props.selectedKey
      );
      return field.options.map((o, i) => {
        return (
          <Radio
            key={`key-radio-${o}-${i}`}
            id={o}
            value={o}
            name={field.title}
            label={o}
            aria-label={o}
            onChange={() => this.props.handleRadioChange(o, field.title)}
            isChecked={currentNode[field.title] === o}
          />
        );
      });
    } else if (field.type === "states") {
      const currentNode = this.props.networkInfo.nodes.find(
        n => n.key === this.props.selectedKey
      );
      return field.options.map((o, i) => {
        let yaml = <div className="state-placeholder"></div>;
        if (currentNode.yaml && i === 1) {
          yaml = (
            <ClipboardCopy
              className="state-copy"
              onClick={(event, text) => {
                const clipboard = event.currentTarget.parentElement;
                const el = document.createElement("input");
                el.value = JSON.stringify(currentNode.yaml);
                clipboard.appendChild(el);
                el.select();
                document.execCommand("copy");
                clipboard.removeChild(el);
              }}
            />
          );
        }
        return (
          <div
            className="state-container"
            key={`key-checkbox-${o}-${i}`}
            id={`${field.title}-${i}`}
          >
            {yaml}
            <Graph
              id={`State-${i}`}
              thumbNail={true}
              legend={true}
              dimensions={{ width: 30, height: 30 }}
              nodes={[
                {
                  key: `legend-key-${i}`,
                  r: 10,
                  type: "interior",
                  state: i
                }
              ]}
              links={[]}
              notifyCurrentRouter={() => {}}
            />
            <div className="state-text">{o}</div>
          </div>
        );
      });
    } else if (field.type === "label") {
      const currentLink = this.props.networkInfo.links.find(
        n => n.key === this.props.selectedKey
      );
      return (
        <span className="link-label">
          {typeof currentLink[field.title] === "function"
            ? currentLink[field.title]()
            : currentLink[field.title]}
        </span>
      );
    }
  };

  extra = currentNode => {
    if (this.props.details.extra) {
      const currentNode = this.props.networkInfo.nodes.find(
        n => n.key === this.props.selectedKey
      );
      return (
        <EdgeTable
          rows={currentNode.rows}
          handleAddEdge={this.props.handleAddEdge}
          handleDeleteEdge={this.props.handleDeleteEdge}
          handleEdgeNameChange={this.props.handleEdgeNameChange}
          handleSelectEdgeRow={this.props.handleSelectEdgeRow}
        />
      );
    }
  };

  render() {
    const currentNode = this.props.networkInfo.nodes.find(
      n => n.key === this.props.selectedKey
    );
    return (
      <Form
        onSubmit={e => {
          e.preventDefault();
          return false;
        }}
      >
        <h1>{this.props.details.title}</h1>
        <ActionGroup>
          {this.props.details.actions.map(action => {
            return (
              <Button
                key={action.title}
                variant="secondary"
                onClick={action.onClick}
                isDisabled={
                  action.isDisabled
                    ? action.isDisabled(
                        action.title,
                        this.props.networkInfo,
                        this.props.selectedKey
                      )
                    : false
                }
              >
                {action.title}
              </Button>
            );
          })}
        </ActionGroup>
        {this.props.details.fields.map(field => {
          return (
            <FormGroup
              key={field.title}
              label={field.title}
              isRequired={
                typeof field.isRequired === "function"
                  ? field.isRequired(
                      field.title,
                      this.props.networkInfo,
                      this.props.selectedKey
                    )
                  : field.isRequired
              }
              fieldId={field.title}
              helperText={field.help}
              isInline={field.type === "radio"}
            >
              {this.formElement(field, currentNode)}
            </FormGroup>
          );
        })}
        <FormGroup fieldId="extra">{this.extra(currentNode)}</FormGroup>
      </Form>
    );
  }
}

export default FieldDetails;
