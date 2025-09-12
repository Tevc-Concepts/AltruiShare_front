import api from '../client'

const prefix = '.as_api.file_api.'

export interface UploadedFile {
    file_url: string
    filename: string
    size: number
}

export const fileApi = {
    upload: async (data: { file: File; attach_to_doctype?: string; attach_to_name?: string; onProgress?: (percent: number) => void }): Promise<UploadedFile> => {
        const form = new FormData()
        form.append('file', data.file)
        if (data.attach_to_doctype) form.append('attach_to_doctype', data.attach_to_doctype)
        if (data.attach_to_name) form.append('attach_to_name', data.attach_to_name)
        return api.post(`${prefix}upload_file`, form, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: evt => {
                if (data.onProgress && evt.total) {
                    data.onProgress(Math.round((evt.loaded / evt.total) * 100))
                }
            }
        }) as unknown as UploadedFile
    }
}
