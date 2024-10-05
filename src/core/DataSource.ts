export default interface DataSource {
  readonly tags: Promise<string[]>
}
