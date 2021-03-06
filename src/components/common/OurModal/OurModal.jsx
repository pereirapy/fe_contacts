import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import { withTranslation } from 'react-i18next'

import Button from '../Button/Button'

class OurModal extends Component {
  constructor(props) {
    super(props)
    this.state = { modalShow: false }
    this.defaultOnExit = this.defaultOnExit.bind(this)
    this.defaultOnEnter = this.defaultOnEnter.bind(this)
  }

  setModalShow = (visibility) => {
    this.setState({ modalShow: visibility })
  }

  onHide = () => {
    const { onClose } = this.props
    this.setModalShow(false)
    if (onClose) {
      setTimeout(() => {
        onClose()
      }, 100)
    }
  }

  onShow = () => this.setModalShow(true)

  defaultOnExit = () => {
    const { onExit } = this.props
    if (onExit) {
      setTimeout(() => {
        onExit()
      }, 10)
    }
  }

  defaultOnEnter = () => {
    const { onEnter } = this.props
    if (onEnter) {
      setTimeout(() => {
        onEnter()
      }, 10)
    }
  }

  render() {
    const {
      buttonText,
      buttonIcon,
      buttonTitle,
      buttonVariant,
      title,
      size,
      t,
      dialogClassName,
      buttonDisabled = false,
    } = this.props
    const { modalShow } = this.state
    const Component = this.props.body
    return (
      <React.Fragment>
        <Button
          title={buttonTitle || ''}
          variant={buttonVariant || 'primary'}
          disabled={buttonDisabled}
          onClick={this.onShow}
          text={buttonText || null}
          iconName={buttonIcon || null}
        />

        <Modal
          show={modalShow}
          onHide={this.onHide}
          onEnter={this.defaultOnEnter}
          onExit={this.defaultOnExit}
          size={size || 'lg'}
          centered
          dialogClassName={dialogClassName}
        >
          <Modal.Header closeButton>
            <Modal.Title>{title || 'Title'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Component {...this.props} onHide={this.onHide} />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.onHide} text={t('close')} />
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    )
  }
}
export default withTranslation(['common'])(OurModal)
