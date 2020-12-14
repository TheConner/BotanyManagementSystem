module.exports.ToCommaSeperatedString = (array) => {
    let out = '';
    for (let i = 0; i < array.length; i++) {
        out += array[i]
        if (i != array.length-1) {
            out += ',';
        } 
    }
    return out;
}