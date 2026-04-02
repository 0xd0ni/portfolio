// https://developers.cloudflare.com/r2/examples/aws/aws4fetch/
import { AwsClient } from 'aws4fetch'

// gets initialized on first use
let _client: AwsClient | undefined
function getClient() {
  // if (_client == null) {
  //   _client = new AwsClient({
  //     accessKeyId: import.meta.env.R2_ACCESS_KEY_ID as string,
  //     secretAccessKey: import.meta.env.R2_SECRET_ACCESS_KEY as string,
  //   })
  // }
  // return _client
  return (_client ??= new AwsClient({
    accessKeyId: import.meta.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: import.meta.env.R2_SECRET_ACCESS_KEY as string,
  }))
}

function bucketUrl(params: Record<string, string>) {
  const url = new URL(
    `${import.meta.env.R2_ENDPOINT}/${import.meta.env.GALLERY_BUCKET}`,
  )
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  return url.toString()
}

function extractTags(xml: string, tag: string): string[] {
  return [...xml.matchAll(new RegExp(`<${tag}>(.*?)<\/${tag}>`, 'gs'))].map(
    (m) => m[1],
  )
}

export const r2 = {
  async list({
    prefix,
    continuationToken,
  }: { prefix?: string; continuationToken?: string } = {}) {
    const params: Record<string, string> = { 'list-type': '2' }
    if (prefix) params['prefix'] = prefix
    if (continuationToken) params['continuation-token'] = continuationToken

    const res = await getClient().fetch(bucketUrl(params))
    const xml = await res.text()

    const keys = extractTags(xml, 'Key')
    const dates = extractTags(xml, 'LastModified')
    const contents = keys.map((key, i) => ({
      key,
      lastModified: dates[i] ? new Date(dates[i]) : undefined,
    }))

    const isTruncated = xml.includes('<IsTruncated>true</IsTruncated>')
    const [nextContinuationToken] = extractTags(xml, 'NextContinuationToken')

    return { contents, isTruncated, nextContinuationToken }
  },
}
