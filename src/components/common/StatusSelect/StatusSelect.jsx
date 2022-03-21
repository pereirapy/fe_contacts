import React from 'react'
import SuperSelect from '../SuperSelect/SuperSelect'
import { withTranslation } from 'react-i18next'
import { status } from '../../../services'
import { getOr, pipe, curry, orderBy } from 'lodash/fp'
import { reduceStatus } from '../../../stateReducers/status'
import { parseErrorMessage } from '../../../utils/generic'
import ShowError from '../ShowError/ShowError'

class StatusSelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = { statusOptions: [], loading: false, error: false }
    this.handleGetAll = this.handleGetAll.bind(this)
  }

  async handleGetAll() {
    this.setState({ loading: true })
    const { t } = this.props
    try {
      const statusOptions = pipe(
        getOr([], 'data.data'),
        curry(reduceStatus)(t),
        orderBy(['label'], ['asc'])
      )(await status.getAll())
      this.setState({ statusOptions, loading: false })
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
      placeHolderSelect,
    } = this.props
    const { statusOptions, loading, error } = this.state

    return !error ? (
      <SuperSelect
        name={name || 'idStatus'}
        label={label || t('status')}
        isClearable={true}
        validator={validator}
        validated={validated}
        loading={loading}
        value={value}
        options={statusOptions}
        onChange={onChange}
        placeHolderSelect={placeHolderSelect}
        rules={rules}
      />
    ) : (
      <ShowError error={error} />
    )
  }
}

export default withTranslation(['status', 'common'])(StatusSelect)
