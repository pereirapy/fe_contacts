import React, { Component } from 'react'
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { withTranslation } from 'react-i18next'

class OurToolTip extends Component {
  renderTooltip = (props) => {
    const { t, toolTipContent } = this.props
    return (
      <Tooltip id="button-tooltip" {...props}>
        {t(toolTipContent)}
      </Tooltip>
    )
  }
  render() {
    const {
      t,
      showTooltip,
      info,
      getStyleForFieldDays,
      placement = 'left',
    } = this.props

    return showTooltip ? (
      <OverlayTrigger
        key={placement}
        placement={placement}
        overlay={this.renderTooltip}
      >
        <Button variant={getStyleForFieldDays()}>{t(`${info}`)}</Button>
      </OverlayTrigger>
    ) : (
      info
    )
  }
}

export default withTranslation(['contacts'])(OurToolTip)
