import axios from 'axios';
import jwt from 'jsonwebtoken';
import queryString from 'query-string';
import config from '../config/config.js';
import User from '../models/users.model.js';
const authParams = queryString.stringify({
  client_id: config.clientId,
  redirect_uri: config.redirectUrl,
  response_type: 'code',
  scope: 'openid profile email',
  access_type: 'offline',
  state: 'standard_oauth',
  prompt: 'consent',
});

const getTokenParams = (code) =>
  queryString.stringify({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: config.redirectUrl,
  });

export const getAuthUrl = (_, res) => {
  res.json({
    url: `${config.authUrl}?${authParams}`,
  });
};

export const getToken = async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ message: 'Authorization code must be provided' });

  try {
    const tokenParam = getTokenParams(code);

    const {
      data: { id_token },
    } = await axios.post(`${config.tokenUrl}?${tokenParam}`);

    if (!id_token) return res.status(400).json({ message: 'Auth error' });

    const { email, name, picture } = jwt.decode(id_token);
    let user=await User.findOne({email});
    if(!user)
    {
      user=await User.create({ name, email, profilePic: picture });
    }
    const userData = { _id:user._id,name:user.name, email:user.email, profilePic:user.profilePic };


    const token = jwt.sign({ user:userData }, config.tokenSecret, {
      expiresIn: config.tokenExpiration,
    });

    res.cookie('token', token, {
      maxAge: config.tokenExpiration,
      httpOnly: true,
    });

    res.json({ user:userData})
  } catch (err) {
    console.error('Error: ', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

export const checkLoggedIn = (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json({ loggedIn: false });

    const { user } = jwt.verify(token, config.tokenSecret);
    const newToken = jwt.sign({ user }, config.tokenSecret, {
      expiresIn: config.tokenExpiration,
    });

    res.cookie('token', newToken, {
      maxAge: config.tokenExpiration,
      httpOnly: true,
    });

    res.json({ loggedIn: true, user });
  } catch (err) {
    res.json({ loggedIn: false });
  }
};

export const logout = (_, res) => {
  res.clearCookie('token').json({ message: 'Logged out' });
};
