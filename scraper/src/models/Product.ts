
export interface Product {
  ASIN: string
  DetailPageURL: string
  LargeImage: {
    URL: string
  }
  ItemAttributes: {
    Title: string
    ProductGroup: string
    ProductTypeName: string
    Binding: string
    Manufacturer: string
    Feature: string[]
    ListPrice: {
      Amount: string
    }
  }
}
