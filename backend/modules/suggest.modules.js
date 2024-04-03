const mysql = require('../helpers/database')
const Joi = require('joi')

class _suggest {
    
    //add suggest new book
    addSuggest = async (borrowernumber, body) => {
        try {

            body = {
                suggestedby: borrowernumber,
                title: body.title,
                author: body.author,
                publishercode: body.publishercode,
                note: body.note
            }

            // console.log(borrowernumber)

            const schema = Joi.object({
                suggestedby: Joi.number().required(),
                title: Joi.string().required(),
                author: Joi.string().required(),
                publishercode: Joi.string().required(),
                note: Joi.string().optional()
            })

            const validation = schema.validate(body)

            if(validation.error){
                const errorDetails = validation.error.details.map(detail => detail.message)
                return {
                    status: false,
                    code: 400,
                    error: errorDetails.join(', ')
                }
            }

            const check = await mysql.query("SELECT p.cardnumber, p.surname, p.dateexpiry FROM koha.borrowers p WHERE p.borrowernumber = ?", [borrowernumber])



            if(check.length < 0) {
                return {
                    status: false,
                    code: 404,
                    error: 'User not found'
                }
            }

            const add = await mysql.query("INSERT INTO koha.suggestions(suggestedby,suggesteddate,STATUS,note,author,title,publishercode,date,branchcode) VALUES (?,CURDATE(),'ASKED',?,?,?,?,NOW(),'PUSAT')",
            [body.suggestedby, body.note, body.author, body.title, body.publishercode]);


            if(add.affectedRows < 0) {
                return {
                    status: false,
                    code: 404,
                    error: 'Add suggest failed'
                }
            }

            return {
                status: true,
                code: 201,
                data: add
            }

        } catch (error){
            console.error("Add suggest module Error: ", error)
            return {
                status: false,
                error
            }
        }
    }



    updateSuggest = async (borrowernumber, body) => {
        try {

            body = {
                suggestedby: borrowernumber,
                suggestionid: body.suggestionid,
                title: body.title,
                author: body.author,
                publishercode: body.publishercode,
                note: body.note
            }

            const schema = Joi.object({
                suggestedby: Joi.number().required(),
                suggestionid: Joi.number().required(),
                title: Joi.string().optional(),
                author: Joi.string().optional(),
                publishercode: Joi.string().optional(),
                note: Joi.string().optional()
            })

            const validation = schema.validate(body)

            if(validation.error){
                const errorDetails = validation.error.details.map(detail => detail.message)
                return {
                    status: false,
                    code: 400,
                    error: errorDetails.join(', ')
                }
            }

            const update = await mysql.query("UPDATE koha.suggestions SET note = ?, author = ?, title = ?, publishercode = ? WHERE suggestedby = ? AND suggestionid = ?",
            [body.note, body.author, body.title, body.publishercode, body.suggestedby, body.suggestionid]);

            if(update.affectedRows < 0) {
                return {
                    status: false,
                    code: 404,
                    error: 'Update suggest failed'
                }
            }

            return {
                status: true,
                code: 201,
                data: update
            }
        } catch (error){
            console.error("Update suggest module Error: ", error)
            return {
                status: false,
                error
            }
        }
    }



    deleteSuggest = async (borrowernumber, suggestionid) => {  
        try {

            const body = {
                suggestedby: borrowernumber,
                suggestionid: suggestionid
            }

            const schema = Joi.object({
                suggestedby: Joi.number().required(),
                suggestionid: Joi.number().required(),
            })

            const validation = schema.validate(body)

            if(validation.error){
                const errorDetails = validation.error.details.map(detail => detail.message)
                return {
                    status: false,
                    code: 400,
                    error: errorDetails.join(', ')
                }
            }

            const del = await mysql.query("DELETE FROM koha.suggestions WHERE suggestedby = ? AND suggestionid = ?",
            [body.suggestedby, body.suggestionid]);

            if(del.affectedRows < 0) {
                return {
                    status: false,
                    code: 404,
                    error: 'Delete suggest failed'
                }
            }

            return {
                status: true,
                code: 201,
                data: del
            }
        } catch (error){
            console.error("Delete suggest module Error: ", error)
            return {
                status: false,
                error
            }
        }
    }

    

    listMySuggest = async (borrowernumber) => {
        try {
            const schema = Joi.number().required()

            const validation = schema.validate(borrowernumber)

            if(validation.error){
                const errorDetails = validation.error.details.map(detail => detail.message)

                return {
                    status: false,
                    code: 400,
                    error: errorDetails.join(', ')
                }
            }

            const list = await mysql.query("SELECT s.suggestionid, i.surname, s.suggesteddate, s.title, s.author, s.publishercode, s.STATUS, s.note FROM koha.suggestions s LEFT JOIN koha.borrowers i ON s.suggestedby = i.borrowernumber WHERE s.suggestedby = ?",
            [borrowernumber])

            if(list.length < 0) {
                return {
                    status: false,
                    code: 404,
                    error: 'Data not found'
                }
            }

            return {
                status: true,
                code: 200,
                data: list
            }

        }catch (error){
            console.error("List suggest module Error: ", error)
            return {
                status: false,
                error
            }
        }
    }

    listDetailMySuggest = async (borrowernumber, suggestionid) => {
        try {

            const body = {
                borrowernumber,
                suggestionid
            }

            const schema = Joi.object({
                borrowernumber: Joi.number().required(),
                suggestionid: Joi.number().required()
            })

            const validation = schema.validate(body)

            if(validation.error){
                const errorDetails = validation.error.details.map(detail => detail.message)

                return {
                    status: false,
                    code: 400,
                    error: errorDetails.join(', ')
                }
            }

            const list = await mysql.query("SELECT s.suggestionid, i.surname, s.suggesteddate, s.title, s.author, s.publishercode, s.STATUS, s.note FROM koha.suggestions s LEFT JOIN koha.borrowers i ON s.suggestedby = i.borrowernumber WHERE s.suggestedby = ? AND s.suggestionid = ?",
            [borrowernumber, suggestionid])

            if(list.length < 0) {
                return {
                    status: false,
                    code: 404,
                    error: 'Data not found'
                }
            }

            return {
                status: true,
                code: 200,
                message: 'Data detail suggest found',
                data: list
            }
        }catch (error){
            console.error("List detail suggest module Error: ", error)
            return {
                status: false,
                error
            }
        }
    }
}

module.exports = new _suggest()