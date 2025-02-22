export interface Note{
    id: number
    title: string,
    content: string,
    createdAt: string,
    userId: number,
    categories: Category[],
    attachments: Attachment[]
}

export interface Attachment{
    "id": number,
    "fileName": string,
    "fileType": string,
    "downloadUrl": string
}

export interface Category{
    "id": number,
    "name": string
}