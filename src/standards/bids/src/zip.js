
import encode from './encode'
import JSZip from 'jszip';
import { extensionToMimeType } from './index.js';

export default (name, object) => {

    return new Promise(async resolve => {
        
    const zip = new JSZip();
    const keywords = ['sub', 'ses']

    // Asynchronously Drill Files
    const drill = async (subObj, file, prefixKey) => {
        return await Promise.all(Object.keys(subObj).map(async key => {
            const splitKey = key.split('.')
            const notKeyword = keywords.map(k => key !== k).reduce((a,b) => a * b, true)
            if (!notKeyword) return await drill(subObj[key], file, key) // Special files
            else if (splitKey.length === 1 && (typeof subObj[key] === 'object')) return await drill(subObj[key], file.folder(prefixKey ? `${prefixKey}-${key}` : key))
            else {
                const returned = await encode(subObj[key], extensionToMimeType[splitKey[1]])
                file.file(key, returned) // Encoded file
            }
        }))
    }
    await drill(object, zip)

    // Generate .zip file
    zip.generateAsync({type:"blob"}).then((content) => resolve(content))
})
}