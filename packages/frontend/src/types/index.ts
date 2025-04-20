export type Participant = {
  address: string
  name: string
}

export type Winner = Participant & {
  pickerId: string
  txDigest: string
}

export type Picker = {
  id: string
  title: string
  imageBlobId: string
  participants: Participant[]
  winner: Winner | null
}

// export type ParticipantJoinedEvent = {
//   picker_id: string
//   participant_addr: string
//   participant_name: string
// }

export type WinnerSelectedEvent = {
  picker_id: string
  participant_addr: string
  participant_name: string
}
