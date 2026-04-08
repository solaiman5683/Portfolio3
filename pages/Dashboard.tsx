
import React, { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import {
  User, Briefcase, MessageSquare, LogOut, Plus, Trash2, Edit, X,
  Upload, Loader2, Share2, Award, FileText, Globe, History, Layers,
  Cpu, Star, Tag, Link as LinkIcon, Search, Video, DollarSign, LayoutGrid, Table2, ArrowUpDown
} from 'lucide-react';
import { Dialog, DialogContent } from '../components/ui/dialog';
import {
  Project, Skill, Profile, ContactMessage, Service, PricingPackage, Testimonial,
  SocialLink, WhyChooseMe, TimelineEntry, BlogPost, ProjectCategory
} from '../types';
import toast from 'react-hot-toast';

// ── Curated icon list for picker ──────────────────────────────────────────────
const ICON_GROUPS: { label: string; icons: string[] }[] = [
  { label: 'Social & Platforms', icons: [
    'Github','Twitter','Linkedin','Youtube','Instagram','Facebook','Globe','Mail',
    'Phone','ExternalLink','Link','Link2','AtSign','Rss','Twitch','Slack','Discord',
    'Dribbble','Figma','Framer','Codepen','GitBranch','GitCommit','GitMerge','GitPullRequest',
  ]},
  { label: 'People', icons: [
    'User','Users','UserCircle','UserPlus','UserCheck','UserX','Contact','BadgeCheck',
  ]},
  { label: 'Navigation & Arrows', icons: [
    'Home','ArrowRight','ArrowLeft','ArrowUp','ArrowDown','ArrowUpRight','ArrowDownRight',
    'ChevronRight','ChevronLeft','ChevronDown','ChevronUp','ChevronsRight','MoveRight',
    'CornerDownRight','Navigation','Compass','Map','MapPin','Route',
  ]},
  { label: 'UI & Controls', icons: [
    'Plus','Minus','Check','X','Hash','Menu','MoreHorizontal','MoreVertical',
    'Search','Filter','SlidersHorizontal','Settings','Settings2','Wrench','ToggleLeft',
    'Bell','BellRing','Bookmark','BookmarkPlus','Flag','Star','Heart','ThumbsUp','ThumbsDown',
  ]},
  { label: 'Media', icons: [
    'Image','Images','Camera','CameraOff','Video','VideoOff','Film','Clapperboard',
    'Music','Headphones','Mic','MicOff','Volume','Volume2','VolumeX','Play','Pause',
    'StopCircle','SkipForward','SkipBack','Repeat','Shuffle','Radio',
  ]},
  { label: 'Design & Creative', icons: [
    'Palette','Pen','PenTool','Brush','Paintbrush','Eraser','Scissors','Crop',
    'Layers','Layout','LayoutGrid','LayoutList','Columns','Rows','Grid2x2','Grid3x3',
    'Maximize','Minimize','Expand','Shrink','Focus','Aperture','Contrast',
  ]},
  { label: 'Code & Tech', icons: [
    'Code','Code2','Terminal','SquareTerminal','FileCode','FileCode2','Braces',
    'Database','Server','Cloud','CloudUpload','CloudDownload','HardDrive','Cpu','MemoryStick',
    'Monitor','Laptop','Smartphone','Tablet','Tv','Printer','Keyboard','Mouse',
    'Wifi','Bluetooth','Usb','Nfc','Signal','Globe2','Binary',
  ]},
  { label: 'Files & Documents', icons: [
    'File','FileText','FilePlus','FileMinus','FileCheck','FileX','FileImage','FileVideo',
    'Folder','FolderOpen','FolderPlus','FolderMinus','Archive','Package','Package2','Box',
    'BookOpen','Book','BookMarked','Notebook','ClipboardList','Clipboard','Copy',
  ]},
  { label: 'Communication', icons: [
    'MessageSquare','MessageCircle','MessageSquarePlus','MessagesSquare',
    'Send','SendHorizontal','Inbox','MailOpen','MailPlus','Reply','Forward',
  ]},
  { label: 'Business & Work', icons: [
    'Briefcase','Building','Building2','Factory','Landmark','Store',
    'Award','Trophy','Medal','Target','TrendingUp','TrendingDown','BarChart','BarChart2',
    'PieChart','LineChart','Activity','Gauge','Percent','DollarSign','CreditCard',
    'ShoppingCart','ShoppingBag','Receipt','Wallet','Banknote','Coins',
  ]},
  { label: 'Time & Calendar', icons: [
    'Clock','Clock2','Clock3','Timer','TimerReset','Alarm','Calendar','CalendarDays',
    'CalendarCheck','CalendarPlus','CalendarClock','Watch','Hourglass',
  ]},
  { label: 'Security', icons: [
    'Shield','ShieldCheck','ShieldAlert','ShieldX','Lock','Unlock','Key','KeyRound',
    'Eye','EyeOff','Fingerprint','Scan','ScanFace','QrCode','Barcode',
  ]},
  { label: 'Actions & Tools', icons: [
    'Download','Upload','Share','Share2','RefreshCw','RotateCcw','RotateCw',
    'Trash','Trash2','Edit','Edit2','Pencil','Save','SaveAll',
    'Undo','Redo','ZoomIn','ZoomOut','Move','Grab','Hand',
  ]},
  { label: 'Nature & Fun', icons: [
    'Sun','Moon','SunMoon','CloudRain','Cloud','Wind','Droplets','Snowflake',
    'Feather','Leaf','Flower','Flower2','TreePine','TreeDeciduous','Mountain',
    'Flame','Zap','Sparkles','Stars','Wand2','Lightbulb','Rocket',
  ]},
  { label: 'Alerts & Status', icons: [
    'Info','AlertCircle','AlertTriangle','AlertOctagon','HelpCircle','XCircle','CheckCircle',
    'Plug','PlugZap','Power','PowerOff','RefreshCcw','Loader','Loader2','Waypoints',
  ]},
  { label: 'Typography & Layout', icons: [
    'Type','AlignLeft','AlignCenter','AlignRight','Bold','Italic','Underline','Strikethrough',
    'List','ListOrdered','ListChecks','Table','TableProperties','LayoutDashboard',
  ]},
];

const ICON_LIST = ICON_GROUPS.flatMap(g => g.icons);

const IconPicker: React.FC<{
  value: string;
  onChange: (name: string) => void;
}> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [dropRect, setDropRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target as Node) &&
        dropRef.current && !dropRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setDropRect({ top: r.bottom + 4, left: r.left, width: r.width });
    }
    setOpen(o => !o);
  };

  const filteredGroups = query
    ? [{ label: 'Results', icons: ICON_LIST.filter(n => n.toLowerCase().includes(query.toLowerCase())) }]
    : ICON_GROUPS;

  const SelectedIcon = value ? (LucideIcons as any)[value] : null;

  const IconBtn = ({ name }: { name: string }) => {
    const Icon = (LucideIcons as any)[name];
    if (!Icon) return null;
    return (
      <button
        type="button"
        title={name}
        onClick={() => { onChange(name); setOpen(false); setQuery(''); }}
        className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
          value === name ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
        }`}
      >
        <Icon size={16} />
      </button>
    );
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg bg-white text-sm text-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        {SelectedIcon
          ? <><SelectedIcon size={16} className="text-blue-600 shrink-0" /><span className="font-medium">{value}</span></>
          : <span className="text-gray-400">Select icon…</span>
        }
        <LucideIcons.ChevronDown size={14} className="ml-auto text-gray-400" />
      </button>

      {open && dropRect && (
        <div
          ref={dropRef}
          style={{ position: 'fixed', top: dropRect.top, left: dropRect.left, width: dropRect.width, zIndex: 9999 }}
          className="bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="p-2 border-b border-gray-100 flex items-center gap-2 sticky top-0 bg-white">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              autoFocus
              className="flex-1 text-sm outline-none placeholder-gray-400"
              placeholder="Search icons…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && <button type="button" onClick={() => setQuery('')}><X size={13} className="text-gray-400" /></button>}
          </div>
          <div className="max-h-64 overflow-y-auto p-2 space-y-3">
            {filteredGroups.map(group => {
              const valid = group.icons.filter(n => (LucideIcons as any)[n]);
              if (!valid.length) return null;
              return (
                <div key={group.label}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 px-1">{group.label}</p>
                  <div className="grid grid-cols-8 gap-0.5">
                    {valid.map(name => <IconBtn key={name} name={name} />)}
                  </div>
                </div>
              );
            })}
            {filteredGroups[0]?.icons.length === 0 && (
              <p className="text-center text-xs text-gray-400 py-4">No icons found</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

interface DashboardProps { onLogout: () => void; }

const inp = 'w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';
const card = 'bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow';
const iconBtn = 'p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors';
const delBtn = (active: boolean) => `p-2 rounded-lg transition-colors ${active ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`;
const PROJECTS_TABLE_PAGE_SIZE = 10;
const BLOGS_TABLE_PAGE_SIZE = 10;
const MESSAGES_TABLE_PAGE_SIZE = 10;

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [pricingPackages, setPricingPackages] = useState<PricingPackage[]>([]);
  const [whyChooseMe, setWhyChooseMe] = useState<WhyChooseMe[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [currentItem, setCurrentItem] = useState<any>({});
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [projectQuery, setProjectQuery] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('all');
  const [projectViewMode, setProjectViewMode] = useState<'grid' | 'table'>('grid');
  const [projectSortKey, setProjectSortKey] = useState<'title' | 'category' | 'gallery_type' | 'created_at'>('created_at');
  const [projectSortDir, setProjectSortDir] = useState<'asc' | 'desc'>('desc');
  const [projectPage, setProjectPage] = useState(1);
  const [blogQuery, setBlogQuery] = useState('');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState('all');
  const [blogViewMode, setBlogViewMode] = useState<'grid' | 'table'>('grid');
  const [blogSortKey, setBlogSortKey] = useState<'title' | 'category' | 'read_time' | 'created_at'>('created_at');
  const [blogSortDir, setBlogSortDir] = useState<'asc' | 'desc'>('desc');
  const [blogPage, setBlogPage] = useState(1);
  const [messagesPage, setMessagesPage] = useState(1);

  useEffect(() => {
    fetchData();
    if (activeTab === 'projects' || activeTab === 'categories') fetchCategories();
  }, [activeTab]);

  const fetchCategories = async () => {
    try { setCategories(await api.list<ProjectCategory>('project_categories')); } catch {}
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const tableMap: Record<string, string> = {
        profile: 'profile', socials: 'social_links', skills: 'skills',
        services: 'services', pricing: 'pricing_packages', projects: 'projects', categories: 'project_categories',
        blogs: 'blogs', testimonials: 'testimonials', messages: 'contact_messages',
        why: 'why_choose_me', timeline: 'timeline',
      };
      const apiTable = tableMap[activeTab];
      if (!apiTable) return;
      if (activeTab === 'profile') {
        setProfile((await api.getProfile()) as unknown as Profile);
      } else {
        const data = await api.list<any>(apiTable);
        if (activeTab === 'socials') setSocials(data);
        if (activeTab === 'skills') setSkills(data);
        if (activeTab === 'services') setServices(data);
        if (activeTab === 'pricing') setPricingPackages(data);
        if (activeTab === 'timeline') setTimeline(data);
        if (activeTab === 'blogs') setBlogs(data);
        if (activeTab === 'projects') setProjects(data);
        if (activeTab === 'categories') setCategories(data);
        if (activeTab === 'testimonials') setTestimonials(data);
        if (activeTab === 'messages') setMessages(data);
        if (activeTab === 'why') setWhyChooseMe(data);
      }
    } catch (err: any) {
      if (err.message === 'Unauthorized') navigate('/admin');
      else toast.error(err.message || 'Fetch failed');
    } finally { setLoading(false); }
  };

  const deleteItem = async (table: string, id: string) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      toast('Click again to confirm delete', { icon: '⚠️' });
      setTimeout(() => setDeleteConfirmId(null), 3000);
      return;
    }
    setIsProcessing(true);
    try {
      await api.delete(table, id);
      toast.success('Deleted');
      setDeleteConfirmId(null);
      fetchData();
      if (table === 'project_categories') fetchCategories();
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`);
    } finally { setIsProcessing(false); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, isProfile = false, isGallery = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const bucket = activeTab === 'blogs' ? 'blog' : 'portfolio';
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) urls.push(await api.upload(files[i], bucket));
      if (isProfile && profile) setProfile({ ...profile, [field]: urls[0] });
      else if (isGallery) setGalleryImages(prev => [...prev, ...urls]);
      else setCurrentItem((prev: any) => ({ ...prev, [field]: urls[0] }));
      toast.success('Uploaded');
    } catch (err: any) {
      toast.error(`Upload failed: ${err.message}`);
    } finally { setUploading(false); }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try { await api.updateProfile(profile as unknown as Record<string, unknown>); toast.success('Saved'); }
    catch (err: any) { toast.error(err.message); }
  };

  const handleSubmitItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const tableMap: Record<string, string> = {
        skills: 'skills', projects: 'projects', blogs: 'blogs', services: 'services',
        pricing: 'pricing_packages',
        testimonials: 'testimonials', socials: 'social_links', why: 'why_choose_me',
        timeline: 'timeline', categories: 'project_categories',
      };
      const { id, created_at, gallery, ...savePayload } = { ...currentItem };
      if (activeTab === 'projects') {
        if (typeof savePayload.tech_stack === 'string') {
          savePayload.tech_stack = savePayload.tech_stack.split(',').map((s: string) => s.trim()).filter(Boolean);
        } else if (!Array.isArray(savePayload.tech_stack)) {
          savePayload.tech_stack = [];
        }
      }
      if (activeTab === 'projects')
        savePayload.gallery = galleryImages.map(url => ({ image_url: url }));
      if (activeTab === 'pricing') {
        if (typeof savePayload.features === 'string') {
          savePayload.features = savePayload.features
            .split(/\n|,/)
            .map((s: string) => s.trim())
            .filter(Boolean);
        } else if (!Array.isArray(savePayload.features)) {
          savePayload.features = [];
        }
        savePayload.is_popular = savePayload.is_popular ? 1 : 0;
      }
      const tableName = tableMap[activeTab];
      if (isEditing) await api.update(tableName, id, savePayload);
      else await api.create(tableName, savePayload);
      toast.success('Saved');
      setIsModalOpen(false);
      setGalleryImages([]);
      fetchData();
      if (activeTab === 'categories') fetchCategories();
    } catch (err: any) { toast.error(err.message); }
    finally { setIsProcessing(false); }
  };

  const handleLogout = () => { api.logout(); onLogout(); navigate('/admin'); };

  const featuresToMultiline = (f: unknown): string => {
    if (!f) return '';
    if (Array.isArray(f)) return f.join('\n');
    if (typeof f === 'string') {
      try {
        const p = JSON.parse(f);
        if (Array.isArray(p)) return p.join('\n');
      } catch { /* ignore */ }
      return f;
    }
    return '';
  };
  const formatHumanDate = (value?: string) => {
    if (!value) return '-';
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return '-';
    const datePart = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(dt);
    const timePart = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(dt);
    return `${datePart}, ${timePart}`;
  };

  const openModal = (item: any = {}) => {
    let next: Record<string, unknown> = { gallery_type: 'image', type: 'experience', order_index: 0, ...item };
    if (activeTab === 'pricing') {
      next = {
        ...next,
        features: featuresToMultiline(item.features),
        order_index: item.order_index ?? 0,
        is_popular: item.is_popular === 1 || item.is_popular === true ? 1 : 0,
        cta_text: item.cta_text || 'Get started',
        cta_href: item.cta_href || '/contact',
      };
    }
    setCurrentItem(next);
    setIsEditing(!!item.id);
    setGalleryImages(activeTab === 'projects' && item.gallery ? item.gallery.map((g: any) => g.image_url) : []);
    setIsModalOpen(true);
  };

  const projectCategoryOptions = React.useMemo(() => {
    const set = new Set<string>();
    categories.forEach((c) => c.name && set.add(c.name));
    projects.forEach((p) => p.category && set.add(p.category));
    return ['all', ...Array.from(set)];
  }, [categories, projects]);

  const filteredProjects = React.useMemo(() => {
    const q = projectQuery.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesCategory = projectCategoryFilter === 'all' || p.category === projectCategoryFilter;
      if (!matchesCategory) return false;
      if (!q) return true;
      return [p.title, p.category, p.description]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q));
    });
  }, [projects, projectCategoryFilter, projectQuery]);

  const sortedProjects = React.useMemo(() => {
    const items = [...filteredProjects];
    items.sort((a, b) => {
      const aValue = (a as any)[projectSortKey] ?? '';
      const bValue = (b as any)[projectSortKey] ?? '';
      let result = 0;
      if (projectSortKey === 'created_at') {
        result = new Date(String(aValue || 0)).getTime() - new Date(String(bValue || 0)).getTime();
      } else {
        result = String(aValue).localeCompare(String(bValue), undefined, { sensitivity: 'base' });
      }
      return projectSortDir === 'asc' ? result : -result;
    });
    return items;
  }, [filteredProjects, projectSortDir, projectSortKey]);

  const projectsTotalPages = Math.max(1, Math.ceil(sortedProjects.length / PROJECTS_TABLE_PAGE_SIZE));
  const normalizedProjectPage = Math.min(projectPage, projectsTotalPages);

  const paginatedTableProjects = React.useMemo(() => {
    const start = (normalizedProjectPage - 1) * PROJECTS_TABLE_PAGE_SIZE;
    const end = start + PROJECTS_TABLE_PAGE_SIZE;
    return sortedProjects.slice(start, end);
  }, [normalizedProjectPage, sortedProjects]);

  useEffect(() => {
    setProjectPage(1);
  }, [projectQuery, projectCategoryFilter, projectSortKey, projectSortDir]);

  useEffect(() => {
    if (projectPage !== normalizedProjectPage) {
      setProjectPage(normalizedProjectPage);
    }
  }, [normalizedProjectPage, projectPage]);

  const toggleProjectSort = (key: 'title' | 'category' | 'gallery_type' | 'created_at') => {
    if (projectSortKey === key) {
      setProjectSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setProjectSortKey(key);
    setProjectSortDir(key === 'title' || key === 'category' ? 'asc' : 'desc');
  };

  const blogCategoryOptions = React.useMemo(() => {
    const set = new Set<string>();
    blogs.forEach((b) => b.category && set.add(b.category));
    return ['all', ...Array.from(set)];
  }, [blogs]);

  const filteredBlogs = React.useMemo(() => {
    const q = blogQuery.trim().toLowerCase();
    return blogs.filter((b) => {
      const matchesCategory = blogCategoryFilter === 'all' || b.category === blogCategoryFilter;
      if (!matchesCategory) return false;
      if (!q) return true;
      return [b.title, b.category, b.content, b.read_time]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q));
    });
  }, [blogCategoryFilter, blogQuery, blogs]);

  const sortedBlogs = React.useMemo(() => {
    const items = [...filteredBlogs];
    items.sort((a, b) => {
      const aValue = (a as any)[blogSortKey] ?? '';
      const bValue = (b as any)[blogSortKey] ?? '';
      let result = 0;
      if (blogSortKey === 'created_at') {
        result = new Date(String(aValue || 0)).getTime() - new Date(String(bValue || 0)).getTime();
      } else {
        result = String(aValue).localeCompare(String(bValue), undefined, { sensitivity: 'base' });
      }
      return blogSortDir === 'asc' ? result : -result;
    });
    return items;
  }, [blogSortDir, blogSortKey, filteredBlogs]);

  const blogsTotalPages = Math.max(1, Math.ceil(sortedBlogs.length / BLOGS_TABLE_PAGE_SIZE));
  const normalizedBlogPage = Math.min(blogPage, blogsTotalPages);

  const paginatedTableBlogs = React.useMemo(() => {
    const start = (normalizedBlogPage - 1) * BLOGS_TABLE_PAGE_SIZE;
    const end = start + BLOGS_TABLE_PAGE_SIZE;
    return sortedBlogs.slice(start, end);
  }, [normalizedBlogPage, sortedBlogs]);

  const sortedMessages = React.useMemo(() => {
    return [...messages].sort((a, b) => {
      const aTime = new Date(a.created_at || 0).getTime();
      const bTime = new Date(b.created_at || 0).getTime();
      return bTime - aTime;
    });
  }, [messages]);

  const messagesTotalPages = Math.max(1, Math.ceil(sortedMessages.length / MESSAGES_TABLE_PAGE_SIZE));
  const normalizedMessagesPage = Math.min(messagesPage, messagesTotalPages);

  const paginatedMessages = React.useMemo(() => {
    const start = (normalizedMessagesPage - 1) * MESSAGES_TABLE_PAGE_SIZE;
    const end = start + MESSAGES_TABLE_PAGE_SIZE;
    return sortedMessages.slice(start, end);
  }, [normalizedMessagesPage, sortedMessages]);

  useEffect(() => {
    if (messagesPage !== normalizedMessagesPage) {
      setMessagesPage(normalizedMessagesPage);
    }
  }, [messagesPage, normalizedMessagesPage]);

  useEffect(() => {
    setBlogPage(1);
  }, [blogQuery, blogCategoryFilter, blogSortKey, blogSortDir]);

  useEffect(() => {
    if (blogPage !== normalizedBlogPage) {
      setBlogPage(normalizedBlogPage);
    }
  }, [blogPage, normalizedBlogPage]);

  const toggleBlogSort = (key: 'title' | 'category' | 'read_time' | 'created_at') => {
    if (blogSortKey === key) {
      setBlogSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setBlogSortKey(key);
    setBlogSortDir(key === 'title' || key === 'category' || key === 'read_time' ? 'asc' : 'desc');
  };

  const UploadField = ({
    field,
    label,
    isProfile = false,
    accept = 'image/*',
    uploadLabel = 'Upload image',
    changeLabel = 'Change image',
    previewKind = 'image',
  }: {
    field: string;
    label: string;
    isProfile?: boolean;
    accept?: string;
    uploadLabel?: string;
    changeLabel?: string;
    previewKind?: 'image' | 'video' | 'none';
  }) => {
    const currentUrl = isProfile ? (profile as any)?.[field] : currentItem[field];
    return (
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
        <label className="flex items-center gap-3 border border-dashed border-gray-300 rounded-lg p-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
          {uploading ? <Loader2 size={16} className="animate-spin text-blue-500" /> : <Upload size={16} className="text-gray-400" />}
          <span className="text-sm text-gray-500">{currentUrl ? changeLabel : uploadLabel}</span>
          {currentUrl && previewKind === 'image' && <img src={currentUrl} className="w-8 h-8 rounded object-cover ml-auto border border-gray-200" />}
          {currentUrl && previewKind === 'video' && <Video size={16} className="ml-auto text-blue-500" />}
          <input type="file" className="hidden" accept={accept} onChange={e => handleFileUpload(e, field, isProfile)} />
        </label>
      </div>
    );
  };

  const renderContent = () => {
    if (loading && !isModalOpen) return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );

    switch (activeTab) {
      case 'profile': return profile && (
        <form onSubmit={handleProfileSave} className="bg-white border border-gray-200 rounded-xl p-8 space-y-6 shadow-sm max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Name</label><input className={inp} value={profile.name || ''} onChange={e => setProfile({ ...profile, name: e.target.value })} placeholder="Full Name" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</label><input className={inp} value={profile.title || ''} onChange={e => setProfile({ ...profile, title: e.target.value })} placeholder="Professional Title" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</label><input className={inp} type="email" value={profile.email || ''} onChange={e => setProfile({ ...profile, email: e.target.value })} placeholder="email@example.com" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone</label><input className={inp} value={profile.phone || ''} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="+1 234 567 890" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</label><input className={inp} value={profile.location || ''} onChange={e => setProfile({ ...profile, location: e.target.value })} placeholder="City, Country" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Resume URL</label><input className={inp} value={profile.resume_url || ''} onChange={e => setProfile({ ...profile, resume_url: e.target.value })} placeholder="https://..." /></div>
          </div>
          <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Bio</label><textarea className={`${inp} h-32 resize-none`} value={profile.bio || ''} onChange={e => setProfile({ ...profile, bio: e.target.value })} placeholder="Tell your story..." /></div>
          <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">About Headline</label><input className={inp} value={profile.about_headline || ''} onChange={e => setProfile({ ...profile, about_headline: e.target.value })} /></div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Watch Video URL</label>
            <input
              className={inp}
              value={profile.video_url || ''}
              onChange={e => setProfile({ ...profile, video_url: e.target.value })}
              placeholder="YouTube/Vimeo URL or uploaded video URL"
            />
            <p className="mt-1 text-xs text-gray-400">You can paste a YouTube URL or upload a video file below.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UploadField field="avatar_url" label="Avatar Photo" isProfile />
            <UploadField field="about_image_url" label="About Page Image" isProfile />
          </div>
          <UploadField
            field="video_url"
            label="Watch Video File"
            isProfile
            accept="video/mp4,video/webm,video/ogg"
            uploadLabel="Upload video"
            changeLabel="Replace video"
            previewKind="video"
          />
          <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">Save Profile</button>
        </form>
      );

      case 'skills': return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map(s => (
            <div key={s.id} className={card}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><Cpu size={18} className="text-blue-600" /></div>
                <div><p className="font-semibold text-gray-800 text-sm">{s.name}</p><p className="text-xs text-gray-400">{s.category} · {s.percentage}%</p></div>
              </div>
              <div className="flex gap-1"><button className={iconBtn} onClick={() => openModal(s)}><Edit size={16}/></button><button className={delBtn(deleteConfirmId === s.id)} onClick={() => deleteItem('skills', s.id)}><Trash2 size={16}/></button></div>
            </div>
          ))}
        </div>
      );

      case 'socials': return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {socials.map(s => (
            <div key={s.id} className={card}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  {(() => {
                    const SocialIcon = (LucideIcons as any)[s.icon];
                    return SocialIcon ? <SocialIcon size={18} className="text-purple-600" /> : <LinkIcon size={18} className="text-purple-600" />;
                  })()}
                </div>
                <div><p className="font-semibold text-gray-800 text-sm">{s.platform}</p><p className="text-xs text-gray-400 truncate max-w-[140px]">{s.url}</p></div>
              </div>
              <div className="flex gap-1"><button className={iconBtn} onClick={() => openModal(s)}><Edit size={16}/></button><button className={delBtn(deleteConfirmId === s.id)} onClick={() => deleteItem('social_links', s.id)}><Trash2 size={16}/></button></div>
            </div>
          ))}
        </div>
      );

      case 'categories': return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(c => (
            <div key={c.id} className={card}>
              <div className="flex items-center gap-3"><Tag size={18} className="text-orange-500" /><p className="font-semibold text-gray-800 text-sm">{c.name}</p></div>
              <div className="flex gap-1"><button className={iconBtn} onClick={() => openModal(c)}><Edit size={16}/></button><button className={delBtn(deleteConfirmId === c.id)} onClick={() => deleteItem('project_categories', c.id)}><Trash2 size={16}/></button></div>
            </div>
          ))}
        </div>
      );

      case 'services': return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(s => (
            <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-3"><Layers size={18} className="text-green-600" /></div>
              <p className="font-semibold text-gray-800 mb-1">{s.title}</p>
              <p className="text-xs text-gray-400 line-clamp-2 mb-4">{s.description}</p>
              <div className="flex gap-1"><button className={iconBtn} onClick={() => openModal(s)}><Edit size={16}/></button><button className={delBtn(deleteConfirmId === s.id)} onClick={() => deleteItem('services', s.id)}><Trash2 size={16}/></button></div>
            </div>
          ))}
        </div>
      );

      case 'pricing': return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pricingPackages.map(p => (
            <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-3"><DollarSign size={18} className="text-emerald-600" /></div>
              <p className="font-semibold text-gray-800 mb-0.5">{p.name}</p>
              <p className="text-sm font-semibold text-emerald-600 mb-1">{p.price_display}</p>
              {p.price_note && <p className="text-[11px] text-gray-400 mb-2">{p.price_note}</p>}
              <p className="text-xs text-gray-500 line-clamp-2 mb-4">{p.description}</p>
              <div className="flex gap-1">
                <button className={iconBtn} onClick={() => openModal(p)}><Edit size={16}/></button>
                <button className={delBtn(deleteConfirmId === p.id)} onClick={() => deleteItem('pricing_packages', p.id)}><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
          {pricingPackages.length === 0 && <p className="text-gray-400 text-sm col-span-full text-center py-12">No pricing packages yet. Add one to show the Pricing section on the home page.</p>}
        </div>
      );

      case 'projects': return (
        <div className="space-y-5">
          <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 shadow-sm">
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">Project Library</p>
                <p className="text-xs text-gray-500">Showing {sortedProjects.length} of {projects.length} projects</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={projectQuery}
                    onChange={(e) => setProjectQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search projects"
                  />
                </div>
                <select
                  value={projectCategoryFilter}
                  onChange={(e) => setProjectCategoryFilter(e.target.value)}
                  className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {projectCategoryOptions.map((name) => (
                    <option key={name} value={name}>
                      {name === 'all' ? 'All categories' : name}
                    </option>
                  ))}
                </select>
                <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setProjectViewMode('grid')}
                    className={`px-3 py-2 text-sm inline-flex items-center gap-1.5 transition-colors ${projectViewMode === 'grid' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                    aria-label="Grid mode"
                  >
                    <LayoutGrid size={15} />
                    Grid
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectViewMode('table')}
                    className={`px-3 py-2 text-sm inline-flex items-center gap-1.5 border-l border-gray-200 transition-colors ${projectViewMode === 'table' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                    aria-label="Table mode"
                  >
                    <Table2 size={15} />
                    Table
                  </button>
                </div>
              </div>
            </div>
          </div>

          {projectViewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {sortedProjects.map((p) => (
                <div key={p.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-44 bg-gray-100">
                    {p.image_url ? (
                      <img src={p.image_url} className="w-full h-full object-cover" alt={p.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No thumbnail</div>
                    )}
                    <span className="absolute left-3 top-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/90 text-gray-700 border border-gray-200">
                      {p.category || 'Uncategorized'}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-gray-800 mb-1 line-clamp-1">{p.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-2 min-h-[2.25rem] mb-4">
                      {p.description || 'No description provided'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-400 uppercase tracking-wide">{p.gallery_type === 'video' ? 'Video' : 'Image'}</span>
                      <div className="flex items-center gap-1">
                        <button className={iconBtn} onClick={() => openModal(p)} aria-label={`Edit ${p.title}`}><Edit size={16}/></button>
                        <button className={delBtn(deleteConfirmId === p.id)} onClick={() => deleteItem('projects', p.id)} aria-label={`Delete ${p.title}`}><Trash2 size={16}/></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-[980px] w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      <th className="px-4 py-3">Preview</th>
                      <th className="px-4 py-3">
                        <button type="button" onClick={() => toggleProjectSort('title')} className="inline-flex items-center gap-1 hover:text-gray-700">
                          Title <ArrowUpDown size={13} />
                        </button>
                      </th>
                      <th className="px-4 py-3">
                        <button type="button" onClick={() => toggleProjectSort('category')} className="inline-flex items-center gap-1 hover:text-gray-700">
                          Category <ArrowUpDown size={13} />
                        </button>
                      </th>
                      <th className="px-4 py-3">
                        <button type="button" onClick={() => toggleProjectSort('gallery_type')} className="inline-flex items-center gap-1 hover:text-gray-700">
                          Media <ArrowUpDown size={13} />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-center">Gallery</th>
                      <th className="px-4 py-3">
                        <button type="button" onClick={() => toggleProjectSort('created_at')} className="inline-flex items-center gap-1 hover:text-gray-700">
                          Created <ArrowUpDown size={13} />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTableProjects.map((p) => {
                      const galleryCount = Array.isArray((p as any).gallery) ? (p as any).gallery.length : 0;
                      return (
                        <tr key={p.id} className="border-b last:border-b-0 border-gray-100 hover:bg-gray-50/80">
                          <td className="px-4 py-3">
                            <div className="w-16 h-11 rounded-md border border-gray-200 overflow-hidden bg-gray-100">
                              {p.image_url ? (
                                <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">N/A</div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-800 font-medium max-w-[260px]">
                            <p className="line-clamp-1">{p.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{p.description || 'No description'}</p>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{p.category || 'Uncategorized'}</td>
                          <td className="px-4 py-3 text-gray-600 capitalize">{p.gallery_type || 'image'}</td>
                          <td className="px-4 py-3 text-center text-gray-600">{galleryCount}</td>
                          <td className="px-4 py-3 text-gray-600">{formatHumanDate(p.created_at)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button className={iconBtn} onClick={() => openModal(p)} aria-label={`Edit ${p.title}`}><Edit size={16}/></button>
                              <button className={delBtn(deleteConfirmId === p.id)} onClick={() => deleteItem('projects', p.id)} aria-label={`Delete ${p.title}`}><Trash2 size={16}/></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {sortedProjects.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50/70">
                  <p className="text-xs text-gray-500">
                    Showing {(normalizedProjectPage - 1) * PROJECTS_TABLE_PAGE_SIZE + 1} to {Math.min(normalizedProjectPage * PROJECTS_TABLE_PAGE_SIZE, sortedProjects.length)} of {sortedProjects.length} items
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setProjectPage((p) => Math.max(1, p - 1))}
                      disabled={normalizedProjectPage === 1}
                      className="px-3 py-1.5 text-xs rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Prev
                    </button>
                    {Array.from({ length: projectsTotalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setProjectPage(pageNum)}
                        className={`min-w-8 px-2 py-1.5 text-xs rounded-md border ${normalizedProjectPage === pageNum ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setProjectPage((p) => Math.min(projectsTotalPages, p + 1))}
                      disabled={normalizedProjectPage === projectsTotalPages}
                      className="px-3 py-1.5 text-xs rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {sortedProjects.length === 0 && (
              <div className="col-span-full bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center">
                <p className="text-sm font-semibold text-gray-700 mb-1">No projects found</p>
                <p className="text-xs text-gray-500">Try changing the search text or category filter.</p>
              </div>
            )}
        </div>
      );

      case 'blogs': return (
        <div className="space-y-5">
          <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 shadow-sm">
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">Blog Library</p>
                <p className="text-xs text-gray-500">Showing {sortedBlogs.length} of {blogs.length} posts</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={blogQuery}
                    onChange={(e) => setBlogQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search posts"
                  />
                </div>
                <select
                  value={blogCategoryFilter}
                  onChange={(e) => setBlogCategoryFilter(e.target.value)}
                  className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {blogCategoryOptions.map((name) => (
                    <option key={name} value={name}>
                      {name === 'all' ? 'All categories' : name}
                    </option>
                  ))}
                </select>
                <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setBlogViewMode('grid')}
                    className={`px-3 py-2 text-sm inline-flex items-center gap-1.5 transition-colors ${blogViewMode === 'grid' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                    aria-label="Grid mode"
                  >
                    <LayoutGrid size={15} />
                    Grid
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlogViewMode('table')}
                    className={`px-3 py-2 text-sm inline-flex items-center gap-1.5 border-l border-gray-200 transition-colors ${blogViewMode === 'table' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                    aria-label="Table mode"
                  >
                    <Table2 size={15} />
                    Table
                  </button>
                </div>
              </div>
            </div>
          </div>

          {blogViewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {sortedBlogs.map((b) => (
                <div key={b.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-44 bg-gray-100">
                    {b.image_url ? (
                      <img src={b.image_url} className="w-full h-full object-cover" alt={b.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No cover image</div>
                    )}
                    <span className="absolute left-3 top-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/90 text-gray-700 border border-gray-200">
                      {b.category || 'Uncategorized'}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-gray-800 mb-1 line-clamp-1">{b.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-2 min-h-[2.25rem] mb-4">{b.content || 'No content preview'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-400 uppercase tracking-wide">{b.read_time || 'N/A'}</span>
                      <div className="flex items-center gap-1">
                        <button className={iconBtn} onClick={() => openModal(b)} aria-label={`Edit ${b.title}`}><Edit size={16}/></button>
                        <button className={delBtn(deleteConfirmId === b.id)} onClick={() => deleteItem('blogs', b.id)} aria-label={`Delete ${b.title}`}><Trash2 size={16}/></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-[980px] w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      <th className="px-4 py-3">Preview</th>
                      <th className="px-4 py-3">
                        <button type="button" onClick={() => toggleBlogSort('title')} className="inline-flex items-center gap-1 hover:text-gray-700">
                          Title <ArrowUpDown size={13} />
                        </button>
                      </th>
                      <th className="px-4 py-3">
                        <button type="button" onClick={() => toggleBlogSort('category')} className="inline-flex items-center gap-1 hover:text-gray-700">
                          Category <ArrowUpDown size={13} />
                        </button>
                      </th>
                      <th className="px-4 py-3">
                        <button type="button" onClick={() => toggleBlogSort('read_time')} className="inline-flex items-center gap-1 hover:text-gray-700">
                          Read time <ArrowUpDown size={13} />
                        </button>
                      </th>
                      <th className="px-4 py-3">
                        <button type="button" onClick={() => toggleBlogSort('created_at')} className="inline-flex items-center gap-1 hover:text-gray-700">
                          Created <ArrowUpDown size={13} />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTableBlogs.map((b) => (
                      <tr key={b.id} className="border-b last:border-b-0 border-gray-100 hover:bg-gray-50/80">
                        <td className="px-4 py-3">
                          <div className="w-16 h-11 rounded-md border border-gray-200 overflow-hidden bg-gray-100">
                            {b.image_url ? (
                              <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">N/A</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-800 font-medium max-w-[300px]">
                          <p className="line-clamp-1">{b.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{b.content || 'No content preview'}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{b.category || 'Uncategorized'}</td>
                        <td className="px-4 py-3 text-gray-600">{b.read_time || '-'}</td>
                        <td className="px-4 py-3 text-gray-600">{formatHumanDate(b.created_at)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button className={iconBtn} onClick={() => openModal(b)} aria-label={`Edit ${b.title}`}><Edit size={16}/></button>
                            <button className={delBtn(deleteConfirmId === b.id)} onClick={() => deleteItem('blogs', b.id)} aria-label={`Delete ${b.title}`}><Trash2 size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {sortedBlogs.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50/70">
                  <p className="text-xs text-gray-500">
                    Showing {(normalizedBlogPage - 1) * BLOGS_TABLE_PAGE_SIZE + 1} to {Math.min(normalizedBlogPage * BLOGS_TABLE_PAGE_SIZE, sortedBlogs.length)} of {sortedBlogs.length} items
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setBlogPage((p) => Math.max(1, p - 1))}
                      disabled={normalizedBlogPage === 1}
                      className="px-3 py-1.5 text-xs rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Prev
                    </button>
                    {Array.from({ length: blogsTotalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setBlogPage(pageNum)}
                        className={`min-w-8 px-2 py-1.5 text-xs rounded-md border ${normalizedBlogPage === pageNum ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setBlogPage((p) => Math.min(blogsTotalPages, p + 1))}
                      disabled={normalizedBlogPage === blogsTotalPages}
                      className="px-3 py-1.5 text-xs rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {sortedBlogs.length === 0 && (
            <div className="col-span-full bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center">
              <p className="text-sm font-semibold text-gray-700 mb-1">No blog posts found</p>
              <p className="text-xs text-gray-500">Try changing the search text or category filter.</p>
            </div>
          )}
        </div>
      );

      case 'timeline': return (
        <div className="space-y-3 max-w-2xl">
          {timeline.map(t => (
            <div key={t.id} className={card}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${t.type === 'experience' ? 'bg-blue-50' : 'bg-indigo-50'}`}>
                  {t.type === 'experience' ? <Briefcase size={18} className="text-blue-600" /> : <History size={18} className="text-indigo-600" />}
                </div>
                <div><p className="font-semibold text-gray-800 text-sm">{t.title}</p><p className="text-xs text-gray-400">{t.institution} · {t.period}</p></div>
              </div>
              <div className="flex gap-1"><button className={iconBtn} onClick={() => openModal(t)}><Edit size={16}/></button><button className={delBtn(deleteConfirmId === t.id)} onClick={() => deleteItem('timeline', t.id)}><Trash2 size={16}/></button></div>
            </div>
          ))}
        </div>
      );

      case 'why': return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {whyChooseMe.map(w => (
            <div key={w.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center mb-3"><Award size={18} className="text-yellow-600" /></div>
              <p className="font-semibold text-gray-800 mb-1">{w.title}</p>
              <p className="text-xs text-gray-400 mb-4">{w.description}</p>
              <div className="flex gap-1"><button className={iconBtn} onClick={() => openModal(w)}><Edit size={16}/></button><button className={delBtn(deleteConfirmId === w.id)} onClick={() => deleteItem('why_choose_me', w.id)}><Trash2 size={16}/></button></div>
            </div>
          ))}
        </div>
      );

      case 'testimonials': return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map(t => (
            <div key={t.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                {t.photo_url && <img src={t.photo_url} className="w-10 h-10 rounded-full object-cover border border-gray-200" />}
                <div><p className="font-semibold text-gray-800 text-sm">{t.name}</p><p className="text-xs text-blue-500">{t.role}</p></div>
              </div>
              <p className="text-xs text-gray-500 italic line-clamp-3 mb-4">"{t.text}"</p>
              <div className="flex gap-1"><button className={iconBtn} onClick={() => openModal(t)}><Edit size={16}/></button><button className={delBtn(deleteConfirmId === t.id)} onClick={() => deleteItem('testimonials', t.id)}><Trash2 size={16}/></button></div>
            </div>
          ))}
        </div>
      );

      case 'messages': return (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3">Sender</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Received</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMessages.map((m) => (
                  <tr key={m.id} className={`border-b last:border-b-0 border-gray-100 hover:bg-gray-50/80 ${m.is_read ? '' : 'bg-blue-50/40'}`}>
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{m.name}</td>
                    <td className="px-4 py-3 text-blue-600 whitespace-nowrap">{m.email}</td>
                    <td className="px-4 py-3 text-gray-700 max-w-[220px]"><p className="line-clamp-1">{m.subject}</p></td>
                    <td className="px-4 py-3 text-gray-600 max-w-[480px]"><p className="line-clamp-2">{m.message}</p></td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatHumanDate(m.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button className={delBtn(deleteConfirmId === m.id)} onClick={() => deleteItem('contact_messages', m.id)} aria-label={`Delete message from ${m.name}`}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sortedMessages.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50/70">
              <p className="text-xs text-gray-500">
                Showing {(normalizedMessagesPage - 1) * MESSAGES_TABLE_PAGE_SIZE + 1} to {Math.min(normalizedMessagesPage * MESSAGES_TABLE_PAGE_SIZE, sortedMessages.length)} of {sortedMessages.length} items
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setMessagesPage((p) => Math.max(1, p - 1))}
                  disabled={normalizedMessagesPage === 1}
                  className="px-3 py-1.5 text-xs rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                {Array.from({ length: messagesTotalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setMessagesPage(pageNum)}
                    className={`min-w-8 px-2 py-1.5 text-xs rounded-md border ${normalizedMessagesPage === pageNum ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setMessagesPage((p) => Math.min(messagesTotalPages, p + 1))}
                  disabled={normalizedMessagesPage === messagesTotalPages}
                  className="px-3 py-1.5 text-xs rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          {sortedMessages.length === 0 && <p className="text-gray-400 text-sm text-center py-16">No messages yet.</p>}
        </div>
      );

      default: return null;
    }
  };

  const navItems = [
    { id: 'profile', icon: <User size={16}/>, label: 'Profile' },
    { id: 'socials', icon: <Share2 size={16}/>, label: 'Social Links' },
    { id: 'categories', icon: <Tag size={16}/>, label: 'Categories' },
    { id: 'skills', icon: <Cpu size={16}/>, label: 'Skills' },
    { id: 'projects', icon: <Briefcase size={16}/>, label: 'Projects' },
    { id: 'blogs', icon: <FileText size={16}/>, label: 'Blog' },
    { id: 'services', icon: <Layers size={16}/>, label: 'Services' },
    { id: 'pricing', icon: <DollarSign size={16}/>, label: 'Pricing' },
    { id: 'timeline', icon: <History size={16}/>, label: 'Timeline' },
    { id: 'why', icon: <Award size={16}/>, label: 'Why Me' },
    { id: 'testimonials', icon: <Star size={16}/>, label: 'Testimonials' },
    { id: 'messages', icon: <MessageSquare size={16}/>, label: 'Messages' },
  ];

  const tabLabel = navItems.find(n => n.id === activeTab)?.label ?? activeTab;

  return (
    <div className="dashboard-root min-h-screen bg-gray-50 flex text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 shrink-0">
        <div className="px-5 py-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">A</div>
          <span className="font-bold text-gray-800">Admin Panel</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100 space-y-0.5">
          <Link to="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors">
            <Globe size={16}/> View Site
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={16}/> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-6 border-b border-gray-200 bg-white flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-800">{tabLabel}</h1>
          {activeTab !== 'profile' && activeTab !== 'messages' && (
            <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              <Plus size={16}/> Add New
            </button>
          )}
        </div>

        <div className="p-8">
          {renderContent()}
        </div>
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          hideCloseButton
          className={`bg-white border border-gray-200 shadow-2xl ${activeTab === 'pricing' ? 'max-w-lg' : 'max-w-md'}`}
          style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
        >
          <div className="max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">{isEditing ? 'Edit' : 'Add'} {tabLabel}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"><X size={18}/></button>
            </div>

            <form onSubmit={handleSubmitItem} className="p-6 space-y-4">
              {activeTab === 'projects' && (<>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</label><input required className={inp} placeholder="Project title" value={currentItem.title || ''} onChange={e => setCurrentItem({...currentItem, title: e.target.value})} /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                  <select required className={inp} value={currentItem.category || ''} onChange={e => setCurrentItem({...currentItem, category: e.target.value})}>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Media Type</label>
                  <select className={inp} value={currentItem.gallery_type || 'image'} onChange={e => setCurrentItem({...currentItem, gallery_type: e.target.value})}>
                    <option value="image">Image Gallery</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <UploadField field="image_url" label="Thumbnail" />
                {currentItem.gallery_type === 'video' && <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Video URL</label><input className={inp} placeholder="YouTube / Vimeo URL" value={currentItem.video_url || ''} onChange={e => setCurrentItem({...currentItem, video_url: e.target.value})} /></div>}
                {currentItem.gallery_type === 'image' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Gallery Images ({galleryImages.length})</label>
                    <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg p-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm text-gray-500">
                      {uploading ? <Loader2 size={16} className="animate-spin text-blue-500" /> : <Plus size={16} className="text-gray-400" />}
                      Add images
                      <input type="file" className="hidden" accept="image/*" multiple onChange={e => handleFileUpload(e, 'gallery', false, true)} />
                    </label>
                    {galleryImages.length > 0 && <div className="flex flex-wrap gap-2 mt-2">{galleryImages.map((url, i) => <img key={i} src={url} className="w-12 h-12 rounded object-cover border border-gray-200" />)}</div>}
                  </div>
                )}
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label><textarea required className={`${inp} h-24 resize-none`} placeholder="Project description" value={currentItem.description || ''} onChange={e => setCurrentItem({...currentItem, description: e.target.value})} /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tech Stack (comma separated)</label><input className={inp} placeholder="React, Node.js, ..." value={Array.isArray(currentItem.tech_stack) ? currentItem.tech_stack.join(', ') : currentItem.tech_stack || ''} onChange={e => setCurrentItem({...currentItem, tech_stack: e.target.value})} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Live URL</label><input className={inp} placeholder="https://..." value={currentItem.live_url || ''} onChange={e => setCurrentItem({...currentItem, live_url: e.target.value})} /></div>
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">GitHub URL</label><input className={inp} placeholder="https://..." value={currentItem.github_url || ''} onChange={e => setCurrentItem({...currentItem, github_url: e.target.value})} /></div>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={Boolean(currentItem.isFeatured ?? currentItem.featured)}
                      onChange={e => setCurrentItem({
                        ...currentItem,
                        isFeatured: e.target.checked,
                        featured: e.target.checked,
                      })}
                    />
                    Show on Home page (isFeatured)
                  </label>
                </div>
              </>)}

              {activeTab === 'blogs' && (<>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</label><input required className={inp} placeholder="Blog title" value={currentItem.title || ''} onChange={e => setCurrentItem({...currentItem, title: e.target.value})} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label><input required className={inp} placeholder="e.g. Design" value={currentItem.category || ''} onChange={e => setCurrentItem({...currentItem, category: e.target.value})} /></div>
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Read Time</label><input required className={inp} placeholder="5 min read" value={currentItem.read_time || ''} onChange={e => setCurrentItem({...currentItem, read_time: e.target.value})} /></div>
                </div>
                <UploadField field="image_url" label="Cover Image" />
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Content</label><textarea required className={`${inp} h-40 resize-none`} placeholder="Write content..." value={currentItem.content || ''} onChange={e => setCurrentItem({...currentItem, content: e.target.value})} /></div>
              </>)}

              {activeTab === 'skills' && (<>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Skill Name</label><input required className={inp} placeholder="e.g. React" value={currentItem.name || ''} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label><input required className={inp} placeholder="e.g. Frontend" value={currentItem.category || ''} onChange={e => setCurrentItem({...currentItem, category: e.target.value})} /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Percentage (0-100)</label><input required type="number" min={0} max={100} className={inp} value={currentItem.percentage || ''} onChange={e => setCurrentItem({...currentItem, percentage: Number(e.target.value)})} /></div>
              </>)}

              {activeTab === 'socials' && (<>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Platform</label><input required className={inp} placeholder="e.g. GitHub" value={currentItem.platform || ''} onChange={e => setCurrentItem({...currentItem, platform: e.target.value})} /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">URL</label><input required className={inp} placeholder="https://..." value={currentItem.url || ''} onChange={e => setCurrentItem({...currentItem, url: e.target.value})} /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Icon</label><IconPicker value={currentItem.icon || ''} onChange={v => setCurrentItem({...currentItem, icon: v})} /></div>
              </>)}

              {activeTab === 'services' && (<>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</label><input required className={inp} value={currentItem.title || ''} onChange={e => setCurrentItem({...currentItem, title: e.target.value})} /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label><textarea required className={`${inp} h-24 resize-none`} value={currentItem.description || ''} onChange={e => setCurrentItem({...currentItem, description: e.target.value})} /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Best For</label><input className={inp} placeholder="Brand identity, ads, social creatives" value={currentItem.best_for || ''} onChange={e => setCurrentItem({...currentItem, best_for: e.target.value})} /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Outcome</label><input className={inp} placeholder="Consistent visuals that convert" value={currentItem.outcome || ''} onChange={e => setCurrentItem({...currentItem, outcome: e.target.value})} /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Icon</label><IconPicker value={currentItem.icon || ''} onChange={v => setCurrentItem({...currentItem, icon: v})} /></div>
              </>)}

              {activeTab === 'pricing' && (<>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Package name</label><input required className={inp} placeholder="e.g. Starter, Pro, Retainer" value={currentItem.name || ''} onChange={e => setCurrentItem({ ...currentItem, name: e.target.value })} /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Subtitle (optional)</label><input className={inp} placeholder="e.g. Best for new brands" value={currentItem.subtitle || ''} onChange={e => setCurrentItem({ ...currentItem, subtitle: e.target.value })} /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Price display</label><input required className={inp} placeholder="e.g. $899 or ৳15,000" value={currentItem.price_display || ''} onChange={e => setCurrentItem({ ...currentItem, price_display: e.target.value })} /></div>
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Price note (optional)</label><input className={inp} placeholder="e.g. per project, /month" value={currentItem.price_note || ''} onChange={e => setCurrentItem({ ...currentItem, price_note: e.target.value })} /></div>
                </div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Short description</label><textarea className={`${inp} h-20 resize-none`} placeholder="One or two sentences about this tier" value={currentItem.description || ''} onChange={e => setCurrentItem({ ...currentItem, description: e.target.value })} /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Features (one per line)</label><textarea className={`${inp} h-28 resize-none font-mono text-xs`} placeholder={'Revision rounds\nSource files\nPriority support'} value={typeof currentItem.features === 'string' ? currentItem.features : ''} onChange={e => setCurrentItem({ ...currentItem, features: e.target.value })} /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Sort order</label><input type="number" className={inp} value={currentItem.order_index ?? 0} onChange={e => setCurrentItem({ ...currentItem, order_index: Number(e.target.value) })} /></div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={Boolean(currentItem.is_popular)}
                        onChange={e => setCurrentItem({ ...currentItem, is_popular: e.target.checked ? 1 : 0 })}
                      />
                      Highlight as “Most popular”
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Button label</label><input className={inp} placeholder="Get started" value={currentItem.cta_text || ''} onChange={e => setCurrentItem({ ...currentItem, cta_text: e.target.value })} /></div>
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Button link</label><input className={inp} placeholder="/contact or https://…" value={currentItem.cta_href || ''} onChange={e => setCurrentItem({ ...currentItem, cta_href: e.target.value })} /></div>
                </div>
              </>)}

              {activeTab === 'timeline' && (<>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Type</label>
                  <select required className={inp} value={currentItem.type || 'experience'} onChange={e => setCurrentItem({...currentItem, type: e.target.value})}>
                    <option value="experience">Experience</option>
                    <option value="education">Education</option>
                  </select>
                </div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</label><input required className={inp} value={currentItem.title || ''} onChange={e => setCurrentItem({...currentItem, title: e.target.value})} /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Institution</label><input required className={inp} value={currentItem.institution || ''} onChange={e => setCurrentItem({...currentItem, institution: e.target.value})} /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Period</label><input required className={inp} placeholder="2022 - 2024" value={currentItem.period || ''} onChange={e => setCurrentItem({...currentItem, period: e.target.value})} /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Order</label><input type="number" className={inp} value={currentItem.order_index || 0} onChange={e => setCurrentItem({...currentItem, order_index: Number(e.target.value)})} /></div>
              </>)}

              {activeTab === 'why' && (<>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</label><input required className={inp} value={currentItem.title || ''} onChange={e => setCurrentItem({...currentItem, title: e.target.value})} /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label><textarea required className={`${inp} h-24 resize-none`} value={currentItem.description || ''} onChange={e => setCurrentItem({...currentItem, description: e.target.value})} /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Icon</label><IconPicker value={currentItem.icon || ''} onChange={v => setCurrentItem({...currentItem, icon: v})} /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Order</label><input type="number" className={inp} value={currentItem.order_index || 0} onChange={e => setCurrentItem({...currentItem, order_index: Number(e.target.value)})} /></div>
              </>)}

              {activeTab === 'testimonials' && (<>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Name</label><input required className={inp} value={currentItem.name || ''} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Role</label><input required className={inp} value={currentItem.role || ''} onChange={e => setCurrentItem({...currentItem, role: e.target.value})} /></div>
                <UploadField field="photo_url" label="Photo" />
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Testimonial</label><textarea required className={`${inp} h-24 resize-none`} value={currentItem.text || ''} onChange={e => setCurrentItem({...currentItem, text: e.target.value})} /></div>
              </>)}

              {activeTab === 'categories' && (
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category Name</label><input required className={inp} placeholder="e.g. Web Design" value={currentItem.name || ''} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} /></div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isProcessing || uploading} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  {isProcessing ? 'Saving...' : isEditing ? 'Save Changes' : 'Add'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
