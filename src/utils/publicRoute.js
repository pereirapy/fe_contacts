import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { hasToken } from './loginDataManager'

// handle the public routes
function PublicRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        !hasToken() ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/dashboard' }} />
        )
      }
    />
  )
}

export default PublicRoute
