import { HouseParser } from './HouseParser'

const tests = [
  {
    input: 'четные 2-28, нечетные 1-21',
    values: [1, 2, 3, 10, 11, 1000, -1, 23, 27, 28]
  },
  {
    input: 'нечетные 11+, четные 42+',
    values: [11, 10, 12, 42, 43, 1000]
  },
  {
    input: 'четные с 20 и вся улица до конца',
    values: [1, 2, 3, 20, 21, 1000, 1001, -1]
  },
  {
    input: '7/1, 11, 17, 17/1, 17/2, 8/2, 15, 15/1, 15а',
    values: [1, 2, 3, '7', '7/1', '7.2', 10, 11, 17, '17/1', '17/2', '15а', '15б', '15', '15/23', '15/1']
  },
  {
    input: '1/7а',
    values: [1, '1/7а', '1/7б']
  },
  {
    input: 'четные с 99999990 до 99999999 12, 22, 36, 42, 45, 100-106 нечетные 211-213 1/7а, 2/1б 3 4 5',
    values: [99999990, 99999991, 12, 22, 36, 37, 41, 42, 100, 101, 102, 103, 104, 106, 211, 212, '1/7а', '1/7б', '1', '3', 4, '2/1б'],
  },
]

const Reset = "\x1b[0m"
const FgRed = "\x1b[31m"
const FgGreen = "\x1b[32m"
const FgMagenta = "\x1b[35m"

tests.forEach(({ input, values }) => {
  const parser = new HouseParser(input)

  console.log(`${Reset}Ввод: "${FgMagenta}${input}${Reset}"`)
  console.log(values.map(value => `${Reset}=> [${value}]: ${parser.isHouseIncluded(value) ? `\t${FgGreen}Да`: `\t${FgRed}Нет`}`).join('\n'))
})