'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/lib/notion';
import { useAccessibility } from '@/context/AccessibilityContext';
import { cn } from '@/lib/utils';
import { 
  ChevronRight, 
  FileText, 
  Download, 
  Bookmark, 
  CheckSquare, 
  Square,
  Music,
  Link as LinkIcon,
  Database,
  List,
  Home
} from 'lucide-react';

interface BlogPostContentProps {
  post: BlogPost;
}

type NotionRichTextAnnotation = {
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
  code?: boolean;
  color?: string;
};

type NotionRichText = {
  plain_text: string;
  annotations?: NotionRichTextAnnotation;
  href?: string | null;
};

type NotionBlockValue = {
  rich_text?: NotionRichText[];
  caption?: NotionRichText[];
  is_toggleable?: boolean;
  checked?: boolean;
  language?: string;
  url?: string;
  type?: 'external' | 'file';
  external?: { url?: string };
  file?: { url?: string };
  name?: string;
  icon?: { emoji?: string };
  expression?: string;
  has_column_header?: boolean;
  has_row_header?: boolean;
  table_row?: { cells?: NotionRichText[][] };
  page_id?: string;
  database_id?: string;
  title?: string;
};

type NotionBlockNode = {
  id: string;
  type: string;
  children?: NotionBlockNode[];
  [key: string]: unknown;
};

// Create a context to share blog post data with all components
const BlogPostContext = React.createContext<{ post: BlogPost; blocks: NotionBlockNode[] } | undefined>(undefined);

const useBlogPost = () => {
  const context = React.useContext(BlogPostContext);
  if (!context) {
    throw new Error('useBlogPost must be used within a BlogPostProvider');
  }
  return context;
};

// Helper to render Rich Text with annotations
const RichTextRenderer = ({ text }: { text?: NotionRichText[] }) => {
  if (!text || text.length === 0) return null;
  
  return (
    <>
      {text.map((t, i) => {
        const { annotations, plain_text, href } = t;
        
        let content: React.ReactNode = plain_text;

        if (annotations) {
          if (annotations.bold) content = <strong key={`b-${i}`}>{content}</strong>;
          if (annotations.italic) content = <em key={`i-${i}`}>{content}</em>;
          if (annotations.strikethrough) content = <s key={`s-${i}`}>{content}</s>;
          if (annotations.underline) content = <u key={`u-${i}`}>{content}</u>;
          if (annotations.code) content = <code key={`c-${i}`} className="bg-muted px-1 py-0.5 rounded font-mono text-sm">{content}</code>;
          
          if (annotations.color && annotations.color !== 'default') {
             const style: React.CSSProperties = annotations.color.includes('_background') 
                ? { backgroundColor: annotations.color.replace('_background', '') === 'gray' ? '#f3f4f6' : undefined } 
                : { color: annotations.color };
             
             content = <span key={`col-${i}`} style={style} className={annotations.color.includes('_background') ? "px-1 rounded" : ""}>{content}</span>;
          }
        }

        if (href) {
          return (
            <Link key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4">
              {content}
            </Link>
          );
        }

        return <React.Fragment key={i}>{content}</React.Fragment>;
      })}
    </>
  );
};

// Component to render a list of blocks, handling grouping of list items
const BlockListRenderer = ({ blocks }: { blocks: NotionBlockNode[] }) => {
  if (!blocks || blocks.length === 0) return null;

  const result: React.ReactNode[] = [];
  let currentListType: string | null = null;
  let currentList: NotionBlockNode[] = [];

  blocks.forEach((block, index) => {
    if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
      if (currentListType && currentListType !== block.type) {
         // Close previous list
         const ListTag = currentListType === 'bulleted_list_item' ? 'ul' : 'ol';
         result.push(
           <ListTag key={`list-${index}-prev`} className={currentListType === 'bulleted_list_item' ? 'list-disc' : 'list-decimal'}>
             {currentList.map(item => <BlockRenderer key={item.id} block={item} />)}
           </ListTag>
         );
         currentList = [];
      }
      currentListType = block.type;
      currentList.push(block);
    } else {
      if (currentListType) {
         // Close current list
         const ListTag = currentListType === 'bulleted_list_item' ? 'ul' : 'ol';
         result.push(
           <ListTag key={`list-${index}`} className={currentListType === 'bulleted_list_item' ? 'list-disc' : 'list-decimal'}>
             {currentList.map(item => <BlockRenderer key={item.id} block={item} />)}
           </ListTag>
         );
         currentList = [];
         currentListType = null;
      }
      result.push(<BlockRenderer key={block.id} block={block} />);
    }
  });

  // Close any remaining list
  if (currentListType) {
     const ListTag = currentListType === 'bulleted_list_item' ? 'ul' : 'ol';
     result.push(
       <ListTag key={`list-end`} className={currentListType === 'bulleted_list_item' ? 'list-disc' : 'list-decimal'}>
         {currentList.map(item => <BlockRenderer key={item.id} block={item} />)}
       </ListTag>
     );
  }

  return <>{result}</>;
};

const TableOfContents = () => {
  const { blocks } = useBlogPost();
  
  const headings = React.useMemo(() => {
    const results: { id: string; text: string; level: number }[] = [];
    
    const traverse = (nodes: NotionBlockNode[]) => {
      if (!nodes) return;
      nodes.forEach(node => {
        if (node.type === 'heading_1' || node.type === 'heading_2' || node.type === 'heading_3') {
          const nodeValue = node[node.type] as NotionBlockValue;
          const text = nodeValue.rich_text?.map((t) => t.plain_text).join('') ?? '';
          const level = parseInt(node.type.replace('heading_', ''));
          results.push({ id: node.id, text, level });
        }
        if (node.children) {
          traverse(node.children);
        }
      });
    };
    
    traverse(blocks);
    return results;
  }, [blocks]);

  if (headings.length === 0) return null;

  return (
    <nav className="my-8 p-6 bg-muted/30 rounded-xl border not-prose">
      <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
        <List className="w-5 h-5" />
        Table of Contents
      </h4>
      <ul className="space-y-2 text-sm">
        {headings.map(heading => (
          <li key={heading.id} style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}>
            <a 
              href={`#${heading.id}`} 
              className="text-muted-foreground hover:text-primary transition-colors block py-1 line-clamp-1"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Recursive Block Renderer
const BlockRenderer = ({ block }: { block: NotionBlockNode }) => {
  const { type, id } = block;
  const value = block[type] as NotionBlockValue;
  const children = block.children ?? [];

  if (!value && type !== 'divider' && type !== 'column_list' && type !== 'column' && type !== 'breadcrumb' && type !== 'table_of_contents' && type !== 'template') return null;

  switch (type) {
    case 'table_of_contents':
      return <TableOfContents />;

    case 'breadcrumb':
      return (
        <nav className="flex items-center text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
          <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
          <span className="text-foreground font-medium">Current Post</span>
        </nav>
      );
      
    case 'template':
       return <BlockListRenderer blocks={children} />;

    case 'paragraph':
      return (
        <p className="mb-4 leading-relaxed">
          <RichTextRenderer text={value.rich_text} />
        </p>
      );
    
    case 'heading_1':
      if (value.is_toggleable) {
        return (
          <details className="group mb-4" id={id}>
            <summary className="list-none cursor-pointer flex items-center gap-2 text-2xl font-bold mt-8 mb-4 hover:bg-muted/50 p-1 rounded transition-colors">
              <ChevronRight className="w-6 h-6 transition-transform group-open:rotate-90 shrink-0" />
              <span><RichTextRenderer text={value.rich_text} /></span>
            </summary>
            <div className="pl-8 border-l-2 border-muted ml-3">
              <BlockListRenderer blocks={children} />
            </div>
          </details>
        );
      }
      return (
        <h2 id={id} className="text-3xl font-bold mt-8 mb-4 scroll-m-20 border-b pb-2">
          <RichTextRenderer text={value.rich_text} />
        </h2>
      );

    case 'heading_2':
      if (value.is_toggleable) {
        return (
          <details className="group mb-3" id={id}>
            <summary className="list-none cursor-pointer flex items-center gap-2 text-xl font-bold mt-6 mb-3 hover:bg-muted/50 p-1 rounded transition-colors">
              <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90 shrink-0" />
              <span><RichTextRenderer text={value.rich_text} /></span>
            </summary>
            <div className="pl-7 border-l-2 border-muted ml-2.5">
              <BlockListRenderer blocks={children} />
            </div>
          </details>
        );
      }
      return (
        <h3 id={id} className="text-2xl font-semibold mt-6 mb-3 scroll-m-20">
          <RichTextRenderer text={value.rich_text} />
        </h3>
      );

    case 'heading_3':
      if (value.is_toggleable) {
        return (
          <details className="group mb-2" id={id}>
            <summary className="list-none cursor-pointer flex items-center gap-2 text-lg font-semibold mt-4 mb-2 hover:bg-muted/50 p-1 rounded transition-colors">
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 shrink-0" />
              <span><RichTextRenderer text={value.rich_text} /></span>
            </summary>
            <div className="pl-6 border-l-2 border-muted ml-2">
              <BlockListRenderer blocks={children} />
            </div>
          </details>
        );
      }
      return (
        <h4 id={id} className="text-xl font-semibold mt-4 mb-2 scroll-m-20">
          <RichTextRenderer text={value.rich_text} />
        </h4>
      );

    case 'bulleted_list_item':
      return (
        <li className="list-disc ml-5 mb-1 pl-1 marker:text-muted-foreground">
          <RichTextRenderer text={value.rich_text} />
          {children.length > 0 && (
             <div className="mt-1">
               <BlockListRenderer blocks={children} />
             </div>
          )}
        </li>
      );

    case 'numbered_list_item':
      return (
        <li className="list-decimal ml-5 mb-1 pl-1 marker:text-muted-foreground">
          <RichTextRenderer text={value.rich_text} />
           {children.length > 0 && (
             <div className="mt-1">
               <BlockListRenderer blocks={children} />
             </div>
          )}
        </li>
      );
    
    case 'to_do':
      return (
        <div className="flex items-start gap-2 mb-2">
          <div className="mt-1">
            {value.checked ? (
              <CheckSquare className="w-5 h-5 text-primary" />
            ) : (
              <Square className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <div className={cn(value.checked && "line-through text-muted-foreground")}>
            <RichTextRenderer text={value.rich_text} />
          </div>
           {children.length > 0 && (
             <div className="ml-7 mt-1 w-full">
               <BlockListRenderer blocks={children} />
             </div>
          )}
        </div>
      );

    case 'quote':
      return (
        <blockquote className="border-l-4 border-primary pl-4 italic my-4 py-2 bg-muted/30 rounded-r text-lg">
          <RichTextRenderer text={value.rich_text} />
        </blockquote>
      );

    case 'code':
      return (
        <div className="my-4 rounded-lg overflow-hidden border bg-muted">
           {value.language && (
             <div className="bg-muted-foreground/10 px-4 py-1 text-xs text-muted-foreground uppercase border-b">
               {value.language}
             </div>
           )}
          <pre className="p-4 overflow-x-auto text-sm font-mono">
            <code>
              <RichTextRenderer text={value.rich_text} />
            </code>
          </pre>
        </div>
      );
      
    case 'image':
      const src = value.type === 'external' ? value.external?.url : value.file?.url;
      const caption = value.caption?.[0]?.plain_text ?? '';
      if (!src) return null;
      
      
      return (
        <figure className="my-8">
          <div className="relative w-full h-auto aspect-video rounded-lg overflow-hidden border bg-muted shadow-sm">
            <Image
              src={src}
              alt={caption || "Blog post image"}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
          {caption && (
            <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
              {caption}
            </figcaption>
          )}
        </figure>
      );
      
    case 'video':
       const videoSrc = value.type === 'external' ? value.external?.url : value.file?.url;
       if (!videoSrc) return null;
       
       const isYouTube = videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be');
       
       return (
         <figure className="my-8">
           <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-black">
             {isYouTube ? (
                <iframe 
                  src={videoSrc.replace('watch?v=', 'embed/')} 
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
             ) : (
                <video controls className="w-full h-full">
                  <source src={videoSrc} />
                  Your browser does not support the video tag.
                </video>
             )}
           </div>
          {(value.caption?.length ?? 0) > 0 && (
            <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
              <RichTextRenderer text={value.caption} />
            </figcaption>
           )}
         </figure>
       );
    
    case 'audio':
      const audioSrc = value.type === 'external' ? value.external?.url : value.file?.url;
      if (!audioSrc) return null;

      return (
        <figure className="my-6 p-4 bg-muted/30 rounded-lg border flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Music className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <audio controls className="w-full">
              <source src={audioSrc} />
              Your browser does not support the audio element.
            </audio>
            {(value.caption?.length ?? 0) > 0 && (
              <figcaption className="text-xs text-muted-foreground mt-2">
                <RichTextRenderer text={value.caption} />
              </figcaption>
            )}
          </div>
        </figure>
      );
    
    case 'embed':
      const embedUrl = value.url;
      if (!embedUrl) return null;
      
      return (
        <figure className="my-8">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-muted">
            <iframe 
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
            />
          </div>
          {(value.caption?.length ?? 0) > 0 && (
            <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
              <RichTextRenderer text={value.caption} />
            </figcaption>
          )}
        </figure>
      );

    case 'callout':
      return (
        <div className="flex gap-4 p-4 my-4 bg-muted/50 rounded-lg border border-border">
          {value.icon?.emoji && <span className="text-2xl select-none">{value.icon.emoji}</span>}
          <div className="flex-1">
             <RichTextRenderer text={value.rich_text} />
          </div>
        </div>
      );
      
    case 'toggle':
        return (
          <details className="group my-2">
            <summary className="list-none cursor-pointer flex items-start gap-2 hover:bg-muted/50 p-1 rounded transition-colors">
               <ChevronRight className="w-5 h-5 mt-0.5 transition-transform group-open:rotate-90 shrink-0 text-muted-foreground" />
               <div className="flex-1 font-medium">
                 <RichTextRenderer text={value.rich_text} />
               </div>
            </summary>
            <div className="pl-7 mt-1 border-l-2 border-muted ml-2.5">
              <BlockListRenderer blocks={children} />
            </div>
          </details>
        );

    case 'divider':
      return <hr className="my-8 border-border" />;

    case 'column_list':
      return (
        <div className="flex flex-col md:flex-row gap-4 my-4">
           {children.map((child) => (
             <BlockRenderer key={child.id} block={child} />
           ))}
        </div>
      );
      
    case 'column':
      return (
        <div className="flex-1 min-w-0">
           <BlockListRenderer blocks={children} />
        </div>
      );
      
    case 'file':
    case 'pdf':
       const fileSrc = value.type === 'external' ? value.external?.url : value.file?.url;
       const fileName = value.name || "Download file";
       if (!fileSrc) return null;
       
       return (
         <a 
           href={fileSrc} 
           target="_blank" 
           rel="noopener noreferrer"
           className="flex items-center gap-3 p-3 my-2 rounded-lg border hover:bg-muted/50 transition-colors group"
         >
           <div className="p-2 bg-muted rounded group-hover:bg-background transition-colors">
              <FileText className="w-6 h-6 text-primary" />
           </div>
           <div className="flex-1 truncate">
             <div className="font-medium truncate">{fileName}</div>
            {(value.caption?.length ?? 0) > 0 && (
               <div className="text-xs text-muted-foreground truncate">
                 <RichTextRenderer text={value.caption} />
               </div>
             )}
           </div>
           <Download className="w-5 h-5 text-muted-foreground" />
         </a>
       );
       
    case 'bookmark':
       const bookmarkUrl = value.url;
       if (!bookmarkUrl) return null;
       
       return (
         <a 
           href={bookmarkUrl} 
           target="_blank" 
           rel="noopener noreferrer"
           className="flex flex-col md:flex-row my-4 rounded-lg border overflow-hidden hover:bg-muted/30 transition-colors"
         >
           <div className="flex-1 p-4">
             <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
               <Bookmark className="w-4 h-4" />
               <span className="truncate">{new URL(bookmarkUrl).hostname}</span>
             </div>
             <div className="font-medium text-primary mb-1 break-words">
               {(value.caption?.length ?? 0) > 0 ? <RichTextRenderer text={value.caption} /> : bookmarkUrl}
             </div>
           </div>
         </a>
       );

    case 'equation':
       return (
         <div className="my-4 p-4 text-center bg-muted/30 rounded overflow-x-auto font-mono text-lg">
           {value.expression}
         </div>
       );
       
    case 'table':
       return (
         <div className="my-6 overflow-x-auto rounded-lg border">
           <table className="w-full text-sm text-left">
             <tbody>
               {children.map((rowBlock, rowIndex) => {
                   if (rowBlock.type !== 'table_row') return null;
                  const rowValue = rowBlock[rowBlock.type] as { cells?: NotionRichText[][] };
                  const cells = rowValue.cells;
                   
                   return (
                     <tr key={rowBlock.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                       {cells?.map((cell, cellIndex) => {
                          const isHeader = (value.has_column_header && rowIndex === 0) || (value.has_row_header && cellIndex === 0);
                          const CellTag = isHeader ? 'th' : 'td';
                          
                          return (
                            <CellTag 
                              key={cellIndex} 
                              className={cn(
                                "px-4 py-3 border-r last:border-0 align-top",
                                isHeader && "font-bold bg-muted/50"
                              )}
                            >
                              <RichTextRenderer text={cell} />
                            </CellTag>
                          );
                        })}
                     </tr>
                   );
                })}
             </tbody>
           </table>
         </div>
       );

    case 'synced_block':
      return <BlockListRenderer blocks={children} />;
    
    case 'link_to_page':
      // Simplified rendering for link_to_page
      const linkId = value.page_id || value.database_id;
      if (!linkId) return null;
      
      return (
        <Link 
          href={`/${linkId}`}
          className="flex items-center gap-2 p-3 my-2 rounded-lg border hover:bg-muted/50 transition-colors text-primary"
        >
          <LinkIcon className="w-4 h-4" />
          <span className="font-medium">Link to Page</span>
        </Link>
      );

    case 'child_page':
      return (
        <Link 
          href={`/${block.id}`}
          className="flex items-center gap-2 p-3 my-2 rounded-lg border hover:bg-muted/50 transition-colors text-primary"
        >
          <FileText className="w-4 h-4" />
          <span className="font-medium">{value.title}</span>
        </Link>
      );

    case 'child_database':
      return (
        <div className="flex items-center gap-2 p-3 my-2 rounded-lg border bg-muted/30 text-muted-foreground">
          <Database className="w-4 h-4" />
          <span className="font-medium">{value.title}</span>
        </div>
      );
      
    case 'link_preview':
      const previewUrl = value.url;
      if (!previewUrl) return null;

      return (
         <a 
           href={previewUrl} 
           target="_blank" 
           rel="noopener noreferrer"
           className="flex flex-col md:flex-row my-4 rounded-lg border overflow-hidden hover:bg-muted/30 transition-colors"
         >
           <div className="flex-1 p-4">
             <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
               <LinkIcon className="w-4 h-4" />
               <span className="truncate">{new URL(previewUrl).hostname}</span>
             </div>
             <div className="font-medium text-primary mb-1 break-words">
                {previewUrl}
             </div>
           </div>
         </a>
       );

    default:
      console.warn(`Unsupported block type: ${type}`);
      return null;
  }
};

export default function BlogPostContent({ post }: BlogPostContentProps) {
  const { fontSize, contrast } = useAccessibility();

  // Memoize blocks to prevent unnecessary re-renders
  const blocks = React.useMemo<NotionBlockNode[]>(
    () => (post.content ?? []) as NotionBlockNode[],
    [post.content]
  );

  return (
    <BlogPostContext.Provider value={{ post, blocks }}>
      <article className={cn(
        "prose prose-neutral dark:prose-invert max-w-none container mx-auto py-8 px-4 md:px-0",
        `fs-${fontSize}`, 
        `cnt-${contrast}`
      )}>
        {/* Article Header */}
        <header className="mb-8 not-prose">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{post.title}</h1>
          <div className="flex flex-wrap gap-4 text-muted-foreground text-sm mb-6 items-center">
              <time dateTime={post.publishedDate}>
                {new Date(post.publishedDate).toLocaleDateString()}
              </time>
              {post.readTime && <span>• {post.readTime} min read</span>}
              {post.author && <span>• {post.author}</span>}
          </div>
          {post.coverImage && (
             <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 border shadow-sm">
               <Image 
                 src={post.coverImage} 
                 alt={post.title}
                 fill
                 className="object-cover"
                 priority
               />
             </div>
          )}
          {post.excerpt && (
             <p className="text-xl text-muted-foreground leading-relaxed border-l-4 border-primary pl-4">
               {post.excerpt}
             </p>
          )}
        </header>

        {/* Article Content */}
        <div className="space-y-2">
           <BlockListRenderer blocks={blocks} />
        </div>
      </article>
    </BlogPostContext.Provider>
  );
}
