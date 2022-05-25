
import load from './load.js'
import zip from './zip.js'
import JSZip from 'jszip';
import validate from 'bids-validator'
import { saveAs } from 'file-saver';

export const extensionToMimeType = {
  'tsv': "text/tab-separated-values",
  'json': "application/json",
  'nii': "application/x-nii",
}

class BIDSDataset {

    constructor(options={}) {
        this.data = {}
        this.options = { verbose: true }
        Object.assign(this.options, options)
    }

    _setConfig = (options={}) => {
      if (options.config) this.options.config = options
      else this.options.config = `${this.name}/.bids-validator-config.json`
    }

    validate = (files, options={}) => {
      
        if (!this.options.config) this._setConfig(options)
        return new Promise(resolve => {
        validate.BIDS(
            files,
            Object.assign(this.options, options),
            (issues, summary) => {
              if (issues === 'Invalid') {    
                resolve({ errors: 'Invalid', summary, status: 'validated' })
              } else {
                resolve({
                    errors: issues.errors ? issues.errors : [],
                    warnings: issues.warnings ? issues.warnings : [],
                    summary,
                    status: 'validated',
                })
              }
            },
          )
        })
    }

    load = async (files) => {
        if (files.length){
          this.name = files[0].webkitRelativePath?.split('/')?.[0] // directory name
          this._setConfig()
          this.data = await load(files)
          return this.data
        }
    }

    check = async (options={}, override=false) => {
      const zippedBlob = await zip(this.name, this.data)

      // Spoof Files for Pre-Export Validation
      const unzipped = await JSZip.loadAsync(zippedBlob)
      const fileList = await Promise.all(Object.entries(unzipped.files).filter(([path, f]) => !f.dir).map(async ([path, f]) => {
        const buffer = await f.async("arraybuffer")
        const blob = new Blob([buffer])
        blob.name = f.name.split('/').at(-1)
        blob.webkitRelativePath = `${this}/${path}`
        return blob
      }))

      // Validate Files
      const info = await this.validate(fileList, options)
      if (override || info.errors.length === 0) return zippedBlob
      else return info
    }

    download = async (override=false) => {
      const info = await this.check(override)
      if (info instanceof Blob) saveAs(info, `${this.name}.zip`)
      else return info
    }
}



export {
    BIDSDataset,
    load,
    // zip
}