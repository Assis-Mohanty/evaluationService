import { InternalServerError } from "../errors/app.error";
import { commands } from "./constants";
import { createNewContainer } from "./createContainer";

export interface RunCodeOptions{
    code:string,
    language:"python"| "cpp",
    timeout:number,
    imageName:string,
    input:string
}

const allowedLanguages = ["python", "cpp"];

export async function runCode(options:RunCodeOptions) {
    const {code, language, timeout, imageName, input} = options;
    if(!allowedLanguages.includes(language)){
        throw new InternalServerError("Invalid language");
    }
    const container = await createNewContainer({
        imageName:imageName,
        cmdExecutable:commands[language](code,input),
        memoryLimit:1024*1024*1024
    });
    let isTimeLimitExceeded = false;
    const timeLimitExceededTimeout = setTimeout(()=>{
        console.log("time limit exceeded")
        isTimeLimitExceeded = true;
        container?.kill();
    }, timeout);
    await container?.start();

    const status = await container?.wait();

    if(isTimeLimitExceeded) {
        await container?.remove();
        return {
            status: "time_limit_exceeded",
            output: "Time limit exceeded"
        }
    }

    const logs = await container?.logs({
        stdout:true,
        stderr:true,
    });

    const containerLogs= processLogs(logs);
    await container?.remove();
    clearTimeout(timeLimitExceededTimeout);
    if(status.StatusCode === 0){
        return {
            status: "success",
            output: containerLogs
        }
    } else {
        return {
            status: "failed",
            output: containerLogs
        }
    }
}


function processLogs(logs: Buffer | undefined) {
    return logs?.toString('utf8')
    .replace(/\x00/g, '') 
    .replace(/[\x00-\x09\x0B-\x1F\x7F-\x9F]/g, '') 
    .trim();
}