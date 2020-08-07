import React from "react";
// import styles from "./checkmatching.module.css";
import Container from "../../components/container";
import Tree from "../../components/tree";

class CheckMatching extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const ds = {
      114: [11, 12, 15, 2],
      120: [11, 18],
      118: [12, 16],
      115: [13, 17, 18, 19, 1],
      119: [13, 17],
      113: [14],
      117: [14, 16, 20, 3],
      111: [15],
      116: [19],
      112: [20],
    };
    //const ds = {114: [11, 12, 15, 2], 120: [11, 18], 118: [12, 16], 115: [13, 17, 18, 19, 1], 119: [13, 17], 113: [14], 117: [14, 16, 20, 3], 111: [15], 116: [19], 112: [20]}
    return (
      <div className="Content">
        <Container>
          <Tree response={ds} />
        </Container>
      </div>
    );
  }
}

export default CheckMatching;
