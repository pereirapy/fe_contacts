import React, { Component } from 'react'
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap'

class OurToolTip extends Component {
  renderTooltip = (props) => {
    const { toolTipContent } = this.props
    return (
      <Tooltip id="button-tooltip" {...props}>
        {toolTipContent}
      </Tooltip>
    )
  }

  render() {
    const {
      showTooltip,
      info,
      getToolTipVariant,
      placement = 'left',
      variant = 'link',
      children,
    } = this.props

    const buttonVariant = getToolTipVariant ? getToolTipVariant() : variant

    return showTooltip ? (
      <OverlayTrigger
        key={placement}
        placement={placement}
        overlay={this.renderTooltip}
      >
        <Button variant={buttonVariant}>{info ? info : children}</Button>
      </OverlayTrigger>
    ) : info ? (
      info
    ) : (
      children
    )
  }
}

export default OurToolTip
