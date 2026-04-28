import { Request } from "express"
import { extname } from "path"

export const editFileName = (
    req: Request,
    file: any,
    callback: (error: Error | null, filename: string) => void,
) => {
    try{
        let imageName = `${(Math.random() * 100000000).toFixed()}${(Math.random() * 100000000).toFixed()}`
        const extension = extname(file.originalname)
        imageName += extension
        callback(null, imageName)
    }
    catch(error){
        callback(error, "")
    }
}