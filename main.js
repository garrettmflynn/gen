import * as visualscript from 'https://cdn.jsdelivr.net/npm/visualscript'
import * as bids from './src/standards/bids/src/index.js'

const editorDiv = document.getElementById('editor')
const errorDiv = document.getElementById('errors')
const warningDiv = document.getElementById('warnings')
const downloadButton = document.getElementById('download')

const editor = new visualscript.ObjectEditor({header: 'BIDS File'})
editor.style.color = 'black'
editorDiv.appendChild(editor)

let bidsDataset = null
const file = document.getElementById('file')
file.onchange = async (ev) => {
  const files = ev.target.files
    bidsDataset = new bids.BIDSDataset({
      ignoreWarnings: false,
      ignoreNiftiHeaders: false,
      ignoreSubjectConsistency: false,
    })

    const info = await bidsDataset.validate(files)
    const data = await bidsDataset.load(files)

    // Register Actual Directories
    if (data){
      console.log(bidsDataset)
      editor.target = data
    }

    showValidation(info)
}

const showValidation = (info) => {

  errorDiv.innerHTML = ''
  warningDiv.innerHTML = ''


  const createView = (o, i, type='Error') => {
    return `
    <h3>${type} ${i+1}: [${o.code}] ${o.key}</h3>
    <a href=${o.helpUrl}>Click here for more information about this issue</a>
    <p><small>${o.reason}</small></p>
    <span>${o.files.length} files.</span>
    <ul>
      ${o.files.map((file, j) => `<li>File ${j} - ${file?.file?.name}</li>`).join('')}
    </ul>
    `
  }

  console.log('Errors', info.errors)
  info.errors.forEach((error, i) => {
    errorDiv.insertAdjacentHTML('beforeend',createView(error, i, 'Error'))
  })

  console.log('Warnings', info.warnings)
  info.warnings.forEach((warning, i) => {
    warningDiv.insertAdjacentHTML('beforeend',createView(warning, i, 'Warning'))
  })
}

downloadButton.onclick = async () => {
  if (bidsDataset) {
    const info = await bidsDataset.download()
    if (info) showValidation(info)
  }
}