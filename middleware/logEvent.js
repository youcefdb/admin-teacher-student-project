import { format } from "date-fns";
import { fileURLToPath } from "url";
import { appendFile, mkdir } from "fs/promises";
import path from "path";
import {v4} from "uuid";

const logEvent = async (message) => {
    const logDate = format(new Date(), "yyyy/mm/dd\t hh:mm:ss"); //creating date
    const __fileName = fileURLToPath(import.meta.url); //getting file locaiton
    const __mkdirName = path.dirname(__fileName); //getting directory location
    const ourPath = path.join(__mkdirName, "..", "logs")//create the path
    let id = v4(); // create the ID
    let content = `${logDate}\t${id}\t${message} \n`; //create the content

    try{
        await mkdir(ourPath, {recursive: true}); //create directory if any
        await appendFile(path.join(ourPath, "regestredLogs"), content); // create file
    }catch(err){
        console.log(err.message);
    }
}

export default logEvent;