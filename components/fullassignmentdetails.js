import React from "react";
import Link from 'next/link'
import Container from '../components/container'
// import { Accordion, Icon } from 'semantic-ui-react'

class AccordionExampleStandard extends React.Component {
  state = { activeIndex: 0 }
  
  handleClick = (e, titleProps) => {
    // console.log(titleProps)
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { activeIndex } = this.state
    return (
      <div>Assignment Info</div>
    )
  }
}

export default AccordionExampleStandard;
