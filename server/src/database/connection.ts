import knex from 'knex'
import knexfile from '../../knexfile'


const environment = process.env.ENVIRONMENT || 'development'
const config = (environment == 'development' ? knexfile.development : knexfile.production)

const connection = knex(config)

export default connection;