import React from 'react';
//import styles from "./styles/listcontainer.module.css";
import styles from "./styles/container.module.css"
import Link from 'next/link'
import Router from 'next/router'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

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
                <h1>Hey!</h1>
                <div className={styles.back} onClick={() => Router.back()}><KeyboardBackspaceIcon/></div>
                {this.props.children}
                {/* <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Hey</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {this.props.children}
                </Table.Body> */}
            </div>
        )
    }
}

export default Container;