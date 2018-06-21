const { difference, keys, curry } = require('ramda')
module.exports = curry((requireKeys, obj) => difference(requireKeys, keys(obj)))
