const mysql = require("../helpers/database");
const jwt = require("jsonwebtoken");
const config = require("../config/app.config");
const date = require("date-and-time");
const Joi = require("joi");
const Bcrypt = require("bcrypt");

class _auth {
  logout = async (body) => {
    try {
      console.log(body);
      const schema = Joi.object({
        password: Joi.string().required(),
        userid: Joi.string().required(),
      });

      const validation = schema.validate(body);

      if (validation.error) {
        const errorDetails = validation.error.details.map(
          (detail) => detail.message
        );
        return {
          status: false,
          code: 400,
          error: errorDetails.join(", "),
        };
      }

      const checkUser = await mysql.query(
        "SELECT p.password FROM koha.borrowers p WHERE p.userid = ?",
        [body.userid]
      );

      const checkPassword = Bcrypt.compareSync(
        body.password,
        checkUser[0].password
      );

      if (!checkPassword) {
        return {
          status: false,
          code: 404,
          data: {
            password: checkUser[0].password,
          },
          error: "Password not match",
        };
      }

      return {
        status: true,
        data: {
          message: "Logout success",
        },
      };
    } catch (error) {
      console.error("Logout auth module Error: ", error);
      return {
        status: false,
        data: {
          message: "Logout failed",
        },
        error,
      };
    }
  };

  getDataUser = async (cardnumber) => {
    try {
      const schema = Joi.string().required();

      const validation = schema.validate(cardnumber);

      if (validation.error) {
        const errorDetails = validation.error.details.map(
          (detail) => detail.message
        );
        return {
          status: false,
          code: 400,
          error: errorDetails.join(", "),
        };
      }

      const checkUser = await mysql.query(
        "SELECT p.address, p.phone FROM koha.borrowers p WHERE p.cardnumber = ?",
        [cardnumber]
      );

      if (checkUser.length == 0) {
        return {
          status: false,
          code: 404,
          error: "User not found",
        };
      }

      return {
        status: true,
        data: {
          address: checkUser[0].address,
          phone: checkUser[0].phone,
        },
      };
    } catch (error) {
      console.error("Get Data User auth module Error: ", error);
      return {
        status: false,
        error,
      };
    }
  };

  getImageUser = async (cardnumber) => {
    try {
      const schema = Joi.string().required();

      const validation = schema.validate(cardnumber);

      if (validation.error) {
        const errorDetails = validation.error.details.map(
          (detail) => detail.message
        );
        return {
          status: false,
          code: 400,
          error: errorDetails.join(", "),
        };
      }

      const checkUser = await mysql.query(
        "SELECT pi.imagefile, p.cardnumber, p.categorycode ,p.surname, p.dateexpiry FROM koha.borrowers p LEFT JOIN koha.patronimage pi ON p.borrowernumber = pi.borrowernumber WHERE p.cardnumber = ?",
        [cardnumber]
      );

      if (checkUser.length == 0) {
        return {
          status: false,
          code: 404,
          error: "User not found",
        };
      }

      // const image = await this.blobToImage(checkUser[0].imagefile.data)

      const imgBase64 = checkUser[0].imagefile?.toString("base64");
      // const image = `data:image/png;base64,${imgBase64}`;
      // checkUser[0].imagefile = image

      return {
        status: true,
        data: {
          image: imgBase64,
        },
      };
    } catch (error) {
      console.error("Get Image auth module Error: ", error);
      return {
        status: false,
        error,
      };
    }
  };

  login = async (body) => {
    try {
      const schema = Joi.object({
        cardnumber: Joi.string().required(),
      });

      const validation = schema.validate(body);

      if (validation.error) {
        const errorDetails = validation.error.details.map(
          (detail) => detail.message
        );
        return {
          status: false,
          code: 400,
          error: errorDetails.join(", "),
        };
      }

      const checkUser = await mysql.query(
        "SELECT p.cardnumber, p.categorycode ,p.surname, p.dateexpiry, p.address, p.phone FROM koha.borrowers p WHERE p.cardnumber = ?",
        [body.cardnumber]
      );

      if (checkUser.length == 0) {
        return {
          status: false,
          code: 404,
          error: "User not found",
        };
      }

      const { secret, expiresIn } = config.jwt;

      const payload = {
        cardnumber: checkUser[0].cardnumber,
        categorycode: checkUser[0].categorycode,
        surname: checkUser[0].surname,
        dateexpiry: checkUser[0].dateexpiry,
        duration: expiresIn,
        address: checkUser[0].address,
        phone: checkUser[0].phone,
      };

      const token = jwt.sign(payload, secret, { expiresIn: String(expiresIn) });
      const expiresAt = date.format(
        new Date(Date.now() + expiresIn),
        "YYYY-MM-DD HH:mm:ss"
      );

      return {
        status: true,
        data: {
          token,
          expiresAt,
        },
      };
    } catch (error) {
      console.error("Login auth module Error: ", error);
      return {
        status: false,
        error,
      };
    }
  };

  updateUser = async (cardnumber, body) => {
    try {
      const schema = Joi.object({
        address: Joi.string().optional(),
        phone: Joi.string().optional(),
      });

      const validation = schema.validate(body);

      if (validation.error) {
        const errorDetails = validation.error.details.map(
          (detail) => detail.message
        );
        return {
          status: false,
          code: 400,
          error: errorDetails.join(", "),
        };
      }

      const checkUser = await mysql.query(
        "SELECT p.cardnumber, p.categorycode ,p.surname, p.dateexpiry, p.address, p.phone FROM koha.borrowers p WHERE p.cardnumber = ?",
        [cardnumber]
      );

      if (checkUser.length == 0) {
        return {
          status: false,
          code: 404,
          error: "User not found",
        };
      }

      const update = await mysql.query(
        "UPDATE koha.borrowers SET address = ?, phone = ? WHERE cardnumber = ?",
        [body.address, body.phone, cardnumber]
      );

      if (update.affectedRows < 0) {
        return {
          status: false,
          code: 404,
          error: "Update failed",
        };
      }

      return {
        status: true,
        data: {
          message: "Update success",
        },
      };
    } catch (error) {
      console.error("Update auth module Error: ", error);
      return {
        status: false,
        error,
      };
    }
  };

  indexLogin = async (body) => {
    try {
      const schema = Joi.object({
        userid: Joi.string().required(),
        password: Joi.string().required(),
      });

      const validation = schema.validate(body);

      if (validation.error) {
        const errorDetails = validation.error.details.map(
          (detail) => detail.message
        );
        return {
          status: false,
          code: 400,
          error: errorDetails.join(", "),
        };
      }

      const checkUser = await mysql.query(
        "SELECT p.userid, p.password ,p.surname, p.dateexpiry FROM koha.borrowers p WHERE p.userid = ?",
        [body.userid]
      );

      const checkPassword = Bcrypt.compareSync(
        body.password,
        checkUser[0].password
      );

      if (!checkPassword) {
        return {
          status: false,
          code: 404,
          error: "Password not match",
        };
      }

      if (checkUser[0].userid != body.userid) {
        return {
          status: false,
          code: 404,
          error: "User not found",
        };
      }

      const payload = {
        userid: checkUser[0].userid,
        password: checkUser[0].password,
      };

      const { secret, expiresIn } = config.jwt;

      const token = jwt.sign(payload, secret, { expiresIn: String(expiresIn) });
      const expiresAt = date.format(
        new Date(Date.now() + expiresIn),
        "YYYY-MM-DD HH:mm:ss"
      );

      return {
        status: true,
        code: 200,
        data: {
          token,
          expiresAt,
        },
        message: "Login success",
      };
    } catch (error) {
      console.error("Login auth module Error: ", error);
      return {
        status: false,
        error,
      };
    }
  };

  adminLogin = async (body) => {
    try {
      const schema = Joi.object({
        userid: Joi.string().required(),
        password: Joi.string().required(),
      });

      const validation = schema.validate(body);

      if (validation.error) {
        const errorDetails = validation.error.details.map(
          (detail) => detail.message
        );
        return {
          status: false,
          code: 400,
          error: errorDetails.join(", "),
        };
      }

      const checkUser = await mysql.query(
        "SELECT p.userid, p.password ,p.surname, p.dateexpiry FROM koha.borrowers p WHERE p.userid = ?",
        [body.userid]
      );

      const checkPassword = Bcrypt.compareSync(
        body.password,
        checkUser[0].password
      );

      if (!checkPassword) {
        return {
          status: false,
          code: 404,
          error: "Password not match",
        };
      }

      if (checkUser[0].userid != body.userid) {
        return {
          status: false,
          code: 404,
          error: "User not found",
        };
      }

      const payload = {
        userid: checkUser[0].userid,
        password: checkUser[0].password,
      };

      const { secret, expiresIn } = config.jwtIndex;

      const token = jwt.sign(payload, secret, { expiresIn: String(expiresIn) });
      const expiresAt = date.format(
        new Date(Date.now() + expiresIn),
        "YYYY-MM-DD HH:mm:ss"
      );

      return {
        status: true,
        code: 200,
        data: {
          token,
          expiresAt,
        },
        message: "Login admin success",
      };
    } catch (error) {
      console.error("Login auth module Error: ", error);
      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _auth();
