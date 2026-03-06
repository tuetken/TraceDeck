import { CognitoJwtVerifier } from 'aws-jwt-verify';
import db from '../lib/db.js';

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'id',
  clientId: process.env.COGNITO_CLIENT_ID,
});

export async function auth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const [scheme, token] = req.headers.authorization.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  let payload;
  try {
    payload = await verifier.verify(token);
  } catch {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    req.user = await db.user.upsert({
      where: { cognitoId: payload.sub },
      create: { cognitoId: payload.sub, email: payload.email },
      update: { email: payload.email },
    });
  } catch (err) {
    return next(err);
  }

  next();
}

export default auth;
