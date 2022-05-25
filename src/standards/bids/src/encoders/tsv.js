
const addBOM = str => `\ufeff${str}`//.replace(/^\uFEFF/, '') // TODO

export default (arr) => {

    const rows = [Object.keys(arr[0]), ...arr.map(o => Object.values(o))]
    let text = rows.map(row => row.join('\t')).join('\n')
    text = addBOM(text) // TO IMPLEMENT
    return text
}