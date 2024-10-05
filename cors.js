const corsAnywhere = require('cors-anywhere')
console.log([process.env.ORIGIN || 'http://localhost:8000'])

corsAnywhere.createServer({
  originWhitelist: [process.env.ORIGIN || 'http://localhost:8000']
}).listen(process.env.PORT || 3000)
