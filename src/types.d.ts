declare namespace TestTask {
  export const enum VariantTypes {
    odd,
    even,
    range
  }
  
  export type Variant = {
    type: VariantTypes
    from?: number | undefined
    to?: number | undefined
    range?: string[]
  }
  
  export type Parser = {
    pattern: RegExp,
    parse: (...args: any[]) => Variant
  }
}