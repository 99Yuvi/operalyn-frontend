import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { getConversations } from '@/api/conversations'
import { getInitials, getAvatarColor, timeAgo, cn } from '@/lib/utils'

export default function ConversationsList() {
  const { user }    = useAuth()
  const isClient    = user?.role === 'client'
  const { data, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn:  getConversations,
  })
  const conversations = data?.data ?? []

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-1" style={{ fontFamily: 'Georgia, serif' }}>Messages</h2>
      <p className="text-sm text-slate-500 mb-5">One conversation per active contract.</p>

      {isLoading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />)}</div>
      ) : conversations.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
          <p className="text-3xl mb-2">💬</p>
          <p className="text-base font-semibold text-slate-700 mb-1">No conversations yet</p>
          <p className="text-sm text-slate-500">Conversations open automatically when a contract starts.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map(conv => {
            const other  = isClient ? conv.freelancer : conv.client
            const colors = getAvatarColor(other?.name ?? '')
            const chatPath = isClient
              ? `/client/chat/${conv.id}`
              : `/freelancer/chat/${conv.id}`
            return (
              <Link key={conv.id} to={chatPath}
                className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-slate-300 transition-colors">
                <div className={cn('h-10 w-10 rounded-full text-sm font-semibold flex items-center justify-center shrink-0', colors.bg, colors.text)}>
                  {getInitials(other?.name ?? '')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{other?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{conv.contract?.project?.title}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {conv.last_message_at && (
                    <span className="text-xs text-slate-400">{timeAgo(conv.last_message_at)}</span>
                  )}
                  {conv.unread_count > 0 && (
                    <span className="h-5 min-w-[20px] px-1 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
