export function generateNumericCode(length) {
    let code = '';
    for (let i = 0; i < length; i++) {
      code += Math.floor(Math.random() * 10); // Append a random digit (0-9) to the code.
    }
    return code;
}