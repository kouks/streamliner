import { Request } from 'awi'
import { HmacSHA256, enc } from 'crypto-js'

export class SignatureFactory {

  /**
   * Compute the Amazon request signature.
   *
   * @param request The request sign
   */
  public static getSignature (request: Request) : string {
    // Sort the query and join it to a string.
    const query: string = Object.keys(request.query)
      .sort()
      .map(key => `${key}=${encodeURIComponent(request.query[key])}`)
      .join('&')

    // Create the string to sign.
    const sts: string = `${request.method}\n${process.env.AMAZON_PRODUCTS_ENDPOINT}\n${request.path}\n${query}`
    // Compute the Hmac hash with the secret key.
    const signature: string = enc.Base64.stringify(
      HmacSHA256(sts, process.env.AMAZON_PRODUCTS_SECRET_KEY)
    )

    return signature
  }

}
