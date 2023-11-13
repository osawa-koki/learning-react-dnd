import React, { useEffect, useState } from 'react'
import { Button, ListGroup } from 'react-bootstrap'
import getFruits from '../src/getFruits'

interface Props {
  fruits: string[]
}

export default function VanillaPage (props: Props): React.JSX.Element {
  const { fruits: presetFruits } = props

  const [fruits, setFruits] = useState<string[] | null>(null)

  const [dragging, setDragging] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>): void => {
    setDragging(e.currentTarget.id)
  }

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>): void => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLLIElement>): void => {
    if (dragging === null || fruits == null) return
    e.preventDefault()
    const fruitIndex = fruits.indexOf(dragging)
    const dropIndex = fruits.indexOf(e.currentTarget.id)
    const newFruits = [...fruits]
    newFruits.splice(fruitIndex, 1)
    newFruits.splice(dropIndex, 0, dragging)
    setFruits(newFruits)
  }

  useEffect(() => {
    const savedFruitsString = localStorage.getItem('fruits')
    if (savedFruitsString != null) {
      setFruits(JSON.parse(savedFruitsString))
    } else {
      setFruits(presetFruits)
    }
  }, [])

  useEffect(() => {
    if (fruits != null) {
      localStorage.setItem('fruits', JSON.stringify(fruits))
    }
  }, [fruits])

  if (fruits === null) return (<div>Loading...</div>)

  return (
    <>
      <h1>Drag and Drop Sort (Vanilla)</h1>
      <ListGroup>
        {fruits.map((fruit, index) => (
          <ListGroup.Item
            key={index}
            id={fruit}
            draggable="true"
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            role="button"
          >
            {fruit}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <hr />
      <Button onClick={() => { setFruits(presetFruits) }}>Reset</Button>
    </>
  )
}

export function getStaticProps (): { props: Props } {
  return getFruits()
}
