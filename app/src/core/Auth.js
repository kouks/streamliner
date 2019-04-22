import AWS from 'aws-sdk'
import config from '@/config'

export default class Auth {
  async login (token, profile) {
    return new Promise((resolve, reject) => {
      AWS.config.region = config.auth.identityPoolRegion
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: config.auth.identityPoolId,
        Logins: { [config.auth.googleLoginType]: token }
      })

      AWS.config.credentials.get(() => {
        if (AWS.config.credentials.expired) {
          return reject(new Error('Login failed.'))
        }

        localStorage.profile = JSON.stringify({
          email: profile.U3,
          name: profile.ig,
          picture: profile.Paa
        })

        localStorage.idToken = token

        resolve()
      })
    })
  }

  async check () {
    return new Promise((resolve, reject) => {
      AWS.config.region = config.auth.identityPoolRegion
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: config.auth.identityPoolId,
        Logins: { [config.auth.googleLoginType]: localStorage.idToken }
      })

      AWS.config.credentials.get(() => {
        if (AWS.config.credentials.expired) {
          return reject(new Error('Login failed.'))
        }

        resolve()
      })
    })
  }

  async session () {
    return new Promise((resolve) => {
      resolve(AWS.config.credentials)
    })
  }

  profile () {
    return JSON.parse(localStorage.profile || null)
  }
}
