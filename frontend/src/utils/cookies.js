import parseJwt from '../utils/parseJwt';

const setCookies = (name, value, { datetime }) => {
  const d = new Date();
  if (datetime) d.setTime(datetime);
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;`;
};

const getCookies = (name) => {
  const cookies = `; ${document.cookie}`;
  const byValue = cookies.split(`; ${name}=`);
  if (byValue.length === 2) return byValue.pop().split(';').shift();
};

const delCookies = (name) => {
  setCookies(name, '', -1);
};

const certCookies = () => {
  const token = getCookies('CERT');
  if (token) {
    const { cardnumber, categorycode, surname, dateexpiry, duration, address, phone, exp } = parseJwt(token);
    if (!cardnumber) return delCookies('CERT');
    return {
        cardnumber,
        categorycode,
        surname,
        dateexpiry,
        duration,
        address,
        phone,
        exp,
    };
  }
  return {
    cardnumber: undefined,
    categorycode: undefined,
    exp: undefined,
  };
};

const Cookies = {
  setCookies,
  getCookies,
  delCookies,
  certCookies,
}

export default Cookies;