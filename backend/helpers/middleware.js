const mysql = require('../helpers/database')
const config = require('../config/app.config')
const jwt = require('jsonwebtoken')


const userSession = async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]
    
            const decoded = jwt.verify(token, config.jwt.secret)
            
            const user = await mysql.query('SELECT p.cardnumber, p.surname, p.dateexpiry, p.borrowernumber, p.categorycode, p.branchcode, p.userid  FROM koha.borrowers p WHERE  p.cardnumber= ?', [decoded.cardnumber])
            if (user) {
                req.user = {
                    cardnumber: user[0].cardnumber,
                    surname: user[0].surname,
                    borrowernumber: user[0].borrowernumber,
                }
                next()
            } else {
                res.status(401).send({
                    status: false,
                    message: 'Not authorized to access this route' 
                })
            }

        } catch (error) {
            // console.error('Middleware user not authorized Error: ', error)
            res.status(401).send({
                status: false,
                message: 'Not authorized Error. Token Expired.'
            })
        }
        if(!token) {
            res.status(401).send({
                status: false,
                message: 'Not authorized, no token'
            })
        }
    }
}


const adminSession = async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]
    
            const decoded = jwt.verify(token, config.jwt.secret)
            const user = await mysql.query('SELECT p.cardnumber, p.surname, p.dateexpiry, p.borrowernumber, p.categorycode, p.branchcode, p.userid  FROM koha.borrowers p WHERE  p.cardnumber= ?', 
            [decoded.userid])
            
            if (user) {
                req.user = {
                    cardnumber: user[0].cardnumber,
                    userid: user[0].userid,
                    surname: user[0].surname,
                    borrowernumber: user[0].borrowernumber,
                    categorycode: user[0].categorycode,
                    branchcode: user[0].branchcode,
                }
                next()
            } else {
                res.status(401).send({
                    status: false,
                    message: 'Not authorized to access this route' 
                })
            }

        } catch (error) {
            // console.error('Middleware user not authorized Error: ', error)
            res.status(401).send({
                status: false,
                message: 'Not authorized Error. Token Expired.'
            })
        }
        if(!token) {
            res.status(401).send({
                status: false,
                message: 'Not authorized, no token'
            })
        }
    }
}

const verifyAdmin = async (req, res, next) => {
        try {
            if(req.user.categorycode == 'LIBRARIAN' && req.user.branchcode == 'PUSAT') {
                next()
            }else {
                res.status(401).send({
                    status: false,
                    message: 'Not authorized to access this route'
                })
            }
        }
        catch (error) {
            res.status(401).send({
                status: false,
                message: 'Not authorized to access this route'
            })
        }
}



module.exports = {userSession, verifyAdmin, adminSession}