const mysql = require('../helpers/database')
const { snap } = require('../config/midtrans.config');
const Joi = require('joi');

 class _notifications {

    getNotifications = async (body) => {
        try {
            snap.transaction.notification(body)
            .then((statusResponse)=>{
                let orderId = statusResponse.order_id;
                let transactionStatus = statusResponse.transaction_status;
                let fraudStatus = statusResponse.fraud_status;

                const getCardnumber = orderId.split('-')

                console.log(`Transaction notification received. Order ID: ${getCardnumber[0]}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

                if (transactionStatus == 'capture'){
                    if (fraudStatus == 'challenge'){
                        // TODO set transaction status on your databaase to 'challenge'
                    } else if (fraudStatus == 'accept'){
                        // TODO set transaction status on your databaase to 'success'
                    }
                }
                else if (transactionStatus == 'settlement'){
                    // TODO set transaction status on your databaase to 'success'
                    const checkFines = async (cardnumber) => {
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
                        
                            const listFines = await mysql.query("SELECT amountoutstanding, amount, itemnumber, borrowernumber FROM koha.accountlines WHERE borrowernumber = (SELECT borrowernumber FROM koha.borrowers WHERE cardnumber = ?) AND amountoutstanding > 0",
                            [cardnumber])

                            const result = []

                            for (let i = 0; i < listFines.length; i++) {
                                const updateFines = await mysql.query("UPDATE koha.accountlines SET amountoutstanding = 0.00, date = NOW(), accounttype = 'PAY', note = 'GATEWAY', interface = 'Intranet', amount = ? WHERE itemnumber = ? AND borrowernumber = ?",
                                [-Math.abs(listFines[i].amountoutstanding), listFines[i].itemnumber, listFines[i].borrowernumber])
                                result.push(updateFines)
                            }

                            return {
                                status: true,
                                message: 'Fines has been paid'
                            }
                        } catch (error) {
                            console.error('Check fines module Error: ', error)
                            return {
                                status: false,
                                error
                            }
                        }
                    }

                    const result = checkFines(getCardnumber[0])
                    return result
                }
                else if (transactionStatus == 'cancel' ||
                    transactionStatus == 'deny' ||
                    transactionStatus == 'expire'){
                    // TODO set transaction status on your databaase to 'failure'
                }
                else if (transactionStatus == 'pending'){
                    // TODO set transaction status on your databaase to 'pending' / waiting payment
                }
            });
            return {
                status: true,
                data: body
            }
        } catch (error) {
            console.error('Get notifications module Error: ', error)
            return {
                status: false,
                error
            }
        }
    }
 }

    module.exports = new _notifications();