import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import useApplicationContext from '../hooks/useApplicationContext'

function PrivateRoute({ component: Component, ...rest }) {
  const { hasToken } = useApplicationContext()
  return (
    <Route
      {...rest}
      render={(props) =>
        hasToken ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        )
      }
    />
  )
}

export default PrivateRoute
