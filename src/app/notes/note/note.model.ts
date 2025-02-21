export interface Note{
    title: string,
    content: string,
    userId: number,
    categoryId: [number],
    attachments: [Attachment]
}

export interface Attachment{
    "id": number,
    "fileName": string,
    "fileType": string,
    "downloadUrl": string
}