import { useEffect, useRef, useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { useConversation } from '@/hooks/useConversation'
import { getConversation, getMessages, markConversationRead } from '@/api/conversations'
import { conversationKeys } from '@/lib/queryKeys'
import { cn, getInitials, getAvatarColor, timeAgo } from '@/lib/utils'

export default function ChatView() {
  const { conversationId }  = useParams()
  const { user }            = useAuth()
  const qc                  = useQueryClient()
  const messagesEndRef      = useRef(null)
  const inputRef            = useRef(null)

  const [input, setInput]   = useState('')
  const [sending, setSending] = useState(false)
  const [pendingMsgs, setPending] = useState([]) // optimistic

  const { online, typing, sendMessage, emitTypingStart, emitTypingStop, emitMessagesRead } =
    useConversation(conversationId)

  // Fetch conversation meta
  const { data: convData } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn:  () => getConversation(conversationId),
    enabled:  !!conversationId,
  })

  // Fetch message history
  const { data: msgData, isLoading: loadingMsgs } = useQuery({
    queryKey: conversationKeys.messages(conversationId),
    queryFn:  () => getMessages(conversationId),
    enabled:  !!conversationId,
    staleTime: 0,
  })

  const conv     = convData?.data
  const messages = [...(msgData?.data ?? [])].reverse() // API returns newest-first, display oldest-first

  // Mark as read when opened
  useEffect(() => {
    if (conversationId) {
      markConversationRead(conversationId).catch(() => {})
      emitMessagesRead()
    }
  }, [conversationId])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, pendingMsgs.length])

  // Typing debounce
  const typingTimeout = useRef(null)
  const handleInputChange = (e) => {
    setInput(e.target.value)
    emitTypingStart()
    clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(emitTypingStop, 1500)
  }

  const handleSend = useCallback(() => {
    const body = input.trim()
    if (!body || sending) return

    const tempId = `temp_${Date.now()}`

    // Optimistic message
    setPending(prev => [...prev, { tempId, body, sender_id: user.id, created_at: new Date().toISOString() }])
    setInput('')
    emitTypingStop()
    setSending(true)

    sendMessage(body, tempId)

    // Remove optimistic after 5s (socket handler will replace it with real message)
    setTimeout(() => {
      setPending(prev => prev.filter(m => m.tempId !== tempId))
      setSending(false)
    }, 5000)
  }, [input, sending, user?.id, sendMessage])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Determine the "other party"
  const isClient     = user?.role === 'client'
  const otherUser    = conv ? (isClient ? conv.freelancer : conv.client) : null
  const otherColors  = getAvatarColor(otherUser?.name ?? '')
  const backPath     = isClient
    ? `/client/contracts/${conv?.contract_id}`
    : `/freelancer/contracts/${conv?.contract_id}`

  return (
    <div className="flex flex-col h-full max-h-[calc(100dvh-4rem)]">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-white shrink-0">
        <Link to={backPath} className="text-slate-400 hover:text-slate-600 text-sm shrink-0">←</Link>

        {otherUser && (
          <>
            <div className="relative shrink-0">
              <div className={cn('h-9 w-9 rounded-full text-sm font-semibold flex items-center justify-center', otherColors.bg, otherColors.text)}>
                {getInitials(otherUser.name)}
              </div>
              {online && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 leading-tight">{otherUser.name}</p>
              <p className="text-xs text-slate-400">
                {typing ? (
                  <span className="text-green-600 animate-pulse">typing…</span>
                ) : online ? (
                  <span className="text-green-600">Online</span>
                ) : 'Offline'}
              </p>
            </div>
          </>
        )}

        <div className="ml-auto text-xs text-slate-400 truncate max-w-[200px]">
          {conv?.contract?.project?.title}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
        {loadingMsgs ? (
          <div className="text-center text-sm text-slate-400 py-8">Loading messages…</div>
        ) : messages.length === 0 && pendingMsgs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-2">💬</p>
            <p className="text-sm text-slate-500">No messages yet. Say hello!</p>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} isOwn={msg.sender_id === user?.id} />
            ))}
            {pendingMsgs.map(msg => (
              <MessageBubble key={msg.tempId} message={msg} isOwn sending />
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3">
        {typing && (
          <p className="text-xs text-green-600 mb-1.5 animate-pulse">
            {otherUser?.name?.split(' ')[0]} is typing…
          </p>
        )}
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send)"
            rows={1}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-400 max-h-32 overflow-y-auto"
            style={{ minHeight: '42px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="h-10 w-10 rounded-xl bg-slate-700 text-white flex items-center justify-center hover:bg-slate-800 disabled:opacity-40 transition-colors shrink-0"
          >
            <span className="text-base leading-none">➤</span>
          </button>
        </div>
        <p className="text-xs text-slate-300 mt-1 text-center">Shift+Enter for new line</p>
      </div>
    </div>
  )
}

/* ── Message bubble ── */
function MessageBubble({ message, isOwn, sending = false }) {
  return (
    <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
      <div className={cn(
        'max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
        isOwn
          ? 'bg-slate-700 text-white rounded-br-md'
          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md',
        sending && 'opacity-60'
      )}>
        <p className="whitespace-pre-wrap break-words">{message.body}</p>
        <div className={cn('flex items-center gap-1 mt-0.5', isOwn ? 'justify-end' : 'justify-start')}>
          <span className={cn('text-[10px]', isOwn ? 'text-slate-300' : 'text-slate-400')}>
            {timeAgo(message.created_at)}
          </span>
          {isOwn && (
            <span className="text-[10px] text-slate-300">
              {sending ? '⋯' : message.read_at ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
