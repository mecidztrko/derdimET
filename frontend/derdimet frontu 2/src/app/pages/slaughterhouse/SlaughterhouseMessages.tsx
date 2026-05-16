import { useState } from 'react';
import { Card, CardContent } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import {
  MessageCircle,
  Search,
  Send,
  User,
  Building2,
  CheckCircle2,
  Paperclip,
  MoreVertical,
} from 'lucide-react';

const mockConversations = [
  {
    id: '1',
    type: 'seller' as const,
    contact: {
      name: 'Ali Yılmaz',
      title: 'Hayvan Satıcısı',
      location: 'Konya, Ereğli',
      verified: true,
      avatar: 'AY',
    },
    lastMessage: 'Kuzular için teklifinizi aldım, görüşelim.',
    timestamp: '10 dk önce',
    unread: 2,
  },
  {
    id: '2',
    type: 'buyer' as const,
    contact: {
      name: 'Mehmet Yılmaz',
      title: 'Et Alıcısı - Beyaz Et Kasap',
      location: 'İstanbul, Kadıköy',
      verified: true,
      avatar: 'MY',
    },
    lastMessage: 'Biftek ilanınız için görüşmek istiyorum.',
    timestamp: '1 saat önce',
    unread: 0,
  },
  {
    id: '3',
    type: 'seller' as const,
    contact: {
      name: 'Mehmet Demir',
      title: 'Hayvan Satıcısı',
      location: 'Afyon, Sandıklı',
      verified: true,
      avatar: 'MD',
    },
    lastMessage: 'Teslimat tarihi olarak ne önerirsiniz?',
    timestamp: 'Dün',
    unread: 1,
  },
];

const mockMessages = [
  {
    id: '1',
    sender: 'contact',
    content: 'Merhaba, kuzularım için teklif gönderdiniz.',
    timestamp: '14:20',
  },
  {
    id: '2',
    sender: 'me',
    content: 'Evet, 30 baş için kg başına ₺183 teklif ettik.',
    timestamp: '14:22',
  },
  {
    id: '3',
    sender: 'contact',
    content: 'Fiyat uygun ama 40 baş satmak istiyorum.',
    timestamp: '14:25',
  },
  {
    id: '4',
    sender: 'me',
    content: '40 baş için de aynı fiyatı uygulayabiliriz.',
    timestamp: '14:28',
  },
  {
    id: '5',
    sender: 'contact',
    content: 'Kuzular için teklifinizi aldım, görüşelim.',
    timestamp: '14:30',
  },
];

export function SlaughterhouseMessages() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');

  const filteredConversations = mockConversations.filter((conv) =>
    conv.contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Mesajlar</h1>
        <p className="text-muted-foreground">
          Satıcılar ve alıcılarla iletişim kurun
        </p>
      </div>

      <Card className="h-[calc(100vh-280px)] min-h-[600px]">
        <CardContent className="p-0 h-full">
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-full md:w-80 border-r border-border flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-border">
                <Input
                  type="search"
                  placeholder="Ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={Search}
                />
              </div>

              {/* Conversation List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full p-4 flex gap-3 border-b border-border hover:bg-muted/50 transition-colors text-left ${
                      selectedConversation.id === conversation.id
                        ? 'bg-primary-soft'
                        : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-small font-medium text-primary">
                        {conversation.contact.avatar}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {conversation.contact.name}
                          </p>
                          {conversation.contact.verified && (
                            <CheckCircle2 className="size-3.5 text-success flex-shrink-0" />
                          )}
                          <Badge
                            variant={conversation.type === 'seller' ? 'secondary' : 'primary'}
                            className="flex-shrink-0"
                          >
                            {conversation.type === 'seller' ? 'Satıcı' : 'Alıcı'}
                          </Badge>
                        </div>
                        {conversation.unread > 0 && (
                          <Badge variant="primary" className="flex-shrink-0">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-caption text-muted-foreground mb-1">
                        {conversation.contact.title}
                      </p>
                      <p className="text-small text-muted-foreground truncate mb-1">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-caption text-muted-foreground">
                        {conversation.timestamp}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="hidden md:flex flex-1 flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-small font-medium text-primary">
                      {selectedConversation.contact.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="font-medium">
                        {selectedConversation.contact.name}
                      </p>
                      {selectedConversation.contact.verified && (
                        <CheckCircle2 className="size-3.5 text-success" />
                      )}
                      <Badge
                        variant={selectedConversation.type === 'seller' ? 'secondary' : 'primary'}
                      >
                        {selectedConversation.type === 'seller' ? 'Satıcı' : 'Alıcı'}
                      </Badge>
                    </div>
                    <p className="text-small text-muted-foreground">
                      {selectedConversation.contact.title}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="size-5" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {mockMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === 'me' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        message.sender === 'me'
                          ? 'bg-primary text-white'
                          : 'bg-muted'
                      } rounded-lg px-4 py-2.5`}
                    >
                      <p className="text-small">{message.content}</p>
                      <p
                        className={`text-caption mt-1 ${
                          message.sender === 'me'
                            ? 'text-white/70'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="size-5" />
                  </Button>
                  <Input
                    placeholder="Mesajınızı yazın..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        setMessageInput('');
                      }
                    }}
                    className="flex-1"
                  />
                  <Button variant="primary">
                    <Send className="size-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile: Show placeholder */}
            <div className="flex md:hidden flex-1 items-center justify-center p-8">
              <div className="text-center">
                <MessageCircle className="size-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Mesajları görüntülemek için bir konuşma seçin
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
