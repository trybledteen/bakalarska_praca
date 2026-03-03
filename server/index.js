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

  const query = `
  PREFIX dbo: <http://dbpedia.org/ontology/>
  PREFIX dbr: <http://dbpedia.org/resource/>
  PREFIX dbp: <http://dbpedia.org/property/>
  PREFIX dct: <http://purl.org/dc/terms/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

  SELECT ?description ?thumbnail ?manufacturer 
         (GROUP_CONCAT(DISTINCT ?subject; SEPARATOR="||") AS ?subjects)
         (GROUP_CONCAT(DISTINCT ?wikiLink; SEPARATOR="||") AS ?wikiLinks)
  WHERE {
    OPTIONAL { dbr:${dbpediaKey} dbo:description ?description . FILTER(LANG(?description) = 'en') }
    OPTIONAL { dbr:${dbpediaKey} dbo:thumbnail ?thumbnail }
    OPTIONAL { dbr:${dbpediaKey} dbp:manufacturer ?manufacturer . FILTER(LANG(?manufacturer) = 'en') }
    OPTIONAL { dbr:${dbpediaKey} dct:subject ?subject }
    OPTIONAL { dbr:${dbpediaKey} dbo:wikiPageWikiLink ?wikiLink }
  }
  GROUP BY ?description ?thumbnail ?manufacturer
  LIMIT 1
`

  try {
    const response = await axios.get(DBPEDIA_ENDPOINT, {
      params: {
        query,
        format: 'application/sparql-results+json',
      },
    })

    const bindings = response.data.results.bindings[0]

    if (!bindings) {
      return res.json({ description: null, thumbnail: null })
    }

    const subjects = bindings.subjects?.value
      ? bindings.subjects.value.split('||').map(s => s.replace('http://dbpedia.org/resource/Category:', '').replace(/_/g, ' '))
      : []
      
    const wikiLinks = bindings.wikiLinks?.value
      ? bindings.wikiLinks.value.split('||').slice(0, 5).map(s => s.replace('http://dbpedia.org/resource/', '').replace(/_/g, ' '))
      : []

    res.json({
      description: bindings.description?.value || null,
      thumbnail: bindings.thumbnail?.value || null,
      manufacturer: bindings.manufacturer?.value || null,
      categories: subjects,
      relatedEntities: wikiLinks,
    })
  } catch (error) {
    console.error('DBpedia error:', error.message)
    res.status(500).json({ error: 'DBpedia request failed' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})