import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'

import Button from '../../common/Button/Button'

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
        <Button variant={getStyleForFieldDays()} text={t(`${info}`)} />
      </OverlayTrigger>
    ) : (
      info
    )
  }
}

export default withTranslation(['contacts'])(OurToolTip)
