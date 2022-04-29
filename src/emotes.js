import SevenTV from '7tv'
import _ from 'underscore'
import axios from 'axios'
import { getUserId, getChannelEmotes } from './helix'

let emoteLookup = {}
let emoteOptimizedLookup = {}

window.emoteLookup = emoteLookup

function lookupEmote(emoteName) {
  return emoteLookup[emoteName]
}

function storeEmote(emoteName, emote) {
  emoteLookup[emoteName] = emote
}

function isEmote(phrase) {
  return phrase in emoteLookup
}

async function buildEmoteLookupDict(channel) {
  let userId = await getUserId(channel)
  await buildTwitchEmotes(userId)
  await buildGlobalBTTVEmotes()
  await buildBTTVEmotes(userId)
  await buildFFZEmotes(userId)
  await buildSevenTVEmotes(channel)
}

function getTwitchEmoteUrl(emoteId) {
  return `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/light/1.0`
}

async function buildTwitchEmotes(userId) {
  try {
    _.each(getChannelEmotes(userId), (emote) => {
      emoteLookup[emote.name] = {
        name: emote.code,
        url: `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/light/1.0`,
      }
    })
  }
  catch {}
}

async function buildBTTVEmotes(userId) {
  try {
    let endpoint = `https://api.betterttv.net/3/cached/users/twitch/${userId}`
    let result = await axios.get(endpoint)
    _.each(result.data.sharedEmotes, (emote) => {
      emoteLookup[emote.code] = {
        name: emote.code,
        url: `https://cdn.betterttv.net/emote/${emote.id}/1x`,
      }
    })
    _.each(result.data.channelEmotes, (emote) => {
      emoteLookup[emote.code] = {
        name: emote.code,
        url: `https://cdn.betterttv.net/emote/${emote.id}/1x`,
      }
    })
  }
  catch {}
}

async function buildGlobalBTTVEmotes(userId) {
  try {
    let endpoint = `https://api.betterttv.net/3/cached/emotes/global`
    let result = await axios.get(endpoint)
    _.each(result.data, (emote) => {
      emoteLookup[emote.code] = {
        name: emote.code,
        url: `https://cdn.betterttv.net/emote/${emote.id}/1x`,
      }
    })
  }
  catch {}
}
    


async function buildFFZEmotes(userId) {
  try {
    let endpoint = `https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${userId}`
    let result = await axios.get(endpoint)
    _.each(result.data, (emote) => {
      emoteLookup[emote.code] = {
        name: emote.code,
        url: `https://cdn.frankerfacez.com/emote/${emote.id}/1`,
      }
    })
  }
  catch {}
}

async function buildSevenTVEmotes(channel) {
  try {
    let results = await SevenTV().fetchUserEmotes(channel)
    _.each(results, (emote) => {
      emoteLookup[emote.name] = {
        name: emote.name,
        width: [emote.width[0]],
        height: [emote.height[0]],
        url: `https://cdn.7tv.app/emote/${emote.id}/1x`,
      }
    })
  }
  catch {}
}


export { buildEmoteLookupDict, lookupEmote, isEmote, getTwitchEmoteUrl, storeEmote }
