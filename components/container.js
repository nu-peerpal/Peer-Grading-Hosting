import React from "react";
import styles from "./styles/container.module.scss";
import Link from "next/link";
import Router from "next/router";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";

class Container extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //     holder: props
    // }
    //console.log(props)
  }
  render() {
    return (
      <div className={styles.containers}>
        <h1 className={styles.header}>{this.props.name}</h1>
        <div className={styles.back} onClick={() => Router.back()}>
          <KeyboardBackspaceIcon />
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default Container;
