import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { hasToken } from './loginDataManager'

// handle the private routes
function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        hasToken() ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        )
      }
    />
  )
}

export default PrivateRoute
