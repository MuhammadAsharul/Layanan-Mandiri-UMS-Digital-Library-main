const mysql = require('../helpers/database')
const Joi = require('joi')

class _renew {
    //renew loan from one user
    renewLoan = async (cardnumber, barcode) => {
        try {

            const body = {
                cardnumber,
                barcode
            }

            const schema = Joi.object({
                cardnumber: Joi.string().required(),
                barcode: Joi.string().required()
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

            const list = await mysql.query("SELECT i.branchcode, b1.title as title,i.itemnumber,it.description,c.branchname,i.borrowernumber,b.surname,i2.ccode,i3.issuelength,i3.lengthunit,IFNULL(i.renewals,0) as renewals,i.auto_renew,date(i.date_due) as date_due from koha.issues as i LEFT JOIN koha.items as i2 on i.itemnumber=i2.itemnumber LEFT JOIN koha.biblio as b1 on b1.biblionumber=i2.biblionumber LEFT JOIN koha.borrowers as b on b.borrowernumber=i.borrowernumber LEFT JOIN koha.itemtypes as it on it.itemtype = i2.itype LEFT JOIN koha.branches as c on c.branchcode = i.branchcode LEFT JOIN koha.issuingrules as i3 on i3.categorycode=b.categorycode AND i3.itemtype=i2.itype AND i3.branchcode='pusat' where i2.barcode = ? AND b.cardnumber= ?",
            [barcode, cardnumber]);
            

            // if(list[0].renewals >= 1) { where b.cardnumber= ?",
            //     return {
            //         status: false,
            //         code: 400,
            //         error: 'You have reached the maximum number of renewals'
            //     }
            // }

            return {
                status: true,
                data: list
            }

        } catch (error){
            console.error("Renew Loan module Error: ", error)
            return {
                status: false,
                error
            }
        }
    }

    updateRenew = async (cardnumber, body) => {
        try {
            body = {
                cardnumber,
                ...body
            }

            const schema = Joi.object({
                cardnumber: Joi.string().required(),
                itemnumber: Joi.number().required(),
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

            const list = await mysql.query("SELECT b.borrowernumber, i3.itemnumber, i3.renewals, i3.auto_renew, i.issuelength, i3.date_due FROM koha.borrowers b LEFT JOIN koha.issuingrules as i ON i.categorycode = b.categorycode AND i.branchcode = 'PUSAT' LEFT JOIN koha.items i2 ON i2.itype = i.itemtype LEFT JOIN koha.issues i3 ON i3.itemnumber = i2.itemnumber WHERE b.cardnumber = ? AND i3.itemnumber = ?;",
            [body.cardnumber, body.itemnumber]); 

            if(list[0].renewals > 0) {
                return {
                    status: false,
                    code: 400,
                    error: 'You have reached the maximum number of renewals'
                }
            }else {
                const date = new Date(list[0].date_due)
                date.setDate(date.getDate() + list[0].issuelength)
                date.toISOString().slice(0, 19).replace('T', ' ')
                
    
                const update = await mysql.query("UPDATE koha.issues SET date_due = ?, renewals = ?, auto_renew = ?, lastreneweddate = now()  WHERE borrowernumber= ? AND itemnumber= ?", 
                [date,list[0].renewals + 1, list[0].auto_renew + 1,list[0].borrowernumber,  body.itemnumber])


                return {
                    status: true,
                    data: update
                }
            }

        } catch (error) {
            console.error("Update Renew module Error: ", error)
            return {
                status: false,
                error
            }
        }
    }

    addStatisticUpdate = async (cardnumber, body) => {
        try {
            body = {
                cardnumber,
                ...body
            }

            const schema = Joi.object({
                cardnumber: Joi.string().required(),
                itemnumber: Joi.number().required(),
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

            const list = await mysql.query("SELECT b.borrowernumber, i3.itemnumber, i3.renewals, i3.auto_renew, i.issuelength, i.branchcode ,i3.date_due, 12.itype FROM koha.borrowers b LEFT JOIN koha.issuingrules as i ON i.categorycode = b.categorycode AND i.branchcode = 'PUSAT' LEFT JOIN koha.items i2 ON i2.itype = i.itemtype LEFT JOIN koha.issues i3 ON i3.itemnumber = i2.itemnumber WHERE b.cardnumber = ? AND i3.itemnumber = ?;",
            [body.cardnumber, body.itemnumber]); 

            const add = await mysql.query("INSERT INTO koha.statistics (datetime, branch, value , type,  other, itemnumber, itemtype, borrowernumber) VALUES (now(), ? ,0.00,'renew','', ? , ? , ?)",
            [list[0].branchcode,body.itemnumber,list[0].itype, list[0].borrowernumber])

            return {
                status: true,
                data: add
            }

        } catch (error) {
            console.error("Add statistic update module Error: ", error)
            return {
                status: false,
                error
            }   
        }
    }
}

module.exports = new _renew();