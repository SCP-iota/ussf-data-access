import APISource from './core/APISource'

const src = new APISource('http://localhost:3000/https://api.spaceforce.sh', {
  username: 'alice',
  password: 'secret'
})
;(window as any).src = src
src.onAuth?.then(async () => {
  console.log(await src.getPrivateSatellites(1))
})
