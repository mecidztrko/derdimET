import { useState } from 'react';
import { Card, CardContent } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import {
  MessageCircle,
  Search,
  Send,
  Building2,
  CheckCircle2,
  Paperclip,
  MoreVertical,
} from 'lucide-react';

const mockConversations = [
  {
    id: '1',
    slaughterhouse: {
      name: 'Anadolu Kesimhane A.Ş.',
      location: 'İstanbul, Pendik',
      verified: true,
      avatar: 'AK',
    },
    lastMessage: 'Teklif ettiğiniz miktarı kabul ediyoruz. Teslimat detayları için görüşelim.',
    timestamp: '10 dk önce',
    unread: 2,
  },
  {
    id: '2',
    slaughterhouse: {
      name: 'Marmara Kesimevi',
      location: 'Bursa, Gemlik',
      verified: true,
      avatar: 'MK',
    },
    lastMessage: 'Ürün stoklarımızı güncelledik, inceleyebilirsiniz.',
    timestamp: '2 saat önce',
    unread: 0,
  },
  {
    id: '3',
    slaughterhouse: {
      name: 'Trakya Kesimhane',
      location: 'Edirne, Keşan',
      verified: true,
      avatar: 'TK',
    },
    lastMessage: 'Teşekkürler, teslimat tamamlandı.',
    timestamp: 'Dün',
    unread: 0,
  },
  {
    id: '4',
    slaughterhouse: {
      name: 'Ege Et Kesimhane',
      location: 'İzmir, Torbalı',
      verified: false,
      avatar: 'EE',
    },
    lastMessage: 'Sertifika belgelerini ekte gönderiyorum.',
    timestamp: '2 gün önce',
    unread: 1,
  },
];

const mockMessages = [
  {
    id: '1',
    sender: 'slaughterhouse',
    content: 'Merhaba, dana biftek ilanımıza ilgi gösterdiğiniz için teşekkürler.',
    timestamp: '14:30',
  },
  {
    id: '2',
    sender: 'me',
    content: '200 kg için fiyat teklifi verebilir miyim?',
    timestamp: '14:32',
  },
  {
    id: '3',
    sender: 'slaughterhouse',
    content: 'Tabii ki. Minimum sipariş miktarı 150 kg olduğu için 200 kg için uygun.',
    timestamp: '14:35',
  },
  {
    id: '4',
    sender: 'me',
    content: 'Harika. kg başına ₺410 teklif edebilirim.',
    timestamp: '14:36',
  },
  {
    id: '5',
    sender: 'slaughterhouse',
    content: 'Teklif ettiğiniz miktarı kabul ediyoruz. Teslimat detayları için görüşelim.',
    timestamp: '14:40',
  },
];

export function BuyerMessages() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');

  const filteredConversations = mockConversations.filter((conv) =>
    conv.slaughterhouse.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Mesajlar</h1>
        <p className="text-muted-foreground">
          Kesimhanelerle iletişim kurun
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
                  placeholder="Kesimhane ara..."
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
                        {conversation.slaughterhouse.avatar}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {conversation.slaughterhouse.name}
                          </p>
                          {conversation.slaughterhouse.verified && (
                            <CheckCircle2 className="size-3.5 text-success flex-shrink-0" />
                          )}
                        </div>
                        {conversation.unread > 0 && (
                          <Badge variant="primary" className="flex-shrink-0">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
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
                      {selectedConversation.slaughterhouse.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="font-medium">
                        {selectedConversation.slaughterhouse.name}
                      </p>
                      {selectedConversation.slaughterhouse.verified && (
                        <CheckCircle2 className="size-3.5 text-success" />
                      )}
                    </div>
                    <p className="text-small text-muted-foreground">
                      {selectedConversation.slaughterhouse.location}
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
                        // Handle send message
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
