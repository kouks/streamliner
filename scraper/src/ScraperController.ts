import { Node } from './models/Node'
import { KeywordScraper } from './services/KeywordScraper'
import { ProductScraper } from './services/ProductScraper'
import { QueueListener, QueueMessage } from '@bausano/sqs-consumer'

export class ScraperController {

  /**
   * The product scraper instance.
   */
  private get productScraper () : ProductScraper {
    return new ProductScraper()
  }

  /**
   * The keyword scraper instance.
   */
  private get keywordScraper () : KeywordScraper {
    return new KeywordScraper()
  }

  /**
   * Listen for any incoming messages in the specified SQS queue.
   *
   * @param message The incoming message
   */
  @QueueListener<Node>('https://sqs.eu-west-1.amazonaws.com/490542543401/prod-historymap-amazon-urls')
  public handleAmazonUrl ({ body }: QueueMessage<Node>) : void {
    console.log('Now scraping', body.url)

    // Check if the node url is a product URL.
    if (/amazon\.co\.uk\/.+\/[A-Z0-9]{10}(?:\/|\?|$)/.test(body.url)) {
      this.productScraper.scrape(body)
        .then(() => console.log('Product scraped.'))
        .catch(console.error)
    }

    // Check if the node url contains any keywords.
    if (/amazon\.co\.uk\/.+keywords/.test(body.url)) {
      this.keywordScraper.scrape(body)
        .then(() => console.log('Keywords scraped.'))
        .catch(console.error)
    }
  }

}
