import APISource from './core/APISource'
import FallbackMultiplexer from './core/FallbackMultiplexer'

const apiSrc = new APISource('http://localhost:3000/https://api.spaceforce.sh', {
  username: 'alice',
  password: 'secret'
})
const failSrc = new APISource('https://spaseforse.example')

Promise.all([failSrc.onAuth!, apiSrc.onAuth!]).then(async () => {
  console.log('Listing private satellites...')
  const src = new FallbackMultiplexer([failSrc, apiSrc])
  ;(window as any).src = src
  console.log(await src.getPrivateSatellites(3))
})
