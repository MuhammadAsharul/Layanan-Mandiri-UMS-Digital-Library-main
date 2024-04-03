const mysql = require('../helpers/database')
const { snap } = require('../config/midtrans.config');
const Joi = require('joi');


class _fines {
    // get all fines from one user
    totalMyFines = async (cardnumber) => {
        try {
               
        const schema = Joi.string().required();
      
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

        const list = await mysql.query("SELECT (SELECT b.surname FROM koha.borrowers b WHERE b.borrowernumber = a.borrowernumber) AS Patron,IFNULL(format(sum(amountoutstanding),2),0) AS 'Outstanding', (SELECT count(i.itemnumber) FROM koha.issues i WHERE b.borrowernumber = i.borrowernumber ) AS 'Checkouts' FROM koha.accountlines a, koha.borrowers b WHERE a.borrowernumber = b.borrowernumber AND b.cardnumber= ?", 
         [cardnumber])
        
        return {   
            status: true,
            data: list
        }

        } catch (error) {
            console.error('List fines module Error: ', error)
            return {
                status: false,
                error
            }
        }
    }

    listMyFines = async (cardnumber) => {
        try {
            const body = {
                cardnumber
            }

            const schema = Joi.object({
                cardnumber: Joi.string().required(),
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

            const list = await mysql.query("SELECT b2.title, b2.author, bi.publishercode, ac.amountoutstanding from koha.accountlines as ac LEFT JOIN koha.borrowers as b on ac.borrowernumber= b.borrowernumber LEFT JOIN koha.items as i2 on i2.itemnumber= ac.itemnumber LEFT JOIN koha.biblio as b2 on b2.biblionumber=i2.biblionumber LEFT JOIN koha.biblioitems as bi on bi.biblionumber=i2.biblionumber WHERE ac.amountoutstanding > 0 AND b.cardnumber= ?",
            [body.cardnumber]);

            return {
                status: true,
                data: list
            }
        } catch (error){
            console.error("Check List My Fines module Error: ", error)
            return {
                status: false,
                code: 400,
                error
            }
        }
    }

    chargeFines = async (cardnumber) => {
        try {
            const value = {
                cardnumber,
            }

            const schema = Joi.object({
                cardnumber: Joi.string().required(),
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

            const fines = await mysql.query("SELECT (SELECT b.surname FROM koha.borrowers b WHERE b.borrowernumber = a.borrowernumber) AS Patron,IFNULL(format(sum(amountoutstanding),2),0) AS 'Outstanding', (SELECT count(i.itemnumber) FROM koha.issues i WHERE b.borrowernumber = i.borrowernumber ) AS 'Checkouts' FROM koha.accountlines a, koha.borrowers b WHERE a.borrowernumber = b.borrowernumber AND b.cardnumber= ?", 
            [value.cardnumber])

            const detailFines = await mysql.query("SELECT ac.accountlines_id, ac.amountoutstanding, ac.description, b.phone FROM koha.accountlines as ac LEFT JOIN koha.borrowers as b on ac.borrowernumber= b.borrowernumber WHERE ac.amountoutstanding > 0 AND b.cardnumber= ?",
            [value.cardnumber])

            if(fines.length === 0 || detailFines.length === 0){
                return {
                    status: false,
                    code: 400,
                    error: 'Fines not found'
                }
            }

            // convert String to Int
            const parseInt = (value) => {
                return Number(value.replace(/[^0-9.-]+/g,""))
            }

            const shortText = (text) => {
                return text.length > 20 ? text.substring(0, 20) + '...' : text
            }


        let snapApi = await snap.createTransaction({
            transaction_details: {
                order_id: value.cardnumber + '-' + fines[0].Patron + '-' + Date.now(),
                gross_amount: parseInt(fines[0].Outstanding)
            },
            credit_card: {
                secure: true
            },
            item_details: detailFines.map(fine => {
                return {
                    id: fine.accountlines_id,
                    price: parseInt(fine.amountoutstanding),
                    quantity: 1,
                    name: shortText(fine.description)
                }
            }),
            customer_details: {
                first_name: fines[0].Patron,
                phone: detailFines[0].phone,
            }
        })

        if(snapApi){
            return {
                status: true,
                data: snapApi
            }
        } else {
            return {
                status: false,
                code: 400,
                error: 'Error'
            }
        }

        } catch (error) {
            console.error("Charge Fines module Error: ", error)
            return {
                status: false,
                code: 400,
                error
            }
        }

                 
        }


}

module.exports = new _fines()