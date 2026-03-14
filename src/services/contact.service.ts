import { axiosClient, API_ENDPOINTS } from '@/apis'
import type {
  ContactApiResponse,
  ContactPayload,
  ContactSubmitResult
} from '@/types/contact.type'

export const contactService = {
  create: async (payload: ContactPayload) => {
    const response = await axiosClient.post<
      ContactApiResponse<ContactSubmitResult>
    >(API_ENDPOINTS.CONTACTS.CREATE, payload)

    return response.data
  }
}
