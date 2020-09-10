const fetch = require('node-fetch')
const AbortController = require('abort-controller')
const promiseRetry = require('promise-retry')

function fetchJSON(url) {
  return promiseRetry(async (retry) => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 1000)

    try {
      const res = await fetch(url, { signal: controller.signal })
      const body = await res.json()
      return body
    } catch (e) {
      if (e.name === 'AbortError') {
        retry()
      } else {
        throw e
      }
    } finally {
      clearTimeout(timeout)
    }
  }, {
    factor: 1,
    minTimeout: 500,
    randomize: true
  })
}

exports.handler = async function(event, context) {
  try {
    const data = await fetchJSON('https://www.blaseball.com/api/getIdols')
    const playerIds = data.map(x => x.playerId)

    const playerData = await fetchJSON(`https://www.blaseball.com/database/players?ids=${playerIds.join(',')}`)

    const idols = data.map(x => Object.assign(x, { player: playerData.find(y => x.playerId == y.id) }))

    return {
      statusCode: 200,
      body: JSON.stringify(idols)
      /* headers: {
        'Cache-Control': 'max-age=300',
      } */
    }
  } catch (err) {
    console.log(err) // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
    }
  }
}
