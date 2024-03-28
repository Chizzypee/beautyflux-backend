const regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
const phoneRegex = new RegExp("[0-9]{11}");


const isEmailValid = (email) => {
    return regex.test(email);
}

const isNumberValid = (number) => {
    if(isNaN(number)) return false ;
    if(number.charAt (0) !== "0") return false;
    return phoneRegex.test(number);
}

module.exports = {
    isEmailValid,
    isNumberValid
}