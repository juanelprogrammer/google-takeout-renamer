const fs = require('fs')
const path = require('path');

//set dir for reading and writing files
const dir = './'

const fileList = fs.readdirSync(dir)
//keep all the new files names to check for duplicates
const newFileNames = []



const createName = (timeFormatted) => {
    
    //the timestamp on google does not working for me, so i used the formatted date and parsed it.
    const dateTime = Date.parse(timeFormatted)
    
    const date = new Date(dateTime)
    
    date.setMilliseconds(date.getMilliseconds() - (1000 * 60 * 60 * 3)) //3 hours less than UTC
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minutes = date.getMinutes()
    const year = date.getFullYear()
    const seconds = date.getSeconds()


    const formattedDate = `${year}-${month}-${day}-${hour}-${minutes}-${seconds}`
    
    //check for duplicates
    const alreadyExists = newFileNames.filter((fileName) => fileName.includes(formattedDate))

    
    if(alreadyExists.length == 0) {
        const name = formattedDate
        newFileNames.push(name)
        return name
    } else {
        console.log('alreadyexists: ', alreadyExists)
        const index = alreadyExists.length        
        const name = `${year}-${month}-${day}-${hour}-${minutes}-${seconds}_${index}`
        newFileNames.push(name)
        return name
    }
}

const renameFile = (file, newName) => {
    
    //get the filename without the extension, to match de json with the media file
    const fileName = file.split('.')[0]

    //searches for the actual media file from the json to rename
    const coincidence = fileList.find((file) => {
        if(file.split('.')[0] == fileName && path.extname(file) != '.json') return file
        
    })

    const extName = path.extname(coincidence)


    fs.rename(`${dir}${coincidence}`, `${dir}${newName}${extName}`, (err, newFile) => {
    if(err) {
        console.log(err)
        return
    } else {
        console.log('success')
        console.log('\nrenamedFile: ', newFile)
        return newFile
    }
    

    })
}

//execution
fileList.forEach((file) => {
    if(path.extname(file) == '.json') {
        const rawData = fs.readFileSync(`${dir}${file}`)
        const imgJson = JSON.parse(rawData)

        //my google formatted date is in spanish and the date parse works only in eng I think ¿?
        //replaces to english short-version of months
        const timeFormatted = imgJson.photoTakenTime.formatted.slice(0, 20)
            .replace(/\bene\b/g, 'jan')
            .replace(/\babr\b/g, 'apr')
            .replace(/\bago\b/g, 'aug')
            .replace(/\bdic\b/g, 'dec')

        const newName = createName(timeFormatted)

        renameFile(file, newName)

    }

})