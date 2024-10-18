// Creamos const APP
const express = require("express")
const axios = require("axios")
const { readFile, readFileSync, writeFileSync } = require("fs")
const app = express()

// Levantamos puerto 3_000
const port = 3_000

// Levantamos APP dentro de PORT (ESCUCHA, CALLBACK QUE SE EJECUTA CUANDO LA APP SE LEVANTE)
app.listen(port, () => console.log(`Aplicación ejecutándose por el puerto ${port}`));

// Creamos URL BASE DE POKEMON
const URL_BASE_POKEMON = "https://pokeapi.co/api/v2/"

// Definimos rutas para mostrar Pokémon's, recibir parametros, capturar valores y tomarlo en la APP
app.get("/pokemon/add", async (req, res) => {
    // res.send("Agregando Pokémon's");
    // CAPTURAMOS PARAMETROS DESDE LA URL
    const idPokemon = req.query.id_pokemon
    try {
        const contentFile = readFileSync(`${__dirname}/files/pokemon.txt`, "utf-8")
        const contentJS = JSON.parse(contentFile)
        const busqueda = contentJS.find(item => item.id == idPokemon)

        if (busqueda) {
            return res.status(409).json({mensaje: "Este Pokémon ya ha sido registrado en la Pokédex.", "data": idPokemon})
        }

        const {data} = await axios.get(`${URL_BASE_POKEMON}/pokemon/${idPokemon}`)
        const pokemon = {id: idPokemon, ...data}
        contentJS.push(pokemon)
        writeFileSync(`${__dirname}/files/pokemon.txt`, JSON.stringify(contentJS), "utf-8")
        res.json({mensaje: "Este Pokémon ha sido registrado con éxito", "data": pokemon})

    } catch (error) {
        console.log(error);
        res.status(500).json({mensaje: "Error Interno!"})
    }
})

// Para enlistar los datos de la APP
app.get("/pokemon/list", (req, res) => {
    const contenido = readFileSync(`${__dirname}/files/pokemon.txt`, "utf-8")
    let contentJS = JSON.parse(contenido)
    // contentJS.sort((a, b) => Number(a.id) - Number(b.id)) // Orden ascendente
    contentJS = contentJS.map(item => {
        return {
            id: item.id,
            name: item.name,
            order: item.order,
            weight: item.weight,
            height: item.height || '-'
        }
    })
    res.json({"message": "Listado de personajes registrados", "data": contentJS})
})

app.get("/pokemon/detalles", (req, res) => {
    const idPokemon = req.query.id_pokemon;
    const contentFile = readFileSync(`${__dirname}/files/pokemon.txt`, "utf-8");
    const contentJS = JSON.parse(contentFile);
    const busqueda = contentJS.find(item => item.id == idPokemon)

    if (busqueda) {
        
        res.json({message: "Datos del Pokémon", "data": busqueda})
    }else{
        return res.status(404).json({mensaje: "Este Pokémon no está registrado en la Pokédex.", "data": idPokemon})
    }


    
})