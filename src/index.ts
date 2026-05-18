import express from 'express'
import type {Express, Request, Response} from 'express'
import type { Pet } from './data/pets'
import { pets } from './data/pets'
import cors from 'cors'

const PORT = 8000
const app:Express = express()

app.use(cors())

type PetQueryParams = {
  species?:string
  adopted?: "true" | "false"
  minAge?:string
  maxAge?:string
}

app.get('/', (
  req:Request<{}, unknown, {}, PetQueryParams>, 
  res:Response<Pet[]>
):void=> {
  const { species, adopted, minAge, maxAge } = req.query

  let filteredPets:Pet[] = pets
  
  if (species){
    filteredPets = filteredPets.filter((pet:Pet):boolean=>
      pet.species.toLowerCase() === species.toLowerCase()
    )
  }

  if (adopted){
    filteredPets = filteredPets.filter((pet:Pet):boolean=>
      String(pet.adopted).toLowerCase() === adopted.toLowerCase()
    )
  }

  if (minAge){
    filteredPets = filteredPets.filter((pet:Pet):boolean=>
      pet.age >= Number(minAge)
    )
  }

  if (maxAge){
    filteredPets = filteredPets.filter((pet:Pet):boolean=>
      pet.age <= Number(maxAge)
    )
  }

  res.json(filteredPets)
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