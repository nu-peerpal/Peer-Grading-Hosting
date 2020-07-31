import React from 'react';
import { Box, Diagram, Stack } from 'grommet';
import styles from './styles/tree.module.css';

class Tree extends React.Component {
  constructor(props) {
    super(props);
    this.getChildren = this.getChildren.bind(this);
    this.getNodes = this.getNodes.bind(this);
    this.getConnections = this.getConnections.bind(this);
  }

  getChildren = function (store, i) {
    return (
      store.map(x => {
        //console.log(JSON.stringify(x)+i)
        return (
          Nodes((JSON.stringify(x)+i), x)
        )
      })
    )
  }

  getNodes = function () {
    var tree = this.props.response;
    const items = []
    for (const i in tree) {
      const store = tree[i]
      items.push(
        <Box direction="row" className={styles.matching1}>
          <Box direction="column" className={styles.matching2}>
            {Nodes(i, i)}
          </Box>
          <Box direction="column">
            {this.getChildren(store, i)}
          </Box>
        </Box>
      )
    }
    return items
  }

  getConnections = function(){
    var all = this.props.response;
    const connect = []
    var anchor = 0
    var el = 0
    for (const a in all){
      anchor = a
      for (const c in all[a]){
        el = all[a][c] + anchor
        connect.push(
          {
            fromTarget: anchor,
            toTarget: el,
            anchor: "horizonta",
            thickness: '4px',
            color: 'black',
            type: 'rectilinear',
            // offset: 'large',
          }
        )
      }
    }
    //console.log(connect)
    return connect
  }

  render() {
    return (
      <Stack guidingChild={1}>
        <Diagram
          connections={this.getConnections()}
        />
        <Box id='start'>
          {this.getNodes()}
        </Box>
      </Stack>
    )
  }
}

export default Tree;

function Nodes(id, key) {
  return <Box className={styles.rect} id={id} key={key} margin="small" pad="medium" background="grey" height="xxsmall" width="small" >{key}</Box>;
}