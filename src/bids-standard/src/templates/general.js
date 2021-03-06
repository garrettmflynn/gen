export const files = {
    "README": "<!-- Add your own README content -->",
    "dataset_description.json": {
        "Name": "",
        "BIDSVersion": "1.7.0",
        "DatasetType": "raw",
        "License": "",
        "Authors": [""],
        "Acknowledgements": "",
        "HowToAcknowledge": "",
        "Funding": [""],
        "EthicsApprovals": [""],
        "ReferencesAndLinks": [""],
        "DatasetDOI": ""
    },

    "participants.json": {
        "age": {
            "Description": "age of the participant",
            "Units": "years"
        },
        "sex": {
            "Description": "sex of the participant",
            "Levels": {
                "M": "male",
                "F": "female"
            }
        }
    },
    'participants.tsv': [],


    // Files Specified by Suffix
    'events.json': {

        onset: {
            Description: "Position of event marker in seconds relative to the start.",
            Units: "s"
          },
          duration: {
              Description: "Duration of the event in seconds.",
              Units: "s"
          }
          
    },
}


const metadataBase = {
    LongName: "",
    Description: "",
    Levels: {},
    Units: "",
    TermURL: "",
}


export const objects = {
    "participants.tsv" : {
        participant_id: 'n/a',
        age: 'n/a',
        sex: 'n/a'
    },
    
    "participants.json" : Object.assign({}, metadataBase),
    "events.json": Object.assign({HED: {}}, metadataBase)
}