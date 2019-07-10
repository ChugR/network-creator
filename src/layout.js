import React from "react";
import {
  Avatar,
  Button,
  ButtonVariant,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownSeparator,
  KebabToggle,
  Page,
  PageHeader,
  SkipToContent,
  Toolbar,
  ToolbarGroup,
  ToolbarItem
} from "@patternfly/react-core";
// make sure you've installed @patternfly/patternfly
import accessibleStyles from "@patternfly/patternfly/utilities/Accessibility/accessibility.css";
import spacingStyles from "@patternfly/patternfly/utilities/Spacing/spacing.css";
import { css } from "@patternfly/react-styles";
import { BellIcon, CogIcon } from "@patternfly/react-icons";
import ChooseTopology from "./choose-topology";
import ShowD3SVG from "./show-d3-svg";

const avatarImg = require("./assets/img_avatar.svg");

class PageLayoutDefaultNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropdownOpen: false,
      isKebabDropdownOpen: false,
      activeItem: 0,
      chosenTopology: "linear"
    };
    this.topologies = {
      linear: { center: false, default: 3, min: 1, max: 20 },
      mesh: { center: false, default: 4, min: 1, max: 20 },
      star: { center: true, default: 6, min: 1, max: 20 },
      ring: { center: false, default: 3, min: 1, max: 20 },
      ted: { center: false, default: 6, min: 1, max: 20 },
      bar_bell: { center: true, default: 6, min: 1, max: 20 },
      random: { center: false, default: 4, min: 1, max: 20 }
    };
  }

  onDropdownToggle = isDropdownOpen => {
    this.setState({
      isDropdownOpen
    });
  };

  onDropdownSelect = event => {
    this.setState({
      isDropdownOpen: !this.state.isDropdownOpen
    });
  };

  onKebabDropdownToggle = isKebabDropdownOpen => {
    this.setState({
      isKebabDropdownOpen
    });
  };

  onKebabDropdownSelect = event => {
    this.setState({
      isKebabDropdownOpen: !this.state.isKebabDropdownOpen
    });
  };

  onNavSelect = result => {
    this.setState({
      activeItem: result.itemId
    });
  };

  render() {
    const { isDropdownOpen, isKebabDropdownOpen } = this.state;

    const kebabDropdownItems = [
      <DropdownItem key="notif">
        <BellIcon /> Notifications
      </DropdownItem>,
      <DropdownItem key="sett">
        <CogIcon /> Settings
      </DropdownItem>
    ];
    const userDropdownItems = [
      <DropdownItem key="link">Link</DropdownItem>,
      <DropdownItem component="button" key="action">
        Action
      </DropdownItem>,
      <DropdownItem isDisabled key="dis">
        Disabled Link
      </DropdownItem>,
      <DropdownItem isDisabled component="button" key="button">
        Disabled Action
      </DropdownItem>,
      <DropdownSeparator key="sep0" />,
      <DropdownItem key="sep">Separated Link</DropdownItem>,
      <DropdownItem component="button" key="sep1">
        Separated Action
      </DropdownItem>
    ];
    const PageToolbar = (
      <Toolbar>
        <ToolbarGroup
          className={css(
            accessibleStyles.screenReader,
            accessibleStyles.visibleOnLg
          )}
        >
          <ToolbarItem>
            <Button
              id="default-example-uid-01"
              aria-label="Notifications actions"
              variant={ButtonVariant.plain}
            >
              <BellIcon />
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Button
              id="default-example-uid-02"
              aria-label="Settings actions"
              variant={ButtonVariant.plain}
            >
              <CogIcon />
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem
            className={css(accessibleStyles.hiddenOnLg, spacingStyles.mr_0)}
          >
            <Dropdown
              isPlain
              position="right"
              onSelect={this.onKebabDropdownSelect}
              toggle={<KebabToggle onToggle={this.onKebabDropdownToggle} />}
              isOpen={isKebabDropdownOpen}
              dropdownItems={kebabDropdownItems}
            />
          </ToolbarItem>
          <ToolbarItem
            className={css(
              accessibleStyles.screenReader,
              accessibleStyles.visibleOnMd
            )}
          >
            <Dropdown
              isPlain
              position="right"
              onSelect={this.onDropdownSelect}
              isOpen={isDropdownOpen}
              toggle={
                <DropdownToggle onToggle={this.onDropdownToggle}>
                  anonymous
                </DropdownToggle>
              }
              dropdownItems={userDropdownItems}
            />
          </ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
    );

    const Header = (
      <PageHeader
        className="topology-header"
        logo={
          <React.Fragment>
            <ShowD3SVG
              className="topology-logo"
              topology="ted"
              routers={6}
              center={false}
              dimensions={{ width: 150, height: 75 }}
              radius={6}
              thumbNail={true}
              notifyCurrentRouter={() => {}}
            />
            <span className="logo-text">Network creator</span>
          </React.Fragment>
        }
        toolbar={PageToolbar}
        avatar={<Avatar src={avatarImg} alt="Avatar image" />}
      />
    );
    const PageSkipToContent = (
      <SkipToContent href="#main-content-page-layout-default-nav">
        {" "}
        Skip to Content
      </SkipToContent>
    );

    return (
      <React.Fragment>
        <Page header={Header} skipToContent={PageSkipToContent}>
          <ChooseTopology />
        </Page>
      </React.Fragment>
    );
  }
}

export default PageLayoutDefaultNav;
