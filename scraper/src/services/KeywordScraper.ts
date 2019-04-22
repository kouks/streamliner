import { DynamoDB } from 'aws-sdk'
import { Node } from '@/models/Node'

export class KeywordScraper {

  /**
   * The dynamo db service instance.
   */
  private get table () : string {
    return String(process.env.DYNAMO_DB_KEYWORDS_TABLE_NAME)
  }

  /**
   * The dynamo db service instance.
   */
  private get dynamo () : DynamoDB {
    return new DynamoDB()
  }

  /**
   * Scrape keywords from the Amazon URL.
   *
   * @param node The node to scrape based on
   */
  public async scrape (node: Node) : Promise<void> {
    const matches: string[] | null = node.url.match(/keywords=([^&]+)/)

    if (matches === null) {
      throw new Error('No keywords matched.')
    }

    const keywords: string[] = matches[1].toLowerCase().split(/[^\w]+/).sort()

    await this.dynamo.putItem({
      TableName: this.table,
      Item: {
        id: { S: Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64') },
        userId: { S: node.userId },
        sessionId: { S: node.sessionId },
        tokens: { SS: [...new Set(keywords)] },
        createdAt: { N: String(Date.now()) },
      },
    }).promise()
  }

}
