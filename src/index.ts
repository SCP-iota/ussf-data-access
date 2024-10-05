import APISource from './core/APISource'

const src = new APISource('http://localhost:3000/https://api.spaceforce.sh')
src.tags.then(console.log)
