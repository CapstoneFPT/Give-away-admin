/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthModel } from './_models'
import Cookies from 'js-cookie';

const AUTH_COOKIE_KEY = 'kt-auth-react-v'

const getAuth = (): AuthModel | undefined => {
  const cookieValue = Cookies.get(AUTH_COOKIE_KEY)
  if (!cookieValue) {
    return
  }

  try {
    const auth: AuthModel = JSON.parse(cookieValue) as AuthModel
    if (auth) {
      return auth
    }
  } catch (error) {
    console.error('AUTH COOKIE PARSE ERROR', error)
  }
}

const setAuth = (auth: AuthModel) => {
  try {
    const cookieValue = JSON.stringify(auth)
    // Set the cookie to expire in 7 days
    Cookies.set(AUTH_COOKIE_KEY, cookieValue, { expires: 7, secure: true, sameSite: 'strict' })
  } catch (error) {
    console.error('AUTH COOKIE SAVE ERROR', error)
  }
}

const removeAuth = () => {
  try {
    Cookies.remove(AUTH_COOKIE_KEY)
  } catch (error) {
    console.error('AUTH COOKIE REMOVE ERROR', error)
  }
}

export function setupAxios(axios: any) {
  axios.defaults.headers.Accept = 'application/json'
  axios.interceptors.request.use(
      (config: {headers: {Authorization: string}}) => {
        const auth = getAuth()
        if (auth && auth.api_token) {
          config.headers.Authorization = `Bearer ${auth.api_token}`
        }

        return config
      },
      (err: any) => Promise.reject(err)
  )
}

export { getAuth, setAuth, removeAuth, AUTH_COOKIE_KEY }