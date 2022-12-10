
module.exports = {
  validEmail: (value) => {
    let emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;
    return emailRegex.test(value);
  },

  validPhoneNo: (value) => {
    return /^[6-9]\d{9}$/.test(value);
  },
  isValidPassword: (value) => {
    if (value.length > 15 || value.length < 8) {
      return false
    }
    return true
  },
  objectValue: (value) => {
    if (typeof value === "undefined" || value === null ) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === "object" && Object.keys(value).length === 0) return false;
    return true;
  },
};
