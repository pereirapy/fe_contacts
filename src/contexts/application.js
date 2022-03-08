import { createContext } from 'react'

export const ApplicationContext = createContext({
  updateContext: (previous) => {},
  isAdmin: false,
  isAtLeastElder: false,
  isAtLeastSM: false,
  isPublisher: true,
  hasToken: false,
  user: null,
  settings: null,
  campaignActive: null,
  campaignNext: null,
  setCookieLoginData: (user, expiresAt) => {},
  dropToken: () => {},
  setSettings: (settings) => {},
})
