const mariadb = require('mariadb')
const config = require('../config/app.config')
const pool = mariadb.createPool(config.db)
class _database {
    escapeUndefined = (value) => {
        if(!(value instanceof Object)) {
            return value === undefined ? null : value
        }

        for (let key in value) {
            if(value[key] === undefined) {
                value[key] = null
            }
        }

        return value
    }

    query = async (sql, params, insertIdAsNumber = true, stripMeta = true, dataStrings = true) => {
        let conn
        try {
            conn = await pool.getConnection()

            const res = await conn.query({sql, insertIdAsNumber, dataStrings}, params)

            // if (stripMeta) {
            //     delete res.meta
            // }

            return res
        } catch (err) {
            throw err
        }finally {
            if (conn)  conn.release()
        }
    }
}

module.exports = new _database()