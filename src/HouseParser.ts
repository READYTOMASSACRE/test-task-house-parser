/**
 * Парсер домов по входной строке
 */
export class HouseParser {
  private parsers   : TestTask.Parser[] = []
  private variants  : TestTask.Variant[] = []

  constructor(private readonly source: string) {
    this.parsers.push({
      parse: this.parseOddEven,
      pattern: /(четные|нечетные)[^0-9]{0,}(\d+\+|\d+-\d+)/i,
    })

    this.parsers.push({
      parse: this.parseOddEvenTextRange,
      pattern: /(нечетные|четные).?([с|по]+.?\d+)?.?([с|по]+.?\d+)?/i,
    })

    this.parsers.push({
      parse: this.parseRange,
      pattern: /[\d-\/а-я]+/gi
    })

    this.parse(this.source)
  }

  /**
   * Проверяет, является ли номер дома в диапазоне
   * 
   * @param {string} houseNumber 
   */
  isHouseIncluded(houseNumber: number | string): boolean {
      const house = this.getNumber(houseNumber.toString())

      const has = this.variants.filter(variant => {
          if (
              (
                  variant.type === TestTask.VariantTypes.odd
                  && house % 2 !== 0
              ) || (
                  variant.type === TestTask.VariantTypes.even
                  && house % 2 === 0
              )
          ) {
              return false
          }

          const { from, to, range } = variant

          if (
            typeof from !== 'undefined'
            && typeof to !== 'undefined'
            && house >= from
            && house <= to
          ) {
            return true
          }

          if (
            typeof from !== 'undefined'
            && typeof to === 'undefined'
            && house >= from
          ) {
            return true
          }

          if (
            typeof to !== 'undefined'
            && typeof from === 'undefined'
            && house <= to
          ) {
            return true
          }

          if (
            typeof range !== 'undefined'
            && range.indexOf(houseNumber.toString()) !== -1
          ) {
            return true
          }

          return false
      })

      return !!has.length
  }

  /**
   * Парсит входящую строку и разбивает на возможные вариации домов
   * 
   * @param {string} source - исходные даные
   * @example четные 2-28, нечетные 1-21
   * @example нечетные 11+, четные 42+
   * @example четные с 20 и вся улица до конца
   * @example 7/1, 11, 17, 17/1, 17/2, 8/2, 15, 15/1, 15а
   * @example 12, 22, 36, 42, 45, 100-106
   */
  private parse(source: string): void {
    this.parsers.forEach((parser) => {
        const { pattern, parse } = parser
        let isChecked = false

        while (!isChecked) {
          const matches = source.match(pattern)
          if (matches && matches.length) {
              this.variants = [...this.variants, parse.call(this, matches)]
              source = source.replace(pattern, '')
          } else {
              isChecked = true
          }
        }
    })
  }

  /**
   * Создает вариацию списка домов по результату работы регулярного выражения
   * 
   * @param {string[]} matches результат работы регулярного выражения
   */
  private parseOddEven(matches: string[]): TestTask.Variant {
    const [_, oddOrEven, range] = matches

    const variant: TestTask.Variant = {
        type: !!oddOrEven.match(/нечетные/gi)
          ? TestTask.VariantTypes.even
          : TestTask.VariantTypes.odd
    }

    if (typeof range !== 'string' || !range.length) {
      return variant
    }

    if (range.indexOf('-') !== -1) {
      const [from, to] = range.split('-')
      if (typeof from !== 'undefined') variant.from = +from
      if (typeof to !== 'undefined') variant.to = +to
    } else if (range.indexOf('+')) {
      const [from] = range.split('+')
      if (typeof from !== 'undefined') variant.from = +from
    } else {
      variant.from = +range
    }

    return variant
  }

  /**
   * Создает вариацию списка домов по результату работы регулярного выражения
   * 
   * @param {string[]} matches результат работы регулярного выражения
   */
  private parseOddEvenTextRange(matches: string[]): TestTask.Variant {
    const [_, oddOrEven, from, to] = matches

    
    const variant: TestTask.Variant = {
      type: !!oddOrEven.match(/нечетные/gi)
        ? TestTask.VariantTypes.even
        : TestTask.VariantTypes.odd
    }

    if (typeof to !== 'undefined') {
      const numberFrom = from.match(/\d+/)
      if (numberFrom !== null) {
        variant.from = +numberFrom
      }

      const numberTo = from.match(/\d+/)
      if (numberTo !== null) {
        variant.from = +numberTo
      }
    } else {
      const number = from.match(/\d+/)
      if (number !== null) {
        const key = from.indexOf('по') !== -1 ? 'to' : 'from'
        variant[key] = +number
      }
    }

    return variant
  }

  /**
   * Создает вариацию списка домов по результату работы регулярного выражения
   * 
   * @param {string[]} matches результат работы регулярного выражения
   */
  private parseRange(range: string[]): TestTask.Variant {
    range = range.reduce<string[]>((accumulator: string[], current: string) => {
      return [...accumulator, ...this.getRange(current)]
    }, [])

    return { type: TestTask.VariantTypes.range, range }
  }

  /**
   * Возвращает диапазон чисел со строки формата "1", "1-N"
   * 
   * @param {string} number 
   */
  private getRange(number: string): string[] {
    const range = number.split('-')

    if (range.length !== 2) return range

    const from = this.getNumber(range[0])
    const to = this.getNumber(range[1])

    return Array(Math.abs(to - from) + 1)
      .fill(from)
      .map((current, i) => (+current + i).toString())
  }

  /**
   * Возвращает число со строки
   * @param {string} number 
   */
  private getNumber(number: string): number {
    return +number.replace(/[^-\d]+/, '')   
  }
}