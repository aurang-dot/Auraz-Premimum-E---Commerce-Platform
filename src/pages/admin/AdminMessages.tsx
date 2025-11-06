import { useState } from 'react';
import { MessageCircle, Send, Clock, CheckCircle2, User as UserIcon, Bot, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useApp } from '../../lib/AppContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';

export function AdminMessages() {
  const { conversations, addMessageToConversation, closeConversation, deleteConversation, users } = useApp();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

  const activeConversations = conversations.filter(c => c.transferredToAdmin && c.status !== 'closed');
  const closedConversations = conversations.filter(c => c.status === 'closed');
  
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  // Helper function to get user details
  const getUserDetails = (conv: typeof conversations[0]) => {
    if (conv.userId) {
      const user = users.find(u => u.id === conv.userId);
      if (user) {
        return {
          name: user.name,
          email: user.email,
        };
      }
    }
    return {
      name: conv.visitorName || 'Anonymous',
      email: conv.visitorEmail,
    };
  };

  const handleSendReply = () => {
    if (!selectedConversationId || !replyMessage.trim()) return;

    addMessageToConversation(selectedConversationId, 'admin', replyMessage);
    setReplyMessage('');
  };

  const handleCloseConversation = (conversationId: string) => {
    if (confirm('Are you sure you want to close this conversation?')) {
      closeConversation(conversationId);
      if (selectedConversationId === conversationId) {
        setSelectedConversationId(null);
      }
    }
  };

  const handleDeleteClick = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversationToDelete(conversationId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (conversationToDelete) {
      deleteConversation(conversationToDelete);
      if (selectedConversationId === conversationToDelete) {
        setSelectedConversationId(null);
      }
      setConversationToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const ConversationList = ({ convos }: { convos: typeof conversations }) => (
    <div className="space-y-2">
      {convos.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No conversations yet</p>
        </div>
      ) : (
        convos.map((conv) => {
          const lastMessage = conv.messages[conv.messages.length - 1];
          const unreadByAdmin = !conv.adminReplied && conv.messages.some(m => m.sender === 'user');
          const userDetails = getUserDetails(conv);

          return (
            <Card
              key={conv.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedConversationId === conv.id ? 'border-[#591220] bg-[#591220]/5' : ''
              }`}
              onClick={() => setSelectedConversationId(conv.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="bg-[#591220]/10 p-2 rounded-full flex-shrink-0">
                      <UserIcon className="h-4 w-4 text-[#591220]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium truncate">
                        {userDetails.name}
                      </h4>
                      {userDetails.email && (
                        <p className="text-xs text-gray-500 truncate">{userDetails.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {unreadByAdmin && (
                      <Badge className="bg-red-500">New</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                      onClick={(e) => handleDeleteClick(conv.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {lastMessage && (
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p 
                      className="text-sm text-gray-600 flex-1 line-clamp-2 min-w-0"
                      style={{ 
                        wordBreak: 'break-word', 
                        overflowWrap: 'anywhere'
                      }}
                    >
                      {lastMessage.sender === 'admin' ? 'You: ' : ''}
                      {lastMessage.message}
                    </p>
                    <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap ml-2">
                      {formatTime(lastMessage.createdAt)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {conv.messages.length} messages
                  </Badge>
                  {conv.status === 'closed' && (
                    <Badge variant="outline" className="text-xs text-gray-500">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Closed
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="mb-2">Customer Messages</h1>
        <p className="text-gray-600">
          Respond to customer inquiries from the AI Assistant
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="active">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="active">
                    Active ({activeConversations.length})
                  </TabsTrigger>
                  <TabsTrigger value="closed">
                    Closed ({closedConversations.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="active">
                  <ScrollArea className="h-[600px]">
                    <ConversationList convos={activeConversations} />
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="closed">
                  <ScrollArea className="h-[600px]">
                    <ConversationList convos={closedConversations} />
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Chat Window */}
        <div className="md:col-span-2">
          {selectedConversation ? (
            <Card className="h-[700px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1 pr-4">
                    <CardTitle className="truncate">
                      {getUserDetails(selectedConversation).name}
                    </CardTitle>
                    <CardDescription className="truncate">
                      Started {formatTime(selectedConversation.createdAt)}
                      {getUserDetails(selectedConversation).email && ` • ${getUserDetails(selectedConversation).email}`}
                    </CardDescription>
                  </div>
                  {selectedConversation.status !== 'closed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCloseConversation(selectedConversation.id)}
                      className="flex-shrink-0"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Close
                    </Button>
                  )}
                </div>
              </CardHeader>

              {/* Messages */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {selectedConversation.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.sender !== 'admin' && (
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          msg.sender === 'ai' ? 'bg-[#591220]' : 'bg-gray-300'
                        }`}>
                          {msg.sender === 'ai' ? (
                            <Bot className="h-4 w-4 text-white" />
                          ) : (
                            <UserIcon className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                      )}
                      <div className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'} max-w-[70%] min-w-0`}>
                        <div
                          className={`rounded-lg p-3 w-full min-w-0 ${
                            msg.sender === 'admin'
                              ? 'bg-[#591220] text-white'
                              : msg.sender === 'ai'
                              ? 'bg-gray-100 text-gray-900'
                              : 'bg-blue-50 text-gray-900'
                          }`}
                          style={{ 
                            wordBreak: 'break-word', 
                            overflowWrap: 'anywhere',
                            wordWrap: 'break-word',
                            hyphens: 'auto'
                          }}
                        >
                          <p 
                            className="text-sm whitespace-pre-wrap" 
                            style={{ 
                              wordBreak: 'break-word', 
                              overflowWrap: 'anywhere',
                              wordWrap: 'break-word'
                            }}
                          >
                            {msg.message}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Reply Input */}
              {selectedConversation.status !== 'closed' && (
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your reply..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendReply}
                      className="bg-[#591220] hover:bg-[#6d1728]"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="h-[700px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Select a conversation to view messages</p>
                <p className="text-sm mt-2">Customer messages will appear here</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone and all messages will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
