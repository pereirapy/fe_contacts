import React from 'react'
import SuperSelect from '../SuperSelect/SuperSelect'
import { withTranslation } from 'react-i18next'
import { responsibility } from '../../../services'
import { reduceResponsibility } from '../../../stateReducers/responsibility'
import { parseErrorMessage } from '../../../utils/generic'
import ShowError from '../ShowError/ShowError'

class ResponsibilitySelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = { responsibilityOptions: [], loading: false, error: false }
    this.handleGetAll = this.handleGetAll.bind(this)
  }

  async handleGetAll() {
    this.setState({ loading: true })
    const { t } = this.props

    try {
      const { justAllowedForMe } = this.props
      const responsibilityOptions = reduceResponsibility(
        t,
        justAllowedForMe,
        await responsibility.get()
      )
      this.setState({ responsibilityOptions, loading: false })
    } catch (error) {
      const messageParsed = parseErrorMessage(error) 
      this.setState({
        error: t(`common:${messageParsed}`, messageParsed),
        loading: false,
      })
    }
  }

  componentDidMount() {
    this.handleGetAll()
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return
    }
  }

  render() {
    const {
      value,
      onChange,
      validated,
      name,
      validator,
      t,
      label,
      rules,
      disabled = false,
    } = this.props
    const { responsibilityOptions, loading, error } = this.state

    return !error ? (
      <SuperSelect
        name={name || 'idResponsibility'}
        label={label || t('responsibility')}
        isClearable={true}
        validator={validator}
        validated={validated}
        loading={loading}
        value={value}
        options={responsibilityOptions}
        onChange={onChange}
        rules={rules}
        disabled={disabled}
      />
    ) : (
      <ShowError error={error} />
    )
  }
}

export default withTranslation(['responsibility', 'common'])(
  ResponsibilitySelect
)
