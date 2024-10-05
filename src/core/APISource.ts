import DataSource from './DataSource'

export default class APISource implements DataSource {
  constructor(private readonly endpoint: string) {
    
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
}
