import React from 'react'
import SuperSelect from '../SuperSelect/SuperSelect'
import { withTranslation } from 'react-i18next'
import { languages } from '../../../services'
import { getOr, pipe, curry, orderBy } from 'lodash/fp'
import { reduceLanguages } from '../../../stateReducers/languages'
import { parseErrorMessage } from '../../../utils/generic'
import ShowError from '../ShowError/ShowError'

class LanguageSelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = { languagesOptions: [], loading: false, error: false }
    this.handleGetAll = this.handleGetAll.bind(this)
  }

  async handleGetAll() {
    this.setState({ loading: true })
    const { t } = this.props

    try {
      const languagesOptions = pipe(
        getOr([], 'data.data'),
        curry(reduceLanguages)(t),
        orderBy(['label'], ['asc'])
      )(await languages.getAll())

      this.setState({ languagesOptions, loading: false })
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
    const { languagesOptions, error, loading } = this.state

    return !error ? (
      <SuperSelect
        name={name || 'idLanguage'}
        label={label || t('labelSelect')}
        isClearable={true}
        validator={validator}
        validated={validated}
        loading={loading}
        value={value}
        options={languagesOptions}
        onChange={onChange}
        rules={rules}
        placeHolderSelect={placeHolderSelect}
      />
    ) : (
      <ShowError error={error} />
    )
  }
}

export default withTranslation(['languages', 'common'])(LanguageSelect)
