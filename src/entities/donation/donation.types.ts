export interface DonationEntity {
  id: string
  type: 'monetary' | 'in_kind'
  amount?: number
  status: string
  createdAt?: string
}
