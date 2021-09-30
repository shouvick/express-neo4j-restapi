const neo4j = require("neo4j-driver")
const { nanoid } = require("nanoid");
require('dotenv').config()
const {
    DB_URL,
    DB_USERNAME,
    DB_PASSWORD,
    DATABASE,
} = process.env

const driver = neo4j.driver(DB_URL,neo4j.auth.basic(DB_USERNAME,DB_PASSWORD),{})
const session = driver.session({ DATABASE })

const findAll = async () => {
    const result = await session.run(`Match (u:User) return u`)
    return result.records.map(i=>i.get('u').properties)
}

const findById = async (id) => {
    const result = await session.run(`Match (u:User {_id : '${id}'}) return u`)
    return result.records[0].get('u').properties
}

const create = async (user) => {
    const result = await session.run(`CREATE (u:User {_id : '${nanoid(8)}', name: '${user.name}', email: '${user.email}', password: '${user.password}'}) return u`)
    return result.records[0].get('u').properties
}

const findByIdAndUpdate = async (id, user) => {
    const result = await session.run(`Match (u:User {_id : '${id}'}) SET u.name = '${user.name}', u.email = '${user.email}', u.password = '${user.password}' return u`)
    return result.records[0].get('u').properties
}

const findByIdAndDelete = async (id) => {
    await session.run(`Match (u:User {_id : '${id}'}) DELETE u`)
    return await findAll()
}


export default {
    findAll,
    findById,
    create,
    findByIdAndUpdate,
    findByIdAndDelete
}