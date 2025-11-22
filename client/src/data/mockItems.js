import lawnmower from '../assets/lawnmower.png'
import drill from '../assets/drillkit.png'
import projector from '../assets/projector.png'
import keyboard from '../assets/keyboard.png'
import stroller from '../assets/stroller.png'
import camping from '../assets/camping.png'

const items = [
  {
    id: "1",
    title: "Lawn Mower",
    description: "Well maintained, available for borrowing.",
    imageUrl: lawnmower,
    availability: "available",
  },
  {
    id: "2",
    title: "Baby Stroller",
    description: "Well maintained, available for borrowing.",
    imageUrl: stroller,
    availability: "requested",
  },
  {
    id: "3",
    title: "Drill Kit",
    description: "Well maintained, available for borrowing.",
    imageUrl: drill,
    availability: "available",
  },
  {
    id: "4",
    title: "Camping Tent",
    description: "Well maintained, available for borrowing.",
    imageUrl: camping,
    availability: "requested",
  },
  {
    id: "5",
    title: "Keyboard",
    description: "Well maintained, available for borrowing.",
    imageUrl: keyboard,
    availability: "available",
  },
  {
    id: "6",
    title: "Projector",
    description: "Well maintained, available for borrowing.",
    imageUrl: projector,
    availability: "available",
  },
]

export default items
