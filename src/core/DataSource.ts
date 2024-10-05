import Satellite from './Satellite'

export default interface DataSource {
  readonly tags: Promise<string[]>
  readonly categories: Promise<string[]>
  readonly owners: Promise<string[]>

  getPublicSatellites(max: number): Promise<Satellite[]>
  getPrivateSatellites(max: number): Promise<Satellite[]>
}
