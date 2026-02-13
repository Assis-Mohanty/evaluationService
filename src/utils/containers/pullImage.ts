import Docker from "dockerode"
import { CPP_IMAGE, PYTHON_IMAGE } from "../constants.utils"
import logger from "../../config/logger.config"

export async function pullImage(image:string) {
    const docker = new Docker()
    return new Promise((res,rej)=>{
        docker.pull(image,
            function(err:Error,stream:NodeJS.ReadableStream){
                if(err){
                    rej(err)
                    return;
                }
                docker.modem.followProgress(
                    stream,
                    function onFinished(finalErr,output){
                        if(finalErr){
                            rej(finalErr);
                        }
                        else{
                            res(output)
                        }
                    },
                    function onProgress(event){
                        console.log(event.status);
                    }
                )
    })
})
}

export async function pullAllImages() {
    const images=[PYTHON_IMAGE,CPP_IMAGE]
    const promises=images.map(image=>pullImage(image));
    try {
        await Promise.all(promises);
        logger.info("All images pull successfully ");
    } catch (error) {
        logger.error("Error pulling images",error)
    }
}
