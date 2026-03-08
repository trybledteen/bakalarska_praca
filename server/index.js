import express from 'express'
import axios from 'axios'
import cors from 'cors'
import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const app = express()
app.use(cors())
app.use(express.json())


const db = await mysql.createPool({
  host:     'localhost',
  user:     'root',
  password: '',
  database: 'sneaker_eshop',
  waitForConnections: true,
})

await db.execute(`
  CREATE TABLE IF NOT EXISTS users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`)

await db.execute(`
  CREATE TABLE IF NOT EXISTS orders (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`)

await db.execute(`
  CREATE TABLE IF NOT EXISTS order_items (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    order_id   INT NOT NULL,
    product_id INT NOT NULL,
    title      VARCHAR(200) NOT NULL,
    price      DECIMAL(10,2) NOT NULL,
    size       VARCHAR(10),
    quantity   INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
  )
`)

console.log('[MySQL] Tables ready')


const JWT_SECRET = 'sneaker_eshop_secret_key'

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ error: 'No token' })
  const token = header.split(' ')[1]
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}


app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields are required' })

  try {
    const hashed = await bcrypt.hash(password, 10)
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashed]
    )
    const token = generateToken(result.insertId)
    res.json({ token, user: { id: result.insertId, name, email } })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(400).json({ error: 'Email already exists' })
    res.status(500).json({ error: 'Server error' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ error: 'All fields are required' })

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email])
    const user = rows[0]
    if (!user) return res.status(400).json({ error: 'Invalid email or password' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ error: 'Invalid email or password' })

    const token = generateToken(user.id)
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const [rows] = await db.execute(
    'SELECT id, name, email, created_at FROM users WHERE id = ?',
    [req.user.userId]
  )
  res.json(rows[0])
})


app.post('/api/orders', authMiddleware, async (req, res) => {
  const { items, totalPrice } = req.body
  if (!items || !items.length)
    return res.status(400).json({ error: 'Cart is empty' })

  try {
    const [order] = await db.execute(
      'INSERT INTO orders (user_id, total_price) VALUES (?, ?)',
      [req.user.userId, totalPrice]
    )
    const orderId = order.insertId

    for (const item of items) {
      await db.execute(
        'INSERT INTO order_items (order_id, product_id, title, price, size, quantity) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.id, item.title, item.price, item.size, item.quantity]
      )
    }

    res.json({ success: true, orderId })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

app.get('/api/orders', authMiddleware, async (req, res) => {
  try {
    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.userId]
    )

    for (const order of orders) {
      const [items] = await db.execute(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      )
      order.items = items
    }

    res.json(orders)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})


const SPARQL_ENDPOINT = 'https://dbpedia.org/sparql'

const BRAND_URIS = {
  'adidas':           'http://dbpedia.org/resource/Adidas',
  'nike':             'http://dbpedia.org/resource/Nike,_Inc.',
  'nike,_inc.':       'http://dbpedia.org/resource/Nike,_Inc.',
  'puma':             'http://dbpedia.org/resource/Puma_(brand)',
  'puma_(brand)':     'http://dbpedia.org/resource/Puma_(brand)',
  'reebok':           'http://dbpedia.org/resource/Reebok',
  'asics':            'http://dbpedia.org/resource/Asics',
  'vans':             'http://dbpedia.org/resource/Vans',
  'vans_(brand)':     'http://dbpedia.org/resource/Vans',
  'converse':         'http://dbpedia.org/resource/Converse_(brand)',
  'converse_(brand)': 'http://dbpedia.org/resource/Converse_(brand)',
  'new_balance':      'http://dbpedia.org/resource/New_Balance',
  'newbalance':       'http://dbpedia.org/resource/New_Balance',
}

const FALLBACK_DATA = {
  'adidas':           { founder: 'Adolf Dassler' },
  'nike':             { founder: 'Bill Bowerman, Phil Knight' },
  'nike,_inc.':       { founder: 'Bill Bowerman, Phil Knight' },
  'puma':             { foundedYear: 1948, founder: 'Rudolf Dassler' },
  'puma_(brand)':     { foundedYear: 1948, founder: 'Rudolf Dassler' },
  'asics':            { founder: 'Kihachiro Onitsuka' },
  'vans':             { founder: 'Paul Van Doren' },
  'vans_(brand)':     { founder: 'Paul Van Doren' },
  'converse':         { foundedYear: 1908, website: 'https://www.converse.com/' },
  'converse_(brand)': { foundedYear: 1908, website: 'https://www.converse.com/' },
  'new_balance':      { foundedYear: 1906, location: 'Boston, Massachusetts, U.S.' },
  'newbalance':       { foundedYear: 1906, location: 'Boston, Massachusetts, U.S.' },
}

function cleanUrl(raw) {
  if (!raw) return null
  const decoded = raw.replace(/%7C/gi, '|')
  const first = decoded.split('|')[0].trim()
  return (first.startsWith('http://') || first.startsWith('https://')) ? first : null
}

function extractYear(raw) {
  if (!raw) return null
  const match = raw.match(/^(\d{4})/)
  return match ? parseInt(match[1]) : null
}

function isUri(value) {
  if (!value) return false
  return value.startsWith('http://dbpedia.org/') || value.startsWith('dbr:') || value.startsWith('dbo:')
}

function buildDescriptionQuery(brandUri) {
  return `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    SELECT ?v WHERE {
      { <${brandUri}> dbo:abstract ?v . FILTER(LANG(?v) = 'en') }
      UNION
      { <${brandUri}> dbo:description ?v . FILTER(LANG(?v) = 'en') }
    }
    LIMIT 1
  `
}

function buildFoundedQuery(brandUri) {
  return `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dbp: <http://dbpedia.org/property/>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?v WHERE {
      { <${brandUri}> dbo:foundingDate ?v . FILTER(DATATYPE(?v) = xsd:date) }
      UNION { <${brandUri}> dbo:foundingYear ?v . FILTER(DATATYPE(?v) = xsd:gYear) }
      UNION { <${brandUri}> dbp:foundation ?v . FILTER(DATATYPE(?v) = xsd:date || DATATYPE(?v) = xsd:gYear) }
      UNION { <${brandUri}> dbp:founded ?v . FILTER(DATATYPE(?v) = xsd:date || DATATYPE(?v) = xsd:gYear) }
    }
    LIMIT 1
  `
}

function buildLocationQuery(brandUri) {
  return `
    PREFIX dbp: <http://dbpedia.org/property/>
    SELECT ?v WHERE {
      { <${brandUri}> dbp:hqLocation ?v . FILTER(isLiteral(?v) && LANG(?v) = 'en') }
      UNION { <${brandUri}> dbp:locationCity ?v . FILTER(isLiteral(?v) && LANG(?v) = 'en') }
      UNION { <${brandUri}> dbp:location ?v . FILTER(isLiteral(?v) && LANG(?v) = 'en') }
      UNION { <${brandUri}> dbp:hqLocationCity ?v . FILTER(isLiteral(?v) && LANG(?v) = 'en') }
      UNION { <${brandUri}> dbp:locationCountry ?v . FILTER(isLiteral(?v) && LANG(?v) = 'en') }
    }
    LIMIT 5
  `
}

function buildWebsiteQuery(brandUri) {
  return `
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dbp:  <http://dbpedia.org/property/>
    SELECT ?v WHERE {
      { <${brandUri}> foaf:homepage ?v . }
      UNION { <${brandUri}> dbp:homepage ?v . }
      UNION { <${brandUri}> dbp:website ?v . }
    }
    LIMIT 3
  `
}

function buildFounderQuery(brandUri) {
  return `
    PREFIX dbp: <http://dbpedia.org/property/>
    SELECT ?v WHERE {
      <${brandUri}> dbp:founder ?v .
      FILTER(isLiteral(?v) && LANG(?v) = 'en')
    }
    LIMIT 3
  `
}

function buildCategoriesQuery(brandUri) {
  return `
    PREFIX dct: <http://purl.org/dc/terms/>
    SELECT ?v WHERE { <${brandUri}> dct:subject ?v . }
    LIMIT 20
  `
}

async function sparqlFetch(query, label) {
  const config = {
    params: { query, format: 'application/sparql-results+json' },
    headers: { Accept: 'application/sparql-results+json', 'User-Agent': 'SneakerEshop/1.0' },
    timeout: 30000,
  }
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await axios.get(SPARQL_ENDPOINT, config)
      return res.data?.results?.bindings || []
    } catch (err) {
      if (attempt === 2) throw err
      console.warn(`[DBpedia] Attempt ${attempt} failed (${label}), retrying...`)
      await new Promise(r => setTimeout(r, 2000))
    }
  }
}

app.get('/api/brand/:brandKey', async (req, res) => {
  const brandKey = req.params.brandKey.toLowerCase()
  const brandUri = BRAND_URIS[brandKey]

  if (!brandUri) {
    console.warn(`[DBpedia] Unknown brand key: "${brandKey}"`)
    return res.status(404).json({ error: `Unknown brand key: "${brandKey}"` })
  }

  try {
    const [descRows, foundedRows, locationRows, websiteRows, founderRows, categoryRows] = await Promise.all([
      sparqlFetch(buildDescriptionQuery(brandUri), `${brandKey}:desc`),
      sparqlFetch(buildFoundedQuery(brandUri),     `${brandKey}:founded`),
      sparqlFetch(buildLocationQuery(brandUri),    `${brandKey}:location`),
      sparqlFetch(buildWebsiteQuery(brandUri),     `${brandKey}:website`),
      sparqlFetch(buildFounderQuery(brandUri),     `${brandKey}:founder`),
      sparqlFetch(buildCategoriesQuery(brandUri),  `${brandKey}:categories`),
    ])

    const description = descRows[0]?.v?.value || null

    let foundedYear = null
    for (const row of foundedRows) {
      const year = extractYear(row?.v?.value)
      if (year) { foundedYear = year; break }
    }

    let location = null
    for (const row of locationRows) {
      const raw = row?.v?.value
      if (!raw || isUri(raw) || /^\d+$/.test(raw.trim())) continue
      if (raw.trim().length > 2) { location = raw.trim(); break }
    }

    let website = null
    for (const row of websiteRows) {
      const cleaned = cleanUrl(row?.v?.value)
      if (cleaned) { website = cleaned; break }
    }

    const fallback = FALLBACK_DATA[brandKey] || {}
    if (!foundedYear && fallback.foundedYear) foundedYear = fallback.foundedYear
    if (!location   && fallback.location)    location   = fallback.location
    if (!website    && fallback.website)     website    = fallback.website

    let founder = founderRows[0]?.v?.value || fallback.founder || null

    console.log(`[DBpedia] OK "${brandKey}" — year:${foundedYear} loc:${location} web:${website} founder:${founder}`)

    const ALLOWED_KEYWORDS = ['shoe', 'sport', 'clothing', 'footwear', 'skateboard', 'surfwear', 'snowboard', 'swimwear', 'apparel', 'athletic', 'manufacturer']
    const BLOCKED_KEYWORDS = ['fashion', 'establishment', 'listed', 'stock', 'bankruptcy', 'merger', 'acquisition', 'headquartered', 'based_in', 'initial_public', 'privately_held', 'multinational']

    const categories = categoryRows
      .map(row => {
        const uri = row?.v?.value || ''
        const match = uri.match(/Category:(.+)$/)
        if (!match) return null
        return match[1].replace(/_/g, ' ')
      })
      .filter(label => {
        if (!label) return false
        const lower = label.toLowerCase()
        return ALLOWED_KEYWORDS.some(k => lower.includes(k)) && !BLOCKED_KEYWORDS.some(k => lower.includes(k))
      })

    return res.json({ description, foundedYear, location, website, founder, dbpediaUrl: brandUri, categories })

  } catch (err) {
    console.error(`[DBpedia] Error for "${brandKey}":`, err.message)
    return res.status(500).json({ error: 'Failed to fetch brand data from DBpedia' })
  }
})


app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))