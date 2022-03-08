import React from 'react'
import { withTranslation } from 'react-i18next'
import { Form, Card, Col } from 'react-bootstrap'
import ReactPlaceholder from 'react-placeholder'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Checkbox, Radio } from 'pretty-checkbox-react'
import {
  faFilter,
  faUser,
  faVenusMars,
  faLanguage,
  faTags,
  faBuilding,
  faMapMarkedAlt,
  faWeight,
} from '@fortawesome/free-solid-svg-icons'
import {
  pipe,
  uniq,
  compact,
  remove,
  getOr,
  map,
  isEmpty,
  contains,
  isEqual,
} from 'lodash/fp'

import { parseErrorMessage } from '../../../utils/generic'
import { reduceFiltersLocations } from '../../../stateReducers/locations'

import SuperSelect from '../SuperSelect/SuperSelect'

class FilterData extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      error: false,
      filters: {
        genders: [],
        languages: [],
        status: [],
        responsibility: [],
        publishersResponsibles: [],
        locations: [],
        typeCompany: '-1',
      },
      data: {
        checksGender: [],
        checksLanguages: [],
        checksStatus: [],
        checksResponsibility: [],
        checksPublishersResponsibilities: [],
        selectLocations: [],
        radiosTypeCompany: [],
      },
    }
    this.getAllFilters = this.getAllFilters.bind(this)
    this.handleOnClick = this.handleOnClick.bind(this)
    this.handleGetValuesTraditional = this.handleGetValuesTraditional.bind(this)
    this.updateValues = this.updateValues.bind(this)
    this.setFiltersSelectedFromURL = this.setFiltersSelectedFromURL.bind(this)
  }

  handleOnClick(event) {
    const {
      target: { name, value, checked },
    } = event
    const newValues = checked
      ? pipe(uniq, compact)([...this.state.filters[name], value])
      : remove((arrayValue) => arrayValue === value, this.state.filters[name])
    this.updateValues(name, newValues)
  }

  handleGetValuesTraditional(event) {
    const {
      target: { name, value },
    } = event
    this.updateValues(name, value)
  }

  updateValues(name, newValues) {
    const { handleFilters } = this.props

    this.setState({
      filters: {
        ...this.state.filters,
        [name]: newValues,
      },
    })
    handleFilters({
      filters: {
        [name]: newValues,
      },
      currentPage: 1,
    })
  }

  async getAllFilters() {
    this.setState({ loading: true })
    const { t } = this.props

    try {
      const { getFilters } = this.props
      const response = await getFilters()
      const data = getOr([], 'data.data', response)
      this.setState({
        data: {
          checksGender: getOr([], 'genders', data),
          checksLanguages: getOr([], 'languages', data),
          checksStatus: getOr([], 'status', data),
          checksResponsibility: getOr([], 'responsibility', data),
          checksPublishersResponsibilities: getOr(
            [],
            'publishersResponsibles',
            data
          ),
          selectLocations: reduceFiltersLocations(data, t),
          radiosTypeCompany: getOr([], 'typeCompany', data),
        },
      })
    } catch (error) {
      this.setState({
        error: t(`common:${parseErrorMessage(error)}`),
        loading: false,
      })
    }
  }

  componentDidMount() {
    this.getAllFilters()
  }

  setFiltersSelectedFromURL() {
    const { filters } = this.props
    this.setState({
      filters,
      loading: false,
    })
  }

  componentDidUpdate(prevProps) {
    const { loading } = this.state
    const { refresh, error, filters } = this.props
    const prevRefresh = getOr(true, 'refresh', prevProps)
    if (refresh && !prevRefresh && !loading && !error) this.getAllFilters()
    else if (!refresh && !isEqual(filters, this.state.filters)) {
      this.setFiltersSelectedFromURL()
    } else if (!refresh && loading) {
      this.setState({
        loading: false,
      })
    }
  }

  render() {
    const {
      error,
      loading,
      filters: {
        genders,
        languages,
        responsibility,
        status,
        typeCompany,
        publishersResponsibles,
        locations,
      },
      data: {
        checksGender,
        checksResponsibility,
        checksLanguages,
        checksStatus,
        checksPublishersResponsibilities,
        radiosTypeCompany,
        selectLocations,
      },
    } = this.state

    const noData =
      isEmpty(checksGender) &&
      isEmpty(checksLanguages) &&
      isEmpty(checksResponsibility) &&
      isEmpty(checksPublishersResponsibilities) &&
      isEmpty(selectLocations) &&
      isEmpty(checksStatus)
    const { t, showTypeCompany = false } = this.props
    return (
      <React.Fragment>
        <Col className="text-center">
          <h3>
            <FontAwesomeIcon icon={faFilter} /> {t('title')}
          </h3>
        </Col>
        <Col className="text-center text-muted">{error}</Col>
        <Col className="text-center text-muted">
          {!loading && noData && t('common:noData')}
        </Col>
        {(loading || !isEmpty(checksPublishersResponsibilities)) && !error && (
          <Col className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>
                  <FontAwesomeIcon icon={faUser} />{' '}
                  {t('publishersResponsiblesTitleFilter')}
                </Card.Title>
                <ReactPlaceholder
                  showLoadingAnimation={true}
                  type="text"
                  ready={!loading}
                  rows={3}
                >
                  <SuperSelect
                    name="publishersResponsibles"
                    value={publishersResponsibles}
                    isMulti={true}
                    options={map(
                      ({ createdBy, publisherNameCreatedBy }) => ({
                        label: `${publisherNameCreatedBy}`,
                        value: createdBy,
                      }),
                      checksPublishersResponsibilities
                    )}
                    onChange={this.handleGetValuesTraditional}
                  />
                </ReactPlaceholder>
              </Card.Body>
            </Card>
          </Col>
        )}
        {(loading || !isEmpty(selectLocations)) && !error && (
          <Col className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>
                  <FontAwesomeIcon icon={faMapMarkedAlt} />{' '}
                  {t('locationsTitleFilter')}
                </Card.Title>
                <ReactPlaceholder
                  showLoadingAnimation={true}
                  type="text"
                  ready={!loading}
                  rows={3}
                >
                  <SuperSelect
                    name="locations"
                    value={locations}
                    isMulti={true}
                    options={selectLocations}
                    onChange={this.handleGetValuesTraditional}
                  />
                </ReactPlaceholder>
              </Card.Body>
            </Card>
          </Col>
        )}
        {(loading || !isEmpty(checksGender)) && !error && (
          <Col className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>
                  <FontAwesomeIcon icon={faVenusMars} />{' '}
                  {t('gendersTitleFilter')}
                </Card.Title>
                <ReactPlaceholder
                  showLoadingAnimation={true}
                  type="text"
                  ready={!loading}
                  rows={3}
                >
                  {map(
                    ({ gender }) => (
                      <Form.Group controlId={`genders${gender}`} key={gender}>
                        <Checkbox
                          name="genders"
                          color="info"
                          bigger
                          checked={contains(gender, genders)}
                          value={gender}
                          onChange={this.handleOnClick}
                        >{`${t(`contacts:${gender}`)}`}</Checkbox>
                      </Form.Group>
                    ),
                    checksGender
                  )}
                </ReactPlaceholder>
              </Card.Body>
            </Card>
          </Col>
        )}
        {(loading || !isEmpty(checksLanguages)) && !error && (
          <Col className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>
                  <FontAwesomeIcon icon={faLanguage} />{' '}
                  {t('languagesTitleFilter')}
                </Card.Title>
                <ReactPlaceholder
                  showLoadingAnimation={true}
                  type="text"
                  ready={!loading}
                  rows={5}
                >
                  {map(
                    ({ idLanguage, languageName }) => (
                      <Form.Group
                        controlId={`languages${idLanguage}`}
                        key={idLanguage}
                      >
                        <Checkbox
                          color="info"
                          bigger
                          name="languages"
                          checked={contains(String(idLanguage), languages)}
                          value={idLanguage}
                          onChange={this.handleOnClick}
                        >{`${t(`languages:${languageName}`)}`}</Checkbox>
                      </Form.Group>
                    ),
                    checksLanguages
                  )}
                </ReactPlaceholder>
              </Card.Body>
            </Card>
          </Col>
        )}
        {(loading || !isEmpty(checksStatus)) && !error && (
          <Col className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>
                  <FontAwesomeIcon icon={faTags} /> {t('statusTitleFilter')}
                </Card.Title>
                <ReactPlaceholder
                  showLoadingAnimation={true}
                  type="text"
                  ready={!loading}
                  rows={6}
                >
                  {map(
                    ({ idStatus, statusDescription }) => (
                      <Form.Group
                        controlId={`status${idStatus}`}
                        key={idStatus}
                      >
                        <Checkbox
                          color="info"
                          bigger
                          name="status"
                          checked={contains(String(idStatus), status)}
                          value={idStatus}
                          onChange={this.handleOnClick}
                        >
                          {`${t(`status:${statusDescription}`)}`}
                        </Checkbox>
                      </Form.Group>
                    ),
                    checksStatus
                  )}
                </ReactPlaceholder>
              </Card.Body>
            </Card>
          </Col>
        )}
        {(loading || !isEmpty(checksResponsibility)) && !error && (
          <Col className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>
                  <FontAwesomeIcon icon={faWeight} />{' '}
                  {t('responsibilityTitleFilter')}
                </Card.Title>
                <ReactPlaceholder
                  showLoadingAnimation={true}
                  type="text"
                  ready={!loading}
                  rows={4}
                >
                  {map(
                    ({ idResponsibility, responsibilityDescription }) => (
                      <Form.Group
                        key={idResponsibility}
                        controlId={`responsibility${idResponsibility}`}
                      >
                        <Checkbox
                          color="info"
                          bigger
                          name="responsibility"
                          checked={contains(
                            String(idResponsibility),
                            responsibility
                          )}
                          value={idResponsibility}
                          onChange={this.handleOnClick}
                        >
                          {`${t(
                            `responsibility:${responsibilityDescription}`
                          )}`}
                        </Checkbox>
                      </Form.Group>
                    ),
                    checksResponsibility
                  )}
                </ReactPlaceholder>
              </Card.Body>
            </Card>
          </Col>
        )}
        {showTypeCompany && (loading || !noData) && !error && (
          <Col className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>
                  <FontAwesomeIcon icon={faBuilding} />{' '}
                  {t('typeCompanyTitleFilter')}
                </Card.Title>
                <ReactPlaceholder
                  showLoadingAnimation={true}
                  type="text"
                  ready={!loading}
                  rows={3}
                >
                  {map(
                    ({ typeCompanySelected }) => (
                      <Form.Group
                        key={typeCompanySelected}
                        controlId={`typeCompany${typeCompanySelected}`}
                      >
                        <Radio
                          name="typeCompany"
                          checked={typeCompany === typeCompanySelected}
                          value={typeCompanySelected}
                          color="info"
                          bigger
                          onChange={this.handleGetValuesTraditional}
                        >{`${t(`typeCompany${typeCompanySelected}`)}`}</Radio>
                      </Form.Group>
                    ),
                    radiosTypeCompany
                  )}
                </ReactPlaceholder>
              </Card.Body>
            </Card>
          </Col>
        )}
      </React.Fragment>
    )
  }
}

export default withTranslation([
  'filterData',
  'languages',
  'status',
  'contacts',
  'responsibility',
])(FilterData)
