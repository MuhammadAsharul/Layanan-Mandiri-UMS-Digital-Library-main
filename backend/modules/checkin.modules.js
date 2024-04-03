const mysql = require('../helpers/database')
const Joi = require('joi')

class _checkin {
    
    checkMyIssues = async (barcode) => {
        try {
            const body = {
                barcode
            }

            const schema = Joi.object({
                barcode: Joi.string().required()
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

            BigInt.prototype.toJSON = function() {
                return this.toString()
            }

            const list = await mysql.query("SELECT i.date_due, b2.title, b2.author, bi.publishercode, ac.amountoutstanding, i2.barcode, i.issuedate, i.renewals, i.lastreneweddate  from koha.issues as i LEFT JOIN koha.borrowers as b on i.borrowernumber=b.borrowernumber LEFT JOIN koha.items as i2 on i2.itemnumber=i.itemnumber LEFT JOIN koha.biblio as b2 on b2.biblionumber=i2.biblionumber LEFT JOIN koha.accountlines as ac on ac.issue_id = i.issue_id  LEFT JOIN koha.biblioitems as bi on bi.biblionumber=i2.biblionumber where i2.barcode = ?",
            [body.barcode]);

            return {
                status: true,
                data: list
            }
        } catch (error){
            console.error("Check Check My Issue module Error: ", error)
            return {
                status: false,
                code: 400,
                error
            }
        }
    }


    
    addChekin = async (body) => {

        console.log("data barcode body", body)
        try {

            body = {
                ...body
            }

            const schema = Joi.object({
                data: Joi.array().items(Joi.object({
                    barcode: Joi.string().required()
                }))
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

            const result = []

            for(let i = 0; i < body.data.length; i++) {

                console.log("data barcode mappp", body.data[i].barcode)

                const list = await mysql.query("SELECT b.borrowernumber, i.issue_id ,i.itemnumber, i.date_due, i.branchcode, i.lastreneweddate ,i.renewals, i.auto_renew, i.issuedate, i2.itype , i2.ccode, i2.location, i.onsite_checkout FROM koha.borrowers b LEFT JOIN koha.issues i ON i.borrowernumber = b.borrowernumber LEFT JOIN koha.items i2 ON i2.itemnumber = i.itemnumber WHERE i.branchcode= 'PUSAT' AND i2.barcode = ?",
                [body.data[i].barcode])

                console.log("list ", list)
    
                const add_old_issues = await mysql.query("INSERT INTO koha.old_issues (issue_id, borrowernumber, itemnumber, date_due, branchcode, returndate, lastreneweddate ,renewals, auto_renew, issuedate, onsite_checkout) VALUES ( ?, ?, ?, ?, ?, now(), ?, ?, ?, ?, ?)",
                [list[0].issue_id, list[0].borrowernumber, list[0].itemnumber, list[0].date_due, list[0].branchcode, list[0].lastreneweddate, list[0].renewals, list[0].auto_renew, list[0].date_due, list[0].onsite_checkout]);
    
                const addPending = await mysql.query("INSERT INTO koha.issues_pending (issue_id, borrowernumber, itemnumber, date_due, branchcode, returndate, lastreneweddate ,renewals, auto_renew, issuedate, onsite_checkout, status) VALUES (? , ?, ?, ?, ?, now(), ?, ?, ?, ?, ?, 'CHECKIN PENDING')",
                [list[0].issue_id,list[0].borrowernumber, list[0].itemnumber, list[0].date_due, list[0].branchcode, list[0].lastreneweddate, list[0].renewals, list[0].auto_renew, list[0].date_due, list[0].onsite_checkout]);
    
                const addStatisticCheckin = await mysql.query("INSERT INTO koha.statistics (datetime, branch, value , type,  other, itemnumber, itemtype, borrowernumber, location, ccode ) VALUES (now(), ? ,0.00,'return','', ?, ?, ?, ?, ?)",
                [list[0].branchcode,list[0].itemnumber, list[0].itype, list[0].borrowernumber, list[0].location, list[0].ccode]) 
    
                const action_logs = await mysql.query("INSERT INTO koha.action_logs (timestamp, user, module, action, object, info, interface) VALUES (now(), '149665', 'CIRCULATION', 'RETURN', ?, ?, 'intranet')",
                [list[0].borrowernumber, list[0].itemnumber])

                if(add_old_issues.affectedRows > 0 && addPending.affectedRows > 0 && addStatisticCheckin.affectedRows > 0 && action_logs.affectedRows > 0) {
                    result.push({
                        status: true,
                        data: body.data[i].barcode,
                        message: "Checkin Success"
                    })
                } else {
                    result.push({
                        status: false,
                        message: "Checkin Failed"
                    })
                    console.log("add checkin failed")
                }
        
            }

            return {
                status: true,
                data : result
            }

        }catch (error){
            console.error("Checkin Pending module Error: ", error)
            return {
                status: false,
                error
            }
        }
    }

    updateItemsChekin = async (body) => {
        try {
            body = {
                ...body
            }

            const schema = Joi.object({
                data: Joi.array().items(Joi.object({
                    barcode: Joi.string().required()
                }))
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

            const result = []

            for(let i = 0; i < body.data.length; i++) {

                const list = await mysql.query("SELECT b.borrowernumber, i.issue_id ,i.itemnumber FROM koha.borrowers b LEFT JOIN koha.issues i ON i.borrowernumber = b.borrowernumber LEFT JOIN koha.items i2 ON i2.itemnumber = i.itemnumber WHERE i.branchcode= 'PUSAT' AND i2.barcode = ?",
                [body.data[i].barcode]);

                const updateIssues = await mysql.query("UPDATE koha.issues SET returndate = now() WHERE issue_id = ?",
                [list[0].issue_id])

                const updateItems = await mysql.query("UPDATE koha.items SET onloan = NULL WHERE itemnumber = ?",
                [list[0].itemnumber])

                if(updateIssues.affectedRows > 0 && updateItems.affectedRows > 0) {
                    result.push({
                        status: true,
                        data: body.data[i].barcode,
                        message: "Update Checkin Success"
                    })
                }else {
                    result.push({
                        status: false,
                        message: "Checkin Failed"
                    })
                    console.log("update checkin failed")
                }

            }

            return {
                status: true,
                data : result
            }
        
        } catch (error) {
            console.error("Update Checkin module Error: ", error)
            return {
                status: false,
                error
            }
        }
    }


    deleteIssues = async (body) => {
        try {
            body = {
                data : body
            }

            const schema = Joi.object({
                data: Joi.array().items(Joi.object({
                    barcode: Joi.string().required()
                }))
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

            const result = []

            for(let i = 0; i < body.data.length; i++) {

                const list = await mysql.query("SELECT b.borrowernumber, i.issue_id ,i.itemnumber FROM koha.borrowers b LEFT JOIN koha.issues i ON i.borrowernumber = b.borrowernumber LEFT JOIN koha.items i2 ON i2.itemnumber = i.itemnumber WHERE i.branchcode= 'PUSAT' AND i2.barcode = ?",
                [body.data[i].barcode]);

                const deleteIssues = await mysql.query("DELETE FROM koha.issues WHERE issue_id = ?",
                [list[0].issue_id])

                if(deleteIssues.affectedRows > 0) {
                    result.push({
                        status: true,
                        data: body.data[i].barcode,
                        message: "Delete Checkin Success"
                    })

                }else {
                    result.push({
                        status: false,
                        message: "Checkin Failed"
                    })
                    console.log("delete checkin failed")
                }

            }

            return {
                status : true,
                data : result
            }
        } catch (error) {
            console.error("Delete Checkin module Error: ", error)
            return {
                status: false,
                error
            }
        }
    }


    
    // list all pending checkin can be accessed by admin
    listPending = async (userid) => {
        try {

            const schema = Joi.string().required()

            const validation = schema.validate(userid)

            if(validation.error){
                const errorDetails = validation.error.details.map(detail => detail.message)
                return {
                    status: false,
                    code: 400,
                    error: errorDetails.join(', ')
                }
            }

            const list = await mysql.query("SELECT b.surname, i2.barcode ,b1.title, i.renewals, i.returndate, i.status FROM koha.borrowers b LEFT JOIN koha.issues_pending i ON i.borrowernumber = b.borrowernumber LEFT JOIN koha.items i2 ON i2.itemnumber = i.itemnumber LEFT JOIN koha.biblio b1 ON b1.biblionumber = i2.biblionumber WHERE i.status = 'CHECKIN PENDING'")

            list.map(item => {
                item.returndate = new Date(item.returndate).toLocaleDateString('id-ID', {year: 'numeric', month: 'long', day: 'numeric'})
            })

            return {
                status: true,
                data: list
            }

        }catch (error){
            console.error("List Pending module Error: ", error)
            return {
                status: false,
                error
            }
        }
    }


    // list all success checkin can be accessed by admin
    listSuccess = async (userid) => {
            try {
    
                const schema = Joi.string().required()
    
                const validation = schema.validate(userid)
    
                if(validation.error){
                    const errorDetails = validation.error.details.map(detail => detail.message)
                    return {
                        status: false,
                        code: 400,
                        error: errorDetails.join(', ')
                    }
                }
    
                const list = await mysql.query("SELECT b.surname, i2.barcode ,b1.title, i.renewals, i.returndate, i.status FROM koha.borrowers b LEFT JOIN koha.issues_pending i ON i.borrowernumber = b.borrowernumber LEFT JOIN koha.items i2 ON i2.itemnumber = i.itemnumber LEFT JOIN koha.biblio b1 ON b1.biblionumber = i2.biblionumber WHERE i.status = 'CHECKIN SUCCESS'")
    
                list.map(item => {
                    item.returndate = new Date(item.returndate).toLocaleDateString('id-ID', {year: 'numeric', month: 'long', day: 'numeric'})
                })
    
                return {
                    status: true,
                    data: list
                }
    
            }catch (error){
                console.error("List Pending module Error: ", error)
                return {
                    status: false,
                    error
                }
            }
    }

    listMyChekin = async (cardnumber) => {
        try {

            const schema = Joi.string().required()

            const validation = schema.validate(cardnumber)

            if(validation.error){
                const errorDetails = validation.error.details.map(detail => detail.message)
                return {
                    status: false,
                    code: 400,
                    error: errorDetails.join(', ')
                }
            }

            const list = await mysql.query("SELECT b.surname, b1.title, i.renewals, i.returndate FROM koha.borrowers b LEFT JOIN koha.old_issues i ON i.borrowernumber = b.borrowernumber LEFT JOIN koha.items i2 ON i2.itemnumber = i.itemnumber LEFT JOIN koha.biblio b1 ON b1.biblionumber = i2.biblionumber WHERE  b.cardnumber = ?;",
            [cardnumber])

            return {
                status: true,
                data: list
            }

        }catch (error){
            console.error("List Pending module Error: ", error)
            return {
                status: false,
                error
            }
        }
    }

    listMyChekin = async (cardnumber) => {
        try {

            const schema = Joi.string().required()

            const validation = schema.validate(cardnumber)

            if(validation.error){
                const errorDetails = validation.error.details.map(detail => detail.message)
                return {
                    status: false,
                    code: 400,
                    error: errorDetails.join(', ')
                }
            }

            const list = await mysql.query("SELECT b.surname, b1.title, i.renewals, i.returndate FROM koha.borrowers b LEFT JOIN koha.old_issues i ON i.borrowernumber = b.borrowernumber LEFT JOIN koha.items i2 ON i2.itemnumber = i.itemnumber LEFT JOIN koha.biblio b1 ON b1.biblionumber = i2.biblionumber WHERE  b.cardnumber = ?;",
            [cardnumber])

            return {
                status: true,
                data: list
            }

        }catch (error){
            console.error("List Pending module Error: ", error)
            return {
                status: false,
                error
            }
        }
    }

    checkDropbox = async (userid, barcode) => {
        try {

            const body = {
                userid,
                barcode
            }

            const schema = Joi.object({
                userid: Joi.string().required(),
                barcode: Joi.string().required(),
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

            const checkBarcode = await mysql.query("SELECT itemnumber FROM koha.items WHERE barcode = ?",
            [body.barcode])

            if(checkBarcode.length === 0) {
                return {
                    status: false,
                    message: "Barcode Not Found"
                }
            }

            const list = await mysql.query("SELECT i2.barcode, i3.title FROM koha.issues_pending i LEFT JOIN koha.items i2 ON i2.itemnumber = i.itemnumber LEFT JOIN koha.biblio i3 ON i3.biblionumber = i2.biblionumber WHERE i.itemnumber = ?",
            [checkBarcode[0].itemnumber])

            if(list.length > 0) {
                return {
                    status: true,
                    code: 200,
                    message: "Check Dropbox Item Found",
                    data: list[0]
                }
            }else {
                return {
                    status: false,
                    message: "Check Dropbox Item Not Found"
                }
            }

        }catch (error){
            console.error("List Pending module Error: ", error)
            return {
                status: false,
                error
            }
        }
    }

    updateStatusDropbox = async (userid, body) => {
        try{
            const value = {
                userid,
                ...body
            }

            const schema = Joi.object({
                userid: Joi.string().required(),
                data: Joi.array().items(Joi.object({
                    barcode: Joi.string().required()
                }))
            })

            const validation = schema.validate(value)

            if(validation.error){
                const errorDetails = validation.error.details.map(detail => detail.message)

                return {
                    status: false,
                    code: 400,
                    error: errorDetails.join(', ')
                }
            }

            const result = []

            for(let i = 0; i < body.data.length; i++) {
                    
                    const checkBarcode = await mysql.query("SELECT itemnumber FROM koha.items WHERE barcode = ?",
                    [body.data[i].barcode])
    
                    if(checkBarcode.length === 0) {
                        return {
                            status: false,
                            message: "Barcode Not Found"
                        }
                    }
    
                    const updateStatus = await mysql.query("UPDATE koha.issues_pending SET status = 'CHECKIN SUCCESS' WHERE itemnumber = ?",
                    [checkBarcode[0].itemnumber])
    
                    if(updateStatus.affectedRows > 0) {
                        result.push({
                            status: true,
                            data: body.data[i].barcode,
                            message: "Update Status Success"
                        })
                    }else {
                        result.push({
                            status: false,
                            message: "Update Status Failed"
                        })
                        console.log("update status failed")
                    }
    
            }

            return {
                status: true,
                message: "Update Status Success",
            }
        
        }catch (error){
            console.error("Update Status module Error: ", error)
            return {
                status: false,
                error
            }
        }
    }
}

module.exports = new _checkin()