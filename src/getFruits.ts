import fs from 'fs'

export default function getFruits (): { props: { fruits: string[] } } {
  const fruitsString = fs.readFileSync('./data/fruits.json', 'utf-8')
  const fruits = JSON.parse(fruitsString)
  return {
    props: {
      fruits
    }
  }
}
