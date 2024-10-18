// Creamos const APP
const express = require("express")
const axios = require("axios")
const { readFile, readFileSync, writeFileSync } = require("fs")
const app = express()

// Levantamos puerto 3_000
const port = 3_000

// Levantamos APP dentro de PORT
app.listen(port, () => console.log(`Aplicación ejecutándose por el puerto ${port}`));

// Creamos URL BASE DE POKEMON
const URL_BASE_POKEMON = "https://pokeapi.co/api/v2/"

// Definimos rutas para mostrar Pokémon's, recibir parametros, capturar valores y tomarlo en la APP
app.get("/pokemon/add", async (req, res) => {
    // res.send("Agregando Pokémon's");
    const idPokemon = req.query.id_pokemon
    try {
        const contentFile = readFileSync(`${__dirname}/files/pokemon.txt`, "utf-8")
        const contentJS = JSON.parse(contentFile)
        const busqueda = contentJS.find(item => item.id == idPokemon)

        if (busqueda) {
            return res.status(409).json({mensaje: "Este Pokémon ya ha sido registrado en la Pokedex."})
        }

        const {data} = await axios.get(`${URL_BASE_POKEMON}/pokemon/${idPokemon}`)
        const pokemon = {id: idPokemon, ...data}
        contentJS.push(pokemon)
        writeFileSync(`${__dirname}/files/pokemon.txt`, JSON.stringify(contentJS), "utf-8")
        res.json({mensaje: "Este Pokémon ha sido registrado con éxito", data: pokemon})

    } catch (error) {
        console.log(error);
        res.status(500).json({mensaje: "Error Interno!"})
    }
})

app.get("/pokemon/list", (req, res) => {
    const contenido = readFileSync(`${__dirname}/files/pokemon.txt`, "utf-8")
    const contentJS = JSON.parse(contenido)
    contentJS.sort((a, b) => Number(a.id) - Number(b.id)) // Orden ascendente
    res.json({"message": "Listado de personajes registrados", "data": contentJS})
})
