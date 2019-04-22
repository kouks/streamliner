import { Parser } from 'xml2js'
import { products } from '../awis'
import { Node } from '@/models/Node'
import { Product } from '@/models/Product'
import { DynamoDB, Comprehend } from 'aws-sdk'

export class ProductScraper {

  /**
   * The dynamo db service instance.
   */
  private get table () : string {
    return String(process.env.DYNAMO_DB_PRODUCTS_TABLE_NAME)
  }

  /**
   * The dynamo db service instance.
   */
  private get dynamo () : DynamoDB {
    return new DynamoDB()
  }

  /**
   * The comprehend service instance.
   */
  private get comprehend () : Comprehend {
    return new Comprehend()
  }

  /**
   * Scrape a product from the Amazon URL.
   *
   * @param node The node to scrape based on
   */
  public async scrape (node: Node) : Promise<void> {
    // Parse ASIN from the provided node.
    const asin: string = this.parseAsin(node)

    // Request the product from the Amazon Product API.
    const product: Product = await products(asin)
      .body<string>()
      .then(this.parseBody.bind(this))

    // Save the product to the dynamo db table.
    await this.saveProductToDynamoDb(product, node)
  }

  /**
   * Parse the ASIN from the provided node.
   *
   * @param node The node to parse
   * @return The parsed ASIN
   */
  private parseAsin (node: Node) : string {
    const matches: string[] | null = node.url.match(/amazon\.co\.uk\/.+\/([A-Z0-9]{10})(?:\/|\?|$)/)

    if (matches === null) {
      throw new Error('ASIN could not be matched.')
    }

    return matches[1]
  }

  /**
   * Parse the response body.
   *
   * @param body The XML body to be parsed
   */
  private async parseBody (body: string) : Promise<Product> {
    return new Promise<Product>((resolve) => {
      new Parser({ explicitArray: false }).parseString(body, (_: Error, result: any) => {
        resolve(result.ItemLookupResponse.Items.Item)
      })
    })
  }

  /**
   * Save a product to the dynamo db.
   *
   * @param product The product to be saved
   * @param node The corresponding node
   */
  private async saveProductToDynamoDb (product: Product, node: Node) : Promise<void> {
    await this.dynamo.putItem({
      TableName: this.table,
      Item: {
        asin: { S: product.ASIN },
        sessionId: { S: node.sessionId },
        userId: { S: node.userId },
        title: { S: product.ItemAttributes.Title },
        image: { S: product.LargeImage.URL },
        url: { S: product.DetailPageURL },
        category: { S: product.ItemAttributes.Binding },
        group: { S: product.ItemAttributes.ProductGroup },
        manufacturer: { S: product.ItemAttributes.Manufacturer },
        price: { N: product.ItemAttributes.ListPrice.Amount },
        features: { SS: await this.scanFeatures(product) },
        createdAt: { N: String(Date.now()) },
      },
    }).promise()
  }

  /**
   * Use AWS Comprehend to scan important features of the product.
   *
   * @param product The product to scan features for
   * @return The list of features
   */
  private async scanFeatures (product: Product) : Promise<string[]> {
    return this.comprehend.detectSyntax({
      LanguageCode: 'en',
      Text: `${product.ItemAttributes.Title}. ${product.ItemAttributes.Feature.join(' ')}`
    }).promise()
      .then(result => result.SyntaxTokens)
      .then(tokens => (tokens || []).filter(t => false
        || (t.PartOfSpeech || {}).Tag === 'ADJ'
        || (t.PartOfSpeech || {}).Tag === 'NOUN'
        || (t.PartOfSpeech || {}).Tag === 'PROPN'
      ))
      .then(tokens => tokens.map(t => String(t.Text).toLowerCase()))
      .then(tokens => [...new Set(tokens)])
  }

}
