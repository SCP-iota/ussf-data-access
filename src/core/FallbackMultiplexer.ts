import DataSource from './DataSource'
import Satellite from './Satellite'

export default class FallbackMultiplexer implements DataSource {
  constructor(public sources: DataSource[]) {

  }

  get tags(): Promise<string[]> {
    return new Promise<string[]>(async (resolve, reject) => {
      for(const src of this.sources) {
        try {
          resolve(await src.tags)
	  break
	} catch(e) {
          reject(e)
	}
      }

      reject('All sources failed')
    })
  }

  get categories(): Promise<string[]> {
    return new Promise<string[]>(async (resolve, reject) => {
      for(const src of this.sources) {
        try {
          resolve(await src.categories)
	  break
        } catch(e) {
          reject(e)
        }
      }

      reject('All sources failed')
    })
  }

  get owners(): Promise<string[]> {
    return new Promise<string[]>(async (resolve, reject) => {
      for(const src of this.sources) {
        try {
          resolve(await src.owners)
	  break
        } catch(e) {
          reject(e)
        }
      }

      reject('All sources failed')
    })
  }

  getPublicSatellites(max: number): Promise<Satellite[]> {
    return new Promise<Satellite[]>(async (resolve, reject) => {
      for(const src of this.sources) {
        try {
          resolve(await src.getPublicSatellites(max))
	  break
        } catch(e) {
          reject(e)
        }
      }

      reject('All sources failed')
    })
  }

  getPrivateSatellites(max: number): Promise<Satellite[]> {
    return new Promise<Satellite[]>(async (resolve, reject) => {
      for(const src of this.sources) {
        console.log('Trying source with endpoint ' + (src as any).endpoint + '...')
	console.log('Auth status: ' + (src as any).authStatus)
        try {
          resolve(await src.getPrivateSatellites(max))
	  break
        } catch(e) {
        }
      }

      reject('All sources failed')
    })
  }
}
