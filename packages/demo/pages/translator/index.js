import React from "react";
import withRoot from "../../src/withRoot";
import { withStyles } from "@material-ui/core";

import Translator from "@pie-lib/chart-toolbox/translator";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

const { translator, languageOptions } = Translator;

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: languageOptions[0].value,
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    const { mounted, language } = this.state;
    // TODO: check similar comps to see what they support...
    return mounted ? (
      <div>
        <Select
          value={language}
          onChange={(event) => { this.setState({ language: event.target.value })}}
          inputProps={{
            name: 'markup',
            id: 'markup',
          }}
        >
          {languageOptions.map((i) => (
            <MenuItem key={i.label} value={i.value}>
              {i.label}
            </MenuItem>
          ))}
        </Select>

        <br />
        <br />{translator.t("ebsr.part", { index: 1, lng: this.state.language })}
        <br />{translator.t("ebsr.part", { index: 2, lng: this.state.language })}
        <br />{translator.t("numberLine.addElementLimit", { count: 1, lng: this.state.language })}
        <br />{translator.t("numberLine.addElementLimit", { count: 2, lng: this.state.language })}
        <br />{translator.t("numberLine.clearAll", { lng: this.state.language })}
        <br />{translator.t("imageClozeAssociation.reachedLimit", { count: 1, lng: this.state.language })}
        <br />{translator.t("imageClozeAssociation.reachedLimit", { count: 2, lng: this.state.language })}



      </div>
    ) : (
      <div />
    );
  }
}

const Styled = withStyles((theme) => ({}))(Demo);

export default withRoot(Styled);
