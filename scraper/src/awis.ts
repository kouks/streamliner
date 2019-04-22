import { Awi, Client, ResponseType } from 'awi'
import { SignatureFactory } from './services/SignatureFactory'

/**
 * Base amazon products API endpoint.
 */
export const products: (id: string) => Client = (id: string) => new Awi()
  .use(async req => req.base = `https://${String(process.env.AMAZON_PRODUCTS_ENDPOINT)}`)
  .use(async req => req.path = '/onca/xml')
  .use(async req => req.response.type = ResponseType.TEXT)
  .use(async req => req.query.SubscriptionId = String(process.env.AMAZON_PRODUCTS_ACCESS_KEY))
  .use(async req => req.query.AssociateTag = String(process.env.AMAZON_PRODUCTS_ASSOCIATE_TAG))
  .use(async req => req.query.Operation = 'ItemLookup')
  .use(async req => req.query.ResponseGroup = 'Images,ItemAttributes')
  .use(async req => req.query.Version = '2013-08-01')
  .use(async req => req.query.Timestamp = new Date().toISOString())
  .use(async req => req.query.Service = 'AWSECommerceService')
  .use(async req => req.query.ItemId = id)
  .use(async req => req.query.IdType = 'ASIN')
  .use(async req => req.query.Signature = SignatureFactory.getSignature(req), 2)

