import Color from 'color'
import _ from 'underscore'
import crypto from 'crypto'

function now() {
  return Math.floor((new Date()).getTime() / 1000)
}

function getGroup(context) {
  let badges = context.badges || {}
  if (badges.broadcaster === "1") {
    return "broadcaster"
  }
  if (context.mod === true || badges.moderator === "1") {
    return "mod"
  }
  if (badges.vip === "1") {
    return "vip"
  }
  return "everyone"
}

function trimLast(arr, length) {
  while (arr.length > length) {
    arr.shift()
  }
}

function reduceColor(color) {
  color = Color(color).hsl()
  let newColor = Color({h: color.color[0], s: color.color[1] / 2, v: color.color[2] / 16 + 15 / 16 * 100})
  return newColor.hex()
}

function restoreArray(Class, fromArray, toArray) {
  _.each(_.map(fromArray, (value) => Class.restore(value)), (instance) => toArray.push(instance))
}

function getHash(phrase) {
  return crypto.createHash('md5').update(phrase).digest('hex')
}

function restoreObject(Class, fromObj, toObj) {
  let keys = _.keys(fromObj)
  let values = _.map(keys, (key) => Class.restore(fromObj[key]))
  Object.assign(toObj, Object.fromEntries(
    _.zip(keys, values)))
}

export {now, getGroup, trimLast, reduceColor, restoreArray, restoreObject, getHash}
