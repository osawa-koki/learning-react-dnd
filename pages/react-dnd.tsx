import React, { useEffect, useState } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Button, ListGroup } from 'react-bootstrap'
import getFruits from '../src/getFruits'

interface Props {
  fruits: string[]
}

function Fruit (props: { fruit: string, index: number, moveFruit: (dragIndex: number, hoverIndex: number) => void }): React.JSX.Element {
  const { fruit, index, moveFruit } = props
  const ref = React.useRef<HTMLAnchorElement>(null)
  const [, drop] = useDrop({
    accept: 'fruit',
    hover (item: { index: number }, monitor) {
      if (ref.current == null) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) {
        return
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset?.y ?? 0
      if (dragIndex < hoverIndex && hoverClientY < hoverBoundingRect.top + hoverMiddleY) {
        return
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverBoundingRect.bottom - hoverMiddleY) {
        return
      }
      moveFruit(dragIndex, hoverIndex)
      item.index = hoverIndex
    }
  })
  const [{ isDragging }, drag] = useDrag({
    type: 'fruit',
    item: () => {
      return { fruit, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })
  const opacity = isDragging ? 0 : 1
  drag(drop(ref))
  return (
    <ListGroup.Item ref={ref} style={{ opacity }} role="button">
      {fruit}
    </ListGroup.Item>
  )
}

export default function ReactDndPage (props: Props): React.JSX.Element {
  const { fruits: presetFruits } = props

  const [fruits, setFruits] = useState<string[] | null>(null)

  function moveFruit (dragIndex: number, hoverIndex: number): void {
    if (fruits == null) {
      return
    }
    const dragFruit = fruits[dragIndex]
    const newFruits = [...fruits]
    newFruits.splice(dragIndex, 1)
    newFruits.splice(hoverIndex, 0, dragFruit)
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
    <DndProvider backend={HTML5Backend}>
      <h1>Drag and Drop Sort (React DnD)</h1>
      <ListGroup>
        {fruits.map((fruit, index) => (
          <Fruit key={fruit} fruit={fruit} index={index} moveFruit={moveFruit} />
        ))}
      </ListGroup>
      <hr />
      <Button onClick={() => { setFruits(presetFruits) }}>Reset</Button>
    </DndProvider>
  )
}

export function getStaticProps (): { props: Props } {
  return getFruits()
}
