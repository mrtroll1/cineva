import { inviteRepository } from '../repositories/inviteRepository.js'

export async function getInvites(userId: string) {
  const rows = await inviteRepository.findByUserId(userId)

  return rows.map((r) => ({
    id: r.id,
    whenText: r.whenText,
    whereText: r.whereText,
    status: r.status,
    createdAt: r.createdAt,
    direction: r.fromUserId === userId ? 'sent' as const : 'received' as const,
    otherUser: {
      id: r.fromUserId === userId ? r.toUserId : r.fromUserId,
      name: r.fromUserId === userId
        ? `${r.toUserName} ${r.toUserLastName}`
        : `${r.fromUserName} ${r.fromUserLastName}`,
      photo: r.fromUserId === userId ? r.toUserPhoto : r.fromUserPhoto,
    },
  }))
}
