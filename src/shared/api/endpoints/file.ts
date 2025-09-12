import api from '../client'

const prefix = '.file_api.'

export interface UploadedFile {
    file_url: string
    filename: string
    size: number
}

export const fileApi = {
    upload: (data: { file: File; attach_to_doctype?: string; attach_to_name?: string }) => {
        const form = new FormData()
        form.append('file', data.file)
        if (data.attach_to_doctype) form.append('attach_to_doctype', data.attach_to_doctype)
        if (data.attach_to_name) form.append('attach_to_name', data.attach_to_name)
        return api.post<UploadedFile>(`${prefix}upload_file`, form, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    }
}
