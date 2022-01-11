// import React from "react";
import React, { useState, useEffect } from "react";
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

  // version 1

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

  // version 2

  // render() {
  //   return (
  //   <body>
  //     <div id="load"></div>
  //     <div id="contents">
  //       <div className={styles.containers}>
  //         <h1 className={styles.header}>{this.props.name}</h1>
  //         <div className={styles.back} onClick={() => Router.back()}>
  //           <KeyboardBackspaceIcon />
  //         </div>
  //         {this.props.children}
  //       </div>
  //     </div>
  //   </body>
  //   );
  // }


}

export default Container;
