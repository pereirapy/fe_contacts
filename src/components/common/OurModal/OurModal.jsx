import React, { Component } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { withTranslation } from 'react-i18next'

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
    this.setModalShow(false)
    const { onClose } = this.props
    if (onClose) onClose()
  }

  onShow = () => this.setModalShow(true)

  defaultOnExit = () => {
    const { onExit } = this.props
    if (onExit) {
      setTimeout(() => {
        onExit()
      }, 100)
    }
  }

  defaultOnEnter = () => {
    const { onEnter } = this.props
    if (onEnter) {
      setTimeout(() => {
        onEnter()
      }, 100)
    }
  }

  render() {
    const {
      buttonText,
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
      <>
        <Button
          title={buttonTitle || ''}
          variant={buttonVariant || 'primary'}
          disabled={buttonDisabled}
          onClick={this.onShow}
        >
          {buttonText || t('open')}
        </Button>

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
            <Button onClick={this.onHide}>{t('close')}</Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}
export default withTranslation(['common'])(OurModal)
