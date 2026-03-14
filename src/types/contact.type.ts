export interface ContactPayload {
  fullName: string
  email: string
  phoneNumber: string
  message: string
}

export interface ContactItem {
  id: number
  fullName: string
  email: string
  phoneNumber: string
  message: string
  isReply: boolean
  createdAt: string
}

export interface ContactApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface ContactSubmitResult {
  contact: ContactItem
  emailNotificationSent: boolean
  autoReplySent: boolean
}
