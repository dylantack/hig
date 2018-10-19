import { Component } from "react";
import PropTypes from "prop-types";
import HIGLightTheme from "@hig/theme-data/build/json/lightGrayMediumDensityTheme/theme.json";
import themeContextShape from "./shape";

const themeDataProxyHandler = {
  get: (theme, name) => {
    const stringName = name.toString();
    if (name in theme) {
      if (typeof theme[name] === "object" && theme[name] !== null) {
        return new Proxy(theme[name], themeDataProxyHandler);
      }
      return theme[name];
    }
    console.error(`Role ${stringName} does not exist`);
    return null;
  }
};

export default class Consumer extends Component {
  static propTypes = {
    /** A theme provided to the consumer within */
    children: PropTypes.func
  };

  static contextTypes = themeContextShape;

  render() {
    const theme = this.context.resolvedRoles ? this.context : HIGLightTheme;
    const proxy = new Proxy(theme, themeDataProxyHandler);
    const themeArgument = process.env.NODE_ENV !== "production" ? proxy : theme;

    return this.props.children(themeArgument);
  }
}