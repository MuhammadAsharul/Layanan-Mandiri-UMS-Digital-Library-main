const mysql = require('../helpers/database')
const Joi = require('joi')

class _issues {
    //get all loan from one user
    getListCheckoutIssues = async (cardnumber, barcode) => {
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

            BigInt.prototype.toJSON = function() {
                return this.toString()
            }

            const list = await mysql.query("SELECT b.title, i.barcode, b.author FROM koha.biblio as b  LEFT JOIN koha.items as i on i.biblionumber = b.biblionumber WHERE i.barcode = ?",
            [barcode]);

            return {
                status: true,
                data: list
            }
        } catch (error){
            console.error("List issue module Error: ", error)
            return {
                status: false,
                error
            }
        }
    }


    listMyIssues = async (cardnumber) => {
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
           
            BigInt.prototype.toJSON = function() {
                return this.toString()
            }

            const list = mysql.query("SELECT i.date_due, b2.title,i2.barcode,i.issuedate, i.renewals, i.lastreneweddate  from koha.issues as i LEFT JOIN koha.borrowers as b on i.borrowernumber=b.borrowernumber LEFT JOIN koha.items as i2 on i2.itemnumber=i.itemnumber LEFT JOIN koha.biblio as b2 on b2.biblionumber=i2.biblionumber where b.cardnumber= ?",
            [cardnumber]);

            const value = await list;

            return {
                status: true,
                data: value
            }


            
        } catch (error){
            console.error("List loan module Error: ", error)
            return {
                status: false,
                error
            }
        }
    }

    addIssues = async (cardnumber, body) => {
        try {
                
                body = {
                    cardnumber,
                    ...body
                }
    
                const schema = Joi.object({
                    cardnumber: Joi.string().required(),
                    data: Joi.array().items(Joi.object({
                        barcode: Joi.string().required()
                    }))
                })
    
                const validation = schema.validate(body)
    
                if(validation.error){
                    const errorDetails = validation.error.details.map(detail => detail.message);
                    return {
                        status: false,
                        code: 400,
                        error: errorDetails.join(', ')
                    }
                }

                const result = []

                for(let i = 0; i < body.data.length; i++) {
                    const list = await mysql.query("SELECT b.borrowernumber, b.branchcode,b.categorycode,i.itemnumber,i.itype,i.ccode,i3.issuelength,i3.lengthunit,i.location FROM koha.borrowers as b LEFT JOIN koha.issuingrules as i3 on i3.categorycode = b.categorycode LEFT JOIN koha.items as i on i3.itemtype=i.itype AND i3.branchcode= 'PUSAT' where i.barcode = ? AND b.cardnumber = ?",
                    [body.data[i].barcode, body.cardnumber]);

                    if(list.length === 0) {
                        return {
                            status: false,
                            code: 400,
                            error: 'Barcode not found'
                        }
                    }

                    if(list[0].renewals >= 1) {
                        return {
                            status: false,
                            code: 400,
                            error: 'You have reached the maximum number of renewals'
                        }
                    }

                    const checkDuplicateIssue = await mysql.query("SELECT itemnumber FROM koha.issues WHERE itemnumber = ?",
                    [list[0].itemnumber]);

                    if(checkDuplicateIssue.length > 0) {
                        return {
                            status: false,
                            code: 400,
                            error: 'Duplicate issue'
                        }
                    }

                    const date_due = new Date();
                    date_due.setDate(date_due.getDate() + list[0].issuelength);
                    date_due.setUTCHours(23, 59, 59, 999);
                    const newDate = date_due.toISOString().slice(0, 19).replace('T', ' ');

                    const addIssues = await mysql.query("INSERT INTO koha.issues (auto_renew, borrowernumber, branchcode, date_due, issuedate, itemnumber, onsite_checkout) VALUES (0, ?, 'PUSAT',?,now(), ?, 0)",
                    [list[0].borrowernumber, newDate, list[0].itemnumber]);

                    const addStatisticIssues = await mysql.query("INSERT INTO koha.statistics (datetime, branch, type, value, other, itemnumber, itemtype, location, borrowernumber, ccode) VALUES (now(), 'PUSAT', 'issue', 0,'', ?, ?, ?, ?, ?)",
                    [list[0].itemnumber, list[0].itype, list[0].location, list[0].borrowernumber, list[0].ccode]);

                    const action_logs = await mysql.query("INSERT INTO koha.action_logs (timestamp, user, module, action, object, info, interface) VALUES (now(), 149665, 'CIRCULATION', 'ISSUE', ?, ?, 'intranet')",
                    [list[0].itemnumber, list[0].borrowernumber]);

                    if(addIssues.affectedRows === 1 || addStatisticIssues.affectedRows === 1 || action_logs.affectedRows === 1) {
                        result.push({
                            status: true,
                            data: {
                                barcode: body.data[i].barcode,
                                message: 'Success'
                            }
                        })
                    } else {
                        console.log("add issue error")
                    }
                }

                return {
                    status: true,
                    data: result
                }
    
        } catch (error){
            console.error("Renew Loan module Error: ", error)
            return {
                status: false,
                error
            }
        }
    }

    updateIssuesItems = async (cardnumber, body) => {
        try {

            body = {
                cardnumber,
                ...body
            }

            const schema = Joi.object({
                cardnumber: Joi.string().required(),
                data: Joi.array().items(Joi.object({
                    barcode: Joi.string().required()
                }))
            })

            const validation = schema.validate(body)

            if(validation.error){
                const errorDetails = validation.error.details.map(detail => detail.message);
                return {
                    status: false,
                    code: 400,
                    error: errorDetails.join(', ')
                }
            }

            const result = []

            for(let i = 0; i < body.data.length; i++) {
                const list = await mysql.query("SELECT date(i.date_due) as onloan, date(i.issuedate) as datelastborrowed, i.branchcode, i.itemnumber FROM koha.issues i LEFT JOIN koha.items b ON i.itemnumber = b.itemnumber WHERE b.barcode = ?",
                [body.data[i].barcode]);
                const list2 = await mysql.query("SELECT issues from koha.items WHERE barcode = ?",
                [body.data[i].barcode]);

                if(list.length === 0) {
                    result.push({
                        status: false,
                        data: {
                            barcode: body.data[i].barcode,
                            message: 'Barcode not found'
                        }
                    })
                }

                const updateItems = await mysql.query("UPDATE koha.items SET onloan = ?, datelastborrowed = ?, holdingbranch = ?, issues = ?, itemlost = 0, itemlost_on = NULL WHERE itemnumber = ?",
                [list[0].onloan, list[0].datelastborrowed, list[0].branchcode, list2[0].issues + 1 ,list[0].itemnumber]);
    
                if(updateItems.affectedRows === 0) {
                    return {
                        status: false,
                        code: 400,
                        error: 'Update Items Failed'
                    }
                }else {
                    result.push({
                        status: true,
                        data: {
                            barcode: body.data[i].barcode,
                            message: 'Success'
                        }
                    })
                }
            } 

            return {
                status: true,
                data: result
            }

        }catch (error) {
            console.error("Update Items module Error: ", error)
            return {
                status: false,
                error
            }
        }
    }
}

module.exports = new _issues()