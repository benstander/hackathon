require('dotenv').config()

const express = require('express')
const cors = require('cors')
const financeRoutes = require('./routes/finance')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/finance', financeRoutes)

const Port = process.env.PORT || 3000;
app.listen(PORT, () => console.log('hello'))