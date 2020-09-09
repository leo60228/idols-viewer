const fetch = require('node-fetch')
exports.handler = async function(event, context) {
  try {
    let response = await fetch('https://www.blaseball.com/api/getIdols')
    if (!response.ok) {
      return { statusCode: response.status, body: response.statusText }
    }
    const data = await response.json()
    const playerIds = data.map(x => x.playerId)

    response = await fetch(`https://www.blaseball.com/database/players?ids=${playerIds.join(',')}`)
    if (!response.ok) {
      return { statusCode: response.status, body: response.statusText }
    }
    const playerData = await response.json()

    const idols = data.map(x => Object.assign(x, { player: playerData.find(y => x.playerId == y.id) }))

    return {
      statusCode: 200,
      body: JSON.stringify(idols),
      headers: {
        'Cache-Control': 'max-age=300',
      }
    }
  } catch (err) {
    console.log(err) // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
    }
  }
}
