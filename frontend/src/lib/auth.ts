import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from 'amazon-cognito-identity-js'

const userPool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
})

export function signIn(email: string, password: string): Promise<CognitoUserSession> {
  const user = new CognitoUser({ Username: email, Pool: userPool })
  const authDetails = new AuthenticationDetails({ Username: email, Password: password })

  return new Promise((resolve, reject) => {
    user.authenticateUser(authDetails, {
      onSuccess: resolve,
      onFailure: reject,
    })
  })
}

export function signOut(): void {
  userPool.getCurrentUser()?.signOut()
}

export function getIdToken(): Promise<string | null> {
  const user = userPool.getCurrentUser()
  if (!user) return Promise.resolve(null)

  return new Promise((resolve) => {
    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session?.isValid()) return resolve(null)
      resolve(session.getIdToken().getJwtToken())
    })
  })
}

export function isAuthenticated(): Promise<boolean> {
  return getIdToken().then((token) => token !== null)
}
