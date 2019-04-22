import { Awi } from 'awi'
import Signer from 'aws4'
import Auth from './core/Auth'

/**
 * Base API Awi instance.
 */
export const api = () => new Awi()
  .use(async req => req.base = 'https://j5821wlr82.execute-api.eu-west-1.amazonaws.com/prod/v1')

/**
 * IAM Authenticated requests.
 */
export const authed = () => api()
  .use(async (req) => {
    const url = new URL(`${req.base}/${req.path}`)
    const creds = await new Auth().session()

    const params = Signer.sign({
      body: '',
      headers: {},
      host: url.hostname,
      method: 'GET',
      path: url.pathname
    }, creds)

    req.path = ''
    req.base = url.toString()
    req.headers['Authorization'] = params.headers['Authorization']
    req.headers['X-Amz-Date'] = params.headers['X-Amz-Date']
    req.headers['X-Amz-Security-Token'] = params.headers['X-Amz-Security-Token']
  }, 2)
