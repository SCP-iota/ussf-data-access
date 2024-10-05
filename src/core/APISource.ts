import DataSource from './DataSource'
import Satellite from './Satellite'
import AuthCredentials from './AuthCredentials'

async function readPages(url: string, fetchOptions: any, numPages: any): Promise<any[]> {
  let offset = 0
  let numResults = 1
  const items = []
  let pagesRead = 0

  while(numResults > 0 && pagesRead < numPages) {
    const newUrl = new URL(url)
    newUrl.searchParams.set('offset', offset.toString())
    const results = await fetch(newUrl, fetchOptions).then(res =>
      res.json()
    )

    for(const result of results) {
      items.push(result)
    }

    numResults = results.length
    offset += numResults
    pagesRead++
  }

  return items
}

export default class APISource implements DataSource {
  private authToken?: string
  public authStatus: 'none' | 'succeeded' | 'failed' = 'none'
  onAuth: Promise<any> | null = null
  private credentials?: AuthCredentials

  constructor(private readonly endpoint: string, credentials?: AuthCredentials) {
    if(!!credentials) {
      this.credentials = credentials
      this.onAuth = fetch(this.endpoint + '/login/oauth/access-token', {
        method: 'POST',
	body: 'username=' + encodeURIComponent(credentials.username) + '&password=' + encodeURIComponent(credentials.password),
	headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
	}
      }).catch(err => { console.log(err); this.authStatus = 'failed' })
      .then(res => res!.json())
      .catch(err => { console.log(err); this.authStatus = 'failed' })
      .then(json => {
        this.authStatus = 'succeeded'
	this.authToken = json.access_token
      })
    }
  }

  get tags(): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      fetch(this.endpoint + '/tags/')
        .catch(reject)
	.then(res => 
          res!.json().catch(reject)
	    .then(resolve)
        )
    })
  }

  get categories(): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      fetch(this.endpoint + '/categories/')
        .catch(reject)
        .then(res =>
          res!.json().catch(reject)
            .then(resolve)
        )
    })
  }

  get owners(): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      fetch(this.endpoint + '/owners/')
        .catch(reject)
        .then(res =>
          res!.json().catch(reject)
            .then(resolve)
        )
    })
  }

  async getPublicSatellites(max: number): Promise<Satellite[]> {
    return (await readPages(this.endpoint  + '/satellites/public/', {}, max || 1)).map(sat =>
      new Satellite(
        sat.norad_cat_id,
	sat.object_name,
	sat.object_id,
	sat.object_type
      )
    )
  }

  async getPrivateSatellites(max: number): Promise<Satellite[]> {
    if(this.authStatus !== 'succeeded') {
      throw new Error('Authentication required for listing private satellites')
    }
    
    return (await readPages(this.endpoint  + '/satellites/private/', {
      headers: {
        'Authorization': 'Basic ' + btoa(this.credentials!.username + ':' + this.credentials!.password)
      }
    }, max || 1)).map(sat =>
      new Satellite(
        sat.norad_cat_id,
        sat.object_name,
        sat.object_id,
        sat.object_type
      )
    )
  }
}
