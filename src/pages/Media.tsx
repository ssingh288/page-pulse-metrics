import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UploadCloud, Image, FileText, Video, MoreVertical, X, Filter, Download, Link as LinkIcon, Copy, Trash, Edit, Eye } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock media data
const mockMediaItems = [
  {
    id: "1",
    name: "hero-banner.jpg",
    type: "image",
    size: 1240000, // in bytes
    dimensions: "1920x1080",
    uploadDate: "2025-04-15",
    lastUsed: "2025-05-01",
    usageCount: 4,
    thumbnail: "https://via.placeholder.com/100x60",
    url: "https://via.placeholder.com/800x450"
  },
  {
    id: "2",
    name: "product-demo.mp4",
    type: "video",
    size: 24500000, // in bytes
    dimensions: "1280x720",
    uploadDate: "2025-04-20",
    lastUsed: "2025-05-03",
    usageCount: 2,
    thumbnail: "https://via.placeholder.com/100x60",
    url: "https://via.placeholder.com/800x450"
  },
  {
    id: "3",
    name: "whitepaper.pdf",
    type: "document",
    size: 3240000, // in bytes
    dimensions: null,
    uploadDate: "2025-04-25",
    lastUsed: "2025-05-02",
    usageCount: 8,
    thumbnail: "https://via.placeholder.com/100x60",
    url: "https://via.placeholder.com/800x450"
  },
  {
    id: "4",
    name: "testimonial-background.jpg",
    type: "image",
    size: 850000, // in bytes
    dimensions: "1200x800",
    uploadDate: "2025-04-05",
    lastUsed: "2025-04-20",
    usageCount: 1,
    thumbnail: "https://via.placeholder.com/100x60",
    url: "https://via.placeholder.com/800x450"
  },
  {
    id: "5",
    name: "team-photo.jpg",
    type: "image",
    size: 1850000, // in bytes
    dimensions: "2400x1600",
    uploadDate: "2025-04-10",
    lastUsed: "2025-05-01",
    usageCount: 3,
    thumbnail: "https://via.placeholder.com/100x60",
    url: "https://via.placeholder.com/800x450"
  },
  {
    id: "6",
    name: "pricing-table.pdf",
    type: "document",
    size: 540000, // in bytes
    dimensions: null,
    uploadDate: "2025-03-28",
    lastUsed: "2025-04-15",
    usageCount: 5,
    thumbnail: "https://via.placeholder.com/100x60",
    url: "https://via.placeholder.com/800x450"
  },
  {
    id: "7",
    name: "feature-overview.mp4",
    type: "video",
    size: 18500000, // in bytes
    dimensions: "1920x1080",
    uploadDate: "2025-04-22",
    lastUsed: "2025-05-04",
    usageCount: 2,
    thumbnail: "https://via.placeholder.com/100x60",
    url: "https://via.placeholder.com/800x450"
  },
  {
    id: "8",
    name: "logo-dark.svg",
    type: "image",
    size: 25000, // in bytes
    dimensions: "512x512",
    uploadDate: "2025-03-10",
    lastUsed: "2025-05-01",
    usageCount: 15,
    thumbnail: "https://via.placeholder.com/100x60",
    url: "https://via.placeholder.com/800x450"
  },
];

// File type icon mapper
const FileTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "image":
      return <Image className="h-4 w-4" />;
    case "video":
      return <Video className="h-4 w-4" />;
    case "document":
      return <FileText className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

// Format file size
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
  else return (bytes / 1073741824).toFixed(1) + ' GB';
};

const Media = () => {
  const [mediaItems, setMediaItems] = useState(mockMediaItems);
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [previewItem, setPreviewItem] = useState<typeof mockMediaItems[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter media items based on type and search term
  const filteredItems = mediaItems.filter(item => {
    const matchesFilter = filter ? item.type === filter : true;
    const matchesSearch = searchTerm 
      ? item.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesFilter && matchesSearch;
  });
  
  // Toggle selection of an item
  const toggleSelection = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };
  
  // Clear all selections
  const clearSelection = () => setSelectedItems([]);
  
  // Preview an item
  const handlePreview = (item: typeof mockMediaItems[0]) => {
    setPreviewItem(item);
  };
  
  // Delete selected items
  const handleDelete = () => {
    setMediaItems(mediaItems.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Media Manager</h2>
          <p className="text-muted-foreground mt-2">
            Upload and manage media assets for your landing pages
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="w-full sm:w-auto">
              <UploadCloud className="mr-2 h-4 w-4" /> Upload New
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilter(null)}>
                  All files
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("image")}>
                  Images
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("video")}>
                  Videos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("document")}>
                  Documents
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {selectedItems.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    <Trash className="mr-2 h-4 w-4" /> Delete Selected ({selectedItems.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the selected {selectedItems.length} item(s). This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-2.5"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
            
            {selectedItems.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearSelection}>
                Clear selection ({selectedItems.length})
              </Button>
            )}
          </div>
          
          <TabsContent value="grid" className="mt-6">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="aspect-[4/3] bg-muted rounded-md animate-pulse" />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex items-center justify-center h-64 border border-dashed rounded-md">
                <div className="text-center">
                  <h3 className="text-lg font-medium">No files found</h3>
                  <p className="text-muted-foreground mt-2">
                    {filter ? `No ${filter} files found` : "No files match your search"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredItems.map((item) => {
                  const isSelected = selectedItems.includes(item.id);
                  
                  return (
                    <Card 
                      key={item.id}
                      className={`overflow-hidden ${isSelected ? 'ring-2 ring-primary' : ''}`}
                    >
                      <div className="relative aspect-[4/3] group">
                        <div 
                          className="absolute inset-0 bg-cover bg-center" 
                          style={{ backgroundImage: `url(${item.thumbnail})` }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button 
                            size="icon" 
                            variant="secondary" 
                            onClick={() => handlePreview(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant={isSelected ? "default" : "secondary"}
                            onClick={() => toggleSelection(item.id)}
                          >
                            {isSelected ? (
                              <X className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="secondary">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" /> Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" /> Download
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <LinkIcon className="h-4 w-4 mr-2" /> Copy link
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="flex gap-1 items-center">
                            <FileTypeIcon type={item.type} />
                            <span>{item.type}</span>
                          </Badge>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <Badge>Selected</Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <div className="truncate font-medium text-sm" title={item.name}>
                          {item.name}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>{formatFileSize(item.size)}</span>
                          <span>{item.uploadDate}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="list" className="mt-6">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-14 bg-muted rounded-md animate-pulse" />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex items-center justify-center h-64 border border-dashed rounded-md">
                <div className="text-center">
                  <h3 className="text-lg font-medium">No files found</h3>
                  <p className="text-muted-foreground mt-2">
                    {filter ? `No ${filter} files found` : "No files match your search"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Type</TableHead>
                      <TableHead className="hidden md:table-cell">Size</TableHead>
                      <TableHead className="hidden lg:table-cell">Upload Date</TableHead>
                      <TableHead className="hidden lg:table-cell">Last Used</TableHead>
                      <TableHead className="hidden xl:table-cell">Usage Count</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow 
                        key={item.id}
                        className={selectedItems.includes(item.id) ? "bg-muted/50" : ""}
                      >
                        <TableCell className="pr-0">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => toggleSelection(item.id)}
                          >
                            <FileTypeIcon type={item.type} />
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.type}</TableCell>
                        <TableCell className="hidden md:table-cell">{formatFileSize(item.size)}</TableCell>
                        <TableCell className="hidden lg:table-cell">{item.uploadDate}</TableCell>
                        <TableCell className="hidden lg:table-cell">{item.lastUsed}</TableCell>
                        <TableCell className="hidden xl:table-cell">{item.usageCount}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handlePreview(item)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" /> Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" /> Download
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <LinkIcon className="h-4 w-4 mr-2" /> Copy link
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleSelection(item.id)}>
                                  {selectedItems.includes(item.id) ? (
                                    <>
                                      <X className="h-4 w-4 mr-2" /> Deselect
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-4 w-4 mr-2" /> Select
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash className="h-4 w-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Preview Dialog */}
        {previewItem && (
          <AlertDialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
            <AlertDialogContent className={isMobile ? "w-[95vw] max-w-lg" : "max-w-3xl"}>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <FileTypeIcon type={previewItem.type} />
                    {previewItem.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <LinkIcon className="h-4 w-4 mr-2" /> Copy Link
                    </Button>
                  </div>
                </AlertDialogTitle>
              </AlertDialogHeader>
              
              <div className="my-4 flex justify-center border rounded-md p-2">
                {previewItem.type === "image" && (
                  <img 
                    src={previewItem.url} 
                    alt={previewItem.name}
                    className="max-h-[60vh] object-contain"
                  />
                )}
                {previewItem.type === "video" && (
                  <video 
                    controls 
                    className="max-h-[60vh] max-w-full"
                  >
                    <source src={previewItem.url} />
                    Your browser does not support the video tag.
                  </video>
                )}
                {previewItem.type === "document" && (
                  <div className="flex items-center justify-center w-full h-[40vh] bg-muted">
                    <FileText className="h-20 w-20 text-muted-foreground" />
                    <p className="text-muted-foreground ml-2">Document preview not available</p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Upload Date</Label>
                  <p className="text-sm font-medium">{previewItem.uploadDate}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Size</Label>
                  <p className="text-sm font-medium">{formatFileSize(previewItem.size)}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Dimensions</Label>
                  <p className="text-sm font-medium">{previewItem.dimensions || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Used On</Label>
                  <p className="text-sm font-medium">{previewItem.usageCount} pages</p>
                </div>
              </div>
              
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </Layout>
  );
};

export default Media;
