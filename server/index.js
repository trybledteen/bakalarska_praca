import express from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

const DBPEDIA_ENDPOINT = 'https://dbpedia.org/sparql'

app.get('/api/product/:dbpediaKey', async (req, res) => {
  const { dbpediaKey } = req.params
  const decodedKey = decodeURIComponent(dbpediaKey)

  const query = `
  PREFIX dbo: <http://dbpedia.org/ontology/>
  PREFIX dct: <http://purl.org/dc/terms/>

  SELECT ?description ?abstract
         (GROUP_CONCAT(DISTINCT ?subject; SEPARATOR="||") AS ?subjects)
  WHERE {
    OPTIONAL { <http://dbpedia.org/resource/${decodedKey}> dbo:description ?description . FILTER(LANG(?description) = 'en') }
    OPTIONAL { <http://dbpedia.org/resource/${decodedKey}> dbo:abstract ?abstract . FILTER(LANG(?abstract) = 'en') }
    OPTIONAL { <http://dbpedia.org/resource/${decodedKey}> dct:subject ?subject }
  }
  GROUP BY ?description ?abstract
`

  try {
    const response = await axios.get(DBPEDIA_ENDPOINT, {
      params: {
        query,
        format: 'application/sparql-results+json',
      },
      timeout: 10000,
    })

    const bindings = response.data.results.bindings[0]

    if (!bindings) {
      return res.json({ description: null, thumbnail: null })
    }

    const subjects = bindings.subjects?.value
      ? bindings.subjects.value.split('||').map(s => s.replace('http://dbpedia.org/resource/Category:', '').replace(/_/g, ' '))
      : []

    res.json({
      description: bindings.abstract?.value || bindings.description?.value || null,
      categories: subjects,
      dbpediaUrl: `https://dbpedia.org/page/${decodedKey}`,
    })
  } catch (error) {
    console.error('DBpedia error:', error.message)
    res.status(500).json({ error: 'DBpedia request failed' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})