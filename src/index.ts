import express from 'express'
import type {Express, Request, Response} from 'express'
import type { Pet } from './data/pets'
import { pets } from './data/pets'
import cors from 'cors'

const PORT = 8000
const app:Express = express()

app.use(cors())

app.get('/', (req: Request, res: Response)=> {
  res.json(pets)
})

app.get('/:id', (req: Request<{id:string}>, res: Response<Pet | {message: string}>):void => {
  const id = Number(req.params.id)
  const pet:Pet|undefined = pets.find((p:Pet):boolean => p.id === id)
  if (!pet) {
    res.status(404).json({ message: "Pet not found" })
    return
  }
  res.json(pet)
})

app.use((req, res)=>{
  res.status(404).json({message: "Endpoint not found"})
})

app.listen(PORT, ():void =>{
  console.log("Listening on port: ", PORT)
})