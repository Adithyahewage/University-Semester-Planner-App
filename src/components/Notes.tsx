import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Trash2, Plus, StickyNote, Search, BookOpen, Star, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('notes');
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      category: 'General',
      tags: [],
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: false
    };
    setNotes(prev => [newNote, ...prev]);
    setEditingNote(newNote);
    setIsDialogOpen(true);
  };

  const updateNote = (updatedNote: Note) => {
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id 
        ? { ...updatedNote, updatedAt: new Date().toISOString() }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const togglePin = (id: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, pinned: !note.pinned } : note
    ));
  };

  const openNoteEditor = (note: Note) => {
    setEditingNote(note);
    setIsDialogOpen(true);
  };

  const handleSaveNote = () => {
    if (editingNote) {
      updateNote(editingNote);
    }
    setIsDialogOpen(false);
    setEditingNote(null);
  };

  const getPriorityColor = (priority: Note['priority']) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const categories = ['all', ...new Set(notes.map(note => note.category))];
  
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pinnedNotes = filteredNotes.filter(note => note.pinned);
  const regularNotes = filteredNotes.filter(note => !note.pinned);

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="mb-2 text-primary">Study Notes</h1>
        <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
      </div>

      {/* Search and Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search notes by title, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={createNote} className="w-full sm:w-auto">
            <Plus size={16} className="mr-2" />
            New Note
          </Button>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <StickyNote className="text-primary mr-2" size={20} />
            <span className="text-2xl font-semibold">{notes.length}</span>
          </div>
          <p className="text-sm text-muted-foreground">Total Notes</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Star className="text-accent mr-2" size={20} />
            <span className="text-2xl font-semibold">{pinnedNotes.length}</span>
          </div>
          <p className="text-sm text-muted-foreground">Pinned Notes</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <BookOpen className="text-primary mr-2" size={20} />
            <span className="text-2xl font-semibold">{categories.length - 1}</span>
          </div>
          <p className="text-sm text-muted-foreground">Categories</p>
        </Card>
      </div>

      {/* Pinned Notes */}
      {pinnedNotes.length > 0 && (
        <div>
          <h3 className="mb-4 flex items-center">
            <Star className="mr-2 text-accent" size={20} />
            Pinned Notes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedNotes.map(note => (
              <Card key={note.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer border-accent/30">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="truncate flex-1 pr-2">{note.title}</h4>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePin(note.id);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Star size={14} className="fill-accent text-accent" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                
                <div onClick={() => openNoteEditor(note)}>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                    {note.content || 'No content yet...'}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getPriorityColor(note.priority)}>
                        {note.priority}
                      </Badge>
                      <span>{note.category}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {formatDate(note.updatedAt)}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Regular Notes */}
      <div>
        <h3 className="mb-4 flex items-center">
          <StickyNote className="mr-2 text-primary" size={20} />
          All Notes ({regularNotes.length})
        </h3>
        
        {regularNotes.length === 0 ? (
          <Card className="p-8 text-center">
            <StickyNote size={48} className="mx-auto mb-4 opacity-50 text-muted-foreground" />
            <p className="text-muted-foreground">
              {notes.length === 0 ? 'No notes yet. Create your first note to get started!' : 'No notes match your search criteria.'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularNotes.map(note => (
              <Card key={note.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="truncate flex-1 pr-2">{note.title}</h4>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePin(note.id);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Star size={14} className="text-muted-foreground hover:text-accent" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                
                <div onClick={() => openNoteEditor(note)}>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                    {note.content || 'No content yet...'}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getPriorityColor(note.priority)}>
                        {note.priority}
                      </Badge>
                      <span>{note.category}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {formatDate(note.updatedAt)}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Note Editor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          
          {editingNote && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    value={editingNote.title}
                    onChange={(e) => setEditingNote({...editingNote, title: e.target.value})}
                    placeholder="Note title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Input
                    value={editingNote.category}
                    onChange={(e) => setEditingNote({...editingNote, category: e.target.value})}
                    placeholder="Category"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <Select 
                  value={editingNote.priority} 
                  onValueChange={(value) => setEditingNote({...editingNote, priority: value as Note['priority']})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <Textarea
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                  placeholder="Write your note content here..."
                  className="min-h-[300px]"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveNote}>
                  Save Note
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}