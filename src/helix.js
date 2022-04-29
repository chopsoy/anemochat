import axios from 'axios'
import _ from 'underscore'
import { clientSecret, clientId } from './secrets'

const apiPrefix = 'https://api.twitch.tv/helix';
const authEndpoint = 'https://id.twitch.tv/oauth2/token';

async function helixRequest(axiosConfig) {
  return new Promise((resolve, reject) => {
    axios.request(axiosConfig).then((response) => {
      resolve(response.data);
    }).catch((error) => {
      let response = error.response;
      reject();
    });
  });
}

helixRequest._cacheKey = (axiosConfig) => {
  let cacheKey = JSON.parse(JSON.stringify(axiosConfig)); // deep clone
  if (axiosConfig.params instanceof URLSearchParams) {
    cacheKey.params = axiosConfig.params.toString();
  }
  return cacheKey;
}

async function getAccessToken() {
  return (await helixRequest({
    method: 'post',
    url: authEndpoint,
    params: {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials'
    }
  })).access_token;
}

async function request(resource, params) {
  let accessToken = await getAccessToken();
  let headers = {
    'authorization': `Bearer ${accessToken}`,
    'client-id': clientId
  }
  let iterations = 0;
  let data = [];
  const maxIterations = 100;
  do {
    let response = await helixRequest({
      method: 'get',
      url: `${apiPrefix}/${resource}`,
      params: params, 
      headers: headers
    });
    data = _.union(data, response.data);
    if ('pagination' in response && 'cursor' in response.pagination) {
      params.after = response.pagination.cursor;
    } else {
      return data;
    }
    iterations += 1;
  } while (iterations < maxIterations);
  throw 'max iterations reached';
}

async function getUserId(userLogin) {
  let users = (await request('users', {login: userLogin}));
  if (users.length > 0) {
    return users[0].id;
  }
}

async function getChannelEmotes(userId) {
  return await request('chat/emotes', {broadcaster_id: userId})
}

export { request, getUserId, getChannelEmotes }