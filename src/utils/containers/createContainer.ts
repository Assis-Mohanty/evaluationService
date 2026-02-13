import Docker from "dockerode"
import logger from "../../config/logger.config"

export interface CreateContainerOptions{
    imageName:string,
    cmdExecutable:string[],
    memoryLimit:number
}

export async function createNewContainer(options:CreateContainerOptions) {
    try {
        const docker = new Docker()
        const container =await docker.createContainer({
            Image:options.imageName,
            AttachStdin:true,
            AttachStdout:true,
            AttachStderr:true,
            Tty:true,
            Cmd:options.cmdExecutable,
            OpenStdin:true,
            HostConfig:{
                Memory:options.memoryLimit,
                PidsLimit:100,
                CpuQuota:50000,
                CpuPeriod:10000,
                SecurityOpt:['no-new-privileges'],
                NetworkMode:'none'
            }
        })
        logger.info("Container created succesfully",container.id)
        return container
    } catch (error) {
        logger.info("Error creating a container",error)
        return null
    }
}