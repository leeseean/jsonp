export interface options {
  url: string
  timeout?: number
  jsonpCallback?: string
  callbackParams?: string
  urlParams?: {
    [key: string]: string
  }
}
