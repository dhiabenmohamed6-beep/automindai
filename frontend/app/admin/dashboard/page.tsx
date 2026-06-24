'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminFetch, adminPost, adminPut, adminPatch, adminDelete } from '@/lib/api';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  bullets: string[];
  cover_image: string | null;
  cover_gradient: string;
  is_active: boolean;
}

interface PortfolioItem {
  id: number;
  title: string;
  tag: string;
  category: string;
  icon: string;
  description: string;
  stack: string[];
  image: string | null;
  is_active: boolean;
}

interface Industry {
  id: number;
  name: string;
  before_text: string;
  after_text: string;
  stats: [string, string][];
  is_active: boolean;
}

interface ContactSubmission {
  id: number;
  full_name: string;
  email: string;
  service: string;
  message: string;
  submitted_at: string;
}

type Tab = 'overview' | 'services' | 'portfolio' | 'industries' | 'submissions' | 'settings';

export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const [settings, setSettings] = useState({
    title: 'AutoMindAi — Where Automation Meets Intelligence',
    tagline: 'Where automation meets intelligence',
    desc: 'AutoMindAi builds AI automation, agents, chatbots, websites, software and industrial automation systems for businesses across Tunisia and beyond.',
    email: 'hello@automindai.com',
    phone: '+216 XX XXX XXX',
    location: 'Tunisia',
    response: 'Within 1 business day',
    social: { instagram: '#', linkedin: '#', x: '#' },
    stats: [
      { label: 'Always-on systems', value: '24/7' },
      { label: 'Automation services', value: '14' },
      { label: 'Languages spoken by AURA', value: '4' },
    ]
  });

  useEffect(() => {
    const t = localStorage.getItem('amai_admin_token');
    const u = localStorage.getItem('amai_admin_user');
    if (!t || !u) {
      router.push('/admin/login');
      return;
    }
    setToken(t);
    setUser(JSON.parse(u));
    loadAll(t);
  }, []);

  async function loadAll(t: string) {
    setLoading(true);
    try {
      const [s, p, i, c] = await Promise.all([
        adminFetch('admin/services', t),
        adminFetch('admin/portfolio', t),
        adminFetch('admin/industries', t),
        adminFetch('admin/submissions', t),
      ]);
      setServices(Array.isArray(s) ? s : (s.results || s));
      setPortfolio(Array.isArray(p) ? p : (p.results || p));
      setIndustries(Array.isArray(i) ? i : (i.results || i));
      setSubmissions(Array.isArray(c) ? c : (c.results || c));
    } catch (err) {
      showToast('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function handleLogout() {
    localStorage.removeItem('amai_admin_token');
    localStorage.removeItem('amai_admin_refresh');
    localStorage.removeItem('amai_admin_user');
    router.push('/admin/login');
  }

  async function deleteItem(endpoint: string, id: number, setList: Function) {
    if (!confirm('Delete this item?')) return;
    try {
      await adminDelete(`${endpoint}/${id}`, token!);
      setList((prev: any[]) => prev.filter((x: any) => x.id !== id));
      showToast('Deleted successfully');
    } catch {
      showToast('Failed to delete');
    }
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '◼' },
    { id: 'services', label: 'Services', icon: '◻' },
    { id: 'portfolio', label: 'Portfolio', icon: '▣' },
    { id: 'industries', label: 'Industries', icon: '▤' },
    { id: 'submissions', label: 'Submissions', icon: '✉' },
    { id: 'settings', label: 'Settings', icon: '⚙' },
  ];

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`fixed top-4 left-4 z-50 md:hidden bg-white border border-[var(--line)] rounded-full w-10 h-10 flex items-center justify-center shadow-lg ${sidebarOpen ? 'hidden' : ''}`}>
        {sidebarOpen ? '✕' : '☰'}
      </button>

      <aside className={`fixed top-0 left-0 h-full w-[260px] bg-white border-r border-[var(--line)] z-40 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b border-[var(--line)]">
          <h1 className="font-display text-xl font-bold">AutoMind<span className="text-[var(--deep)]">Ai</span></h1>
          <p className="text-xs text-[var(--ink-soft)] mt-1">Admin Dashboard</p>
        </div>
        <nav className="p-4 space-y-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-sm font-medium transition ${activeTab === tab.id ? 'bg-[var(--navy)] text-white' : 'text-[var(--ink-soft)] hover:bg-[var(--paper)]'}`}>
              <span className="text-lg">{tab.icon}</span>{tab.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--line)]">
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-sm text-[var(--ink-soft)] hover:bg-red-50 hover:text-red-600 transition">Sign out</button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="md:ml-[260px] p-6 md:p-10 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold capitalize">{activeTab}</h1>
              <p className="text-sm text-[var(--ink-soft)] mt-1">Welcome back, {user?.username}</p>
            </div>
            <button onClick={() => router.push('/')} className="btn btn-ghost btn-sm">View site →</button>
          </div>

          {toast && <div className="fixed bottom-6 right-6 bg-[var(--navy)] text-white px-5 py-3 rounded-[10px] text-sm font-medium shadow-xl z-50" style={{ animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>{toast}</div>}

          {loading ? <LoadingSkeleton /> : (
            <>
              {activeTab === 'overview' && <OverviewTab services={services} portfolio={portfolio} industries={industries} submissions={submissions} setActiveTab={setActiveTab} />}
              {activeTab === 'services' && <ServicesTab services={services} token={token!} onRefresh={() => loadAll(token!)} onDelete={(id) => deleteItem('admin/services', id, setServices)} showToast={showToast} />}
              {activeTab === 'portfolio' && <PortfolioTab items={portfolio} token={token!} onRefresh={() => loadAll(token!)} onDelete={(id) => deleteItem('admin/portfolio', id, setPortfolio)} showToast={showToast} />}
              {activeTab === 'industries' && <IndustriesTab items={industries} token={token!} onRefresh={() => loadAll(token!)} onDelete={(id) => deleteItem('admin/industries', id, setIndustries)} showToast={showToast} />}
              {activeTab === 'submissions' && <SubmissionsTab items={submissions} showToast={showToast} />}
              {activeTab === 'settings' && <SettingsTab settings={settings} setSettings={setSettings} token={token!} showToast={showToast} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-[12px] border border-[var(--line)] p-6 animate-pulse">
          <div className="h-4 bg-[var(--paper)] rounded w-1/3 mb-3" />
          <div className="h-3 bg-[var(--paper)] rounded w-full" />
        </div>
      ))}
    </div>
  );
}

function OverviewTab({ services, portfolio, industries, submissions, setActiveTab }: {
  services: any[]; portfolio: any[]; industries: any[]; submissions: any[]; setActiveTab: (tab: Tab) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Services" value={services.length} />
        <StatCard label="Portfolio" value={portfolio.length} />
        <StatCard label="Industries" value={industries.length} />
        <StatCard label="Submissions" value={submissions.length} />
      </div>
      <div className="bg-white rounded-[12px] border border-[var(--line)] p-6">
        <h3 className="font-display text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {['services', 'portfolio', 'industries', 'submissions'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as Tab)} className="btn btn-ghost btn-sm capitalize">+ New {tab.slice(0, -1)}</button>
          ))}
        </div>
      </div>
      {submissions.length > 0 && (
        <div className="bg-white rounded-[12px] border border-[var(--line)] p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Recent Submissions</h3>
          <div className="space-y-3">
            {submissions.slice(0, 5).map((s: any) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-[10px] bg-[var(--paper)]">
                <div>
                  <p className="text-sm font-medium">{s.full_name}</p>
                  <p className="text-xs text-[var(--ink-soft)]">{s.email} · {s.service || 'No service'}</p>
                </div>
                <span className="text-xs text-[var(--ink-soft)]">{new Date(s.submitted_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-[12px] border border-[var(--line)] p-5">
      <p className="font-display text-2xl font-bold text-[var(--deep)]">{value}</p>
      <p className="text-xs text-[var(--ink-soft)] uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}

// SERVICES TAB
function ServicesTab({ services, token, onRefresh, onDelete, showToast }: {
  services: Service[]; token: string; onRefresh: () => void; onDelete: (id: number) => void; showToast: (msg: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ title: '', description: '', icon: '', bullets: '', cover_image: '', cover_gradient: 'linear-gradient(135deg,#0057FF,#00A3FF)', is_active: true });

  function openCreate() {
    setEditing(null);
    setForm({ title: '', description: '', icon: '', bullets: '', cover_image: '', cover_gradient: 'linear-gradient(135deg,#0057FF,#00A3FF)', is_active: true });
    setShowForm(true);
  }

  function openEdit(s: Service) {
    setEditing(s);
    setForm({ title: s.title, description: s.description, icon: s.icon, bullets: (s.bullets || []).join('\n'), cover_image: s.cover_image || '', cover_gradient: s.cover_gradient, is_active: s.is_active });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = { ...form, bullets: form.bullets.split('\n').filter(Boolean), cover_image: form.cover_image || null };
    try {
      if (editing) { await adminPatch(`admin/services/${editing.id}`, token, data); showToast('Service updated'); }
      else { await adminPost('admin/services', token, data); showToast('Service created'); }
      setShowForm(false); onRefresh();
    } catch { showToast('Failed to save'); }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-[var(--ink-soft)]">{services.length} services</p>
        <button onClick={openCreate} className="btn btn-primary btn-sm">+ Add service</button>
      </div>
      <div className="space-y-3">
        {services.map(s => (
          <div key={s.id} className="bg-white rounded-[12px] border border-[var(--line)] p-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm truncate">{s.title}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${s.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{s.is_active ? 'Active' : 'Draft'}</span>
              </div>
              <p className="text-xs text-[var(--ink-soft)] line-clamp-2">{s.description}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(s)} className="btn btn-ghost btn-sm">Edit</button>
              <button onClick={() => onDelete(s.id)} className="btn btn-danger btn-sm">Del</button>
            </div>
          </div>
        ))}
        {services.length === 0 && <p className="text-center text-sm text-[var(--ink-soft)] py-10">No services yet.</p>}
      </div>
      {showForm && <FormModal title={editing ? 'Edit Service' : 'New Service'} onClose={() => setShowForm(false)} onSubmit={handleSubmit}>
        <TextField label="Title" value={form.title} onChange={v => setForm({ ...form, title: v })} required />
        <TextField label="Icon key" value={form.icon} onChange={v => setForm({ ...form, icon: v })} placeholder="e.g. chatbot, web" />
        <TextArea label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} required />
        <TextArea label="Bullets (one per line)" value={form.bullets} onChange={v => setForm({ ...form, bullets: v })} mono />
        <div>
          <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1">Cover image URL or inline SVG</label>
          <textarea className="w-full px-3 py-2 rounded-[8px] border border-[var(--line)] text-sm min-h-[80px] font-mono text-xs" value={form.cover_image} onChange={e => setForm({ ...form, cover_image: e.target.value })} placeholder="https://... or paste SVG code" />
          {form.cover_image && (
            <div className="mt-2 w-full h-[80px] rounded-[8px] border border-[var(--line)] overflow-hidden bg-[var(--paper)] flex items-center justify-center">
              {form.cover_image.startsWith('http') ? <img src={form.cover_image} alt="" className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} /> : null}
            </div>
          )}
        </div>
      </FormModal>}
    </div>
  );
}

// PORTFOLIO TAB
function PortfolioTab({ items, token, onRefresh, onDelete, showToast }: {
  items: PortfolioItem[]; token: string; onRefresh: () => void; onDelete: (id: number) => void; showToast: (msg: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [form, setForm] = useState({ title: '', tag: '', category: 'automation', icon: '', description: '', stack: '', image: '', is_active: true });

  function openCreate() {
    setEditing(null);
    setForm({ title: '', tag: '', category: 'automation', icon: '', description: '', stack: '', image: '', is_active: true });
    setShowForm(true);
  }

  function openEdit(p: PortfolioItem) {
    setEditing(p);
    setForm({ title: p.title, tag: p.tag, category: p.category, icon: p.icon, description: p.description, stack: (p.stack || []).join(', '), image: p.image || '', is_active: p.is_active });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = { ...form, stack: form.stack.split(',').map(s => s.trim()).filter(Boolean), image: form.image || null };
    try {
      if (editing) { await adminPatch(`admin/portfolio/${editing.id}`, token, data); showToast('Project updated'); }
      else { await adminPost('admin/portfolio', token, data); showToast('Project created'); }
      setShowForm(false); onRefresh();
    } catch { showToast('Failed to save'); }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-[var(--ink-soft)]">{items.length} projects</p>
        <button onClick={openCreate} className="btn btn-primary btn-sm">+ Add project</button>
      </div>
      <div className="space-y-3">
        {items.map(p => (
          <div key={p.id} className="bg-white rounded-[12px] border border-[var(--line)] p-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm truncate">{p.title}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${p.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.is_active ? 'Active' : 'Draft'}</span>
              </div>
              <p className="text-xs text-[var(--ink-soft)]">{p.tag} · {(p.stack || []).slice(0, 3).join(', ')}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(p)} className="btn btn-ghost btn-sm">Edit</button>
              <button onClick={() => onDelete(p.id)} className="btn btn-danger btn-sm">Del</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-sm text-[var(--ink-soft)] py-10">No projects yet.</p>}
      </div>
      {showForm && <FormModal title={editing ? 'Edit Project' : 'New Project'} onClose={() => setShowForm(false)} onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextField label="Title" value={form.title} onChange={v => setForm({ ...form, title: v })} required />
          <TextField label="Tag label" value={form.tag} onChange={v => setForm({ ...form, tag: v })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-3">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1">Category</label>
            <select className="w-full px-3 py-2 rounded-[8px] border border-[var(--line)] text-sm" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="automation">Automation & Agents</option>
              <option value="chatbot">Chatbots & Agents</option>
              <option value="industrial">Industrial</option>
              <option value="web">Web / Software</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>
          <TextField label="Icon key" value={form.icon} onChange={v => setForm({ ...form, icon: v })} />
        </div>
        <TextArea label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} required />
        <TextField label="Stack (comma separated)" value={form.stack} onChange={v => setForm({ ...form, stack: v })} placeholder="React, Node.js, PostgreSQL" mono />
        <div>
          <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1">Cover image URL</label>
          <input className="w-full px-3 py-2 rounded-[8px] border border-[var(--line)] text-sm" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
        </div>
      </FormModal>}
    </div>
  );
}

// INDUSTRIES TAB
function IndustriesTab({ items, token, onRefresh, onDelete, showToast }: {
  items: Industry[]; token: string; onRefresh: () => void; onDelete: (id: number) => void; showToast: (msg: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Industry | null>(null);
  const [form, setForm] = useState({ name: '', before_text: '', after_text: '', stats: '', is_active: true });

  function openCreate() {
    setEditing(null);
    setForm({ name: '', before_text: '', after_text: '', stats: '', is_active: true });
    setShowForm(true);
  }

  function openEdit(ind: Industry) {
    setEditing(ind);
    setForm({ name: ind.name, before_text: ind.before_text, after_text: ind.after_text, stats: (ind.stats || []).map(s => s.join('|')).join('\n'), is_active: ind.is_active });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const stats = form.stats.split('\n').filter(Boolean).map(line => {
      const parts = line.split('|');
      return parts.length >= 2 ? [parts[0].trim(), parts.slice(1).join('|').trim()] : [line, line];
    });
    const data = { ...form, stats };
    try {
      if (editing) { await adminPatch(`admin/industries/${editing.id}`, token, data); showToast('Industry updated'); }
      else { await adminPost('admin/industries', token, data); showToast('Industry created'); }
      setShowForm(false); onRefresh();
    } catch { showToast('Failed to save'); }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-[var(--ink-soft)]">{items.length} industries</p>
        <button onClick={openCreate} className="btn btn-primary btn-sm">+ Add industry</button>
      </div>
      <div className="space-y-3">
        {items.map(ind => (
          <div key={ind.id} className="bg-white rounded-[12px] border border-[var(--line)] p-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{ind.name}</h3>
              <p className="text-xs text-[var(--ink-soft)] mt-1 line-clamp-2">{ind.before_text}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(ind)} className="btn btn-ghost btn-sm">Edit</button>
              <button onClick={() => onDelete(ind.id)} className="btn btn-danger btn-sm">Del</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-sm text-[var(--ink-soft)] py-10">No industries yet.</p>}
      </div>
      {showForm && <FormModal title={editing ? 'Edit Industry' : 'New Industry'} onClose={() => setShowForm(false)} onSubmit={handleSubmit}>
        <TextField label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
        <TextArea label="Before AI" value={form.before_text} onChange={v => setForm({ ...form, before_text: v })} required />
        <TextArea label="After AutoMindAi" value={form.after_text} onChange={v => setForm({ ...form, after_text: v })} required />
        <TextArea label="Stats (one per line: value|label)" value={form.stats} onChange={v => setForm({ ...form, stats: v })} placeholder="↓ 30%|No-show rate" mono />
      </FormModal>}
    </div>
  );
}

// SUBMISSIONS TAB
function SubmissionsTab({ items, showToast }: { items: ContactSubmission[]; showToast: (msg: string) => void }) {
  const [search, setSearch] = useState('');
  const filtered = items.filter(s => !search || [s.full_name, s.email, s.service || '', s.message || ''].some(v => v.toLowerCase().includes(search.toLowerCase())));

  return (
    <div>
      <div className="mb-6">
        <input className="px-4 py-2 rounded-[10px] border border-[var(--line)] text-sm w-full max-w-md" placeholder="Search submissions…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="space-y-3">
        {filtered.map(s => (
          <div key={s.id} className="bg-white rounded-[12px] border border-[var(--line)] p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-sm">{s.full_name}</h3>
                <p className="text-xs text-[var(--ink-soft)]">{s.email}</p>
              </div>
              <span className="text-xs text-[var(--ink-soft)]">{new Date(s.submitted_at).toLocaleString()}</span>
            </div>
            {s.service && <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[var(--paper)] text-[var(--deep)] font-mono mb-2">{s.service}</span>}
            {s.message && <p className="text-sm text-[var(--ink-soft)] mt-2 p-3 bg-[var(--paper)] rounded-[8px]">{s.message}</p>}
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-sm text-[var(--ink-soft)] py-10">No submissions found.</p>}
      </div>
    </div>
  );
}

// SETTINGS TAB
function SettingsTab({ settings, setSettings, token, showToast }: {
  settings: any; setSettings: React.Dispatch<React.SetStateAction<any>>; token: string; showToast: (msg: string) => void;
}) {
  const [form, setForm] = useState(settings);

  function update(path: string, value: any) {
    setForm((prev: any) => {
      const next = { ...prev };
      const keys = path.split('.');
      let obj: any = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return { ...next };
    });
  }

  async function handleSave() {
    try {
      localStorage.setItem('amai_settings', JSON.stringify(form));
      setSettings(form);
      showToast('Settings saved');
    } catch { showToast('Failed to save'); }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[12px] border border-[var(--line)] p-6">
        <h3 className="font-display text-lg font-semibold mb-4">Site Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1">Site Title</label>
            <input className="w-full px-3 py-2 rounded-[8px] border border-[var(--line)] text-sm" value={form.title} onChange={e => update('title', e.target.value)} />
          </div>
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1">Tagline</label>
            <input className="w-full px-3 py-2 rounded-[8px] border border-[var(--line)] text-sm" value={form.tagline} onChange={e => update('tagline', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1">Meta Description</label>
            <textarea className="w-full px-3 py-2 rounded-[8px] border border-[var(--line)] text-sm min-h-[80px]" value={form.desc} onChange={e => update('desc', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[12px] border border-[var(--line)] p-6">
        <h3 className="font-display text-lg font-semibold mb-4">Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1">Email</label>
            <input className="w-full px-3 py-2 rounded-[8px] border border-[var(--line)] text-sm" value={form.email} onChange={e => update('email', e.target.value)} />
          </div>
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1">Phone</label>
            <input className="w-full px-3 py-2 rounded-[8px] border border-[var(--line)] text-sm" value={form.phone} onChange={e => update('phone', e.target.value)} />
          </div>
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1">Location</label>
            <input className="w-full px-3 py-2 rounded-[8px] border border-[var(--line)] text-sm" value={form.location} onChange={e => update('location', e.target.value)} />
          </div>
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1">Response Time</label>
            <input className="w-full px-3 py-2 rounded-[8px] border border-[var(--line)] text-sm" value={form.response} onChange={e => update('response', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[12px] border border-[var(--line)] p-6">
        <h3 className="font-display text-lg font-semibold mb-4">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1">Instagram</label>
            <input className="w-full px-3 py-2 rounded-[8px] border border-[var(--line)] text-sm" value={form.social.instagram} onChange={e => update('social.instagram', e.target.value)} />
          </div>
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1">LinkedIn</label>
            <input className="w-full px-3 py-2 rounded-[8px] border border-[var(--line)] text-sm" value={form.social.linkedin} onChange={e => update('social.linkedin', e.target.value)} />
          </div>
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1">X / Twitter</label>
            <input className="w-full px-3 py-2 rounded-[8px] border border-[var(--line)] text-sm" value={form.social.x} onChange={e => update('social.x', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[12px] border border-[var(--line)] p-6">
        <h3 className="font-display text-lg font-semibold mb-4">Hero Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {form.stats.map((stat: any, idx: number) => (
            <div key={idx}>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1">Stat {idx + 1} label</label>
              <input className="w-full px-3 py-2 rounded-[8px] border border-[var(--line)] text-sm" value={stat.label} onChange={e => {
                const next = [...form.stats]; next[idx] = { ...next[idx], label: e.target.value }; update('stats', next);
              }} />
              <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1 mt-2">Stat {idx + 1} value</label>
              <input className="w-full px-3 py-2 rounded-[8px] border border-[var(--line)] text-sm" value={stat.value} onChange={e => {
                const next = [...form.stats]; next[idx] = { ...next[idx], value: e.target.value }; update('stats', next);
              }} />
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} className="btn btn-primary">Save all settings</button>
    </div>
  );
}

// REUSABLE FORM FIELDS
function TextField({ label, value, onChange, required, placeholder, mono }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; mono?: boolean;
}) {
  return (
    <div>
      <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1">{label}</label>
      <input className={`w-full px-3 py-2 rounded-[8px] border border-[var(--line)] text-sm ${mono ? 'font-mono text-xs' : ''}`} value={value} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder} />
    </div>
  );
}

function TextArea({ label, value, onChange, required, placeholder, mono }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; mono?: boolean;
}) {
  return (
    <div>
      <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1">{label}</label>
      <textarea className={`w-full px-3 py-2 rounded-[8px] border border-[var(--line)] text-sm min-h-[80px] ${mono ? 'font-mono text-xs' : ''}`} value={value} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder} />
    </div>
  );
}

function FormModal({ title, onClose, onSubmit, children }: { title: string; onClose: () => void; onSubmit: (e: React.FormEvent) => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-5" onClick={onClose}>
      <div className="bg-white rounded-[20px] max-w-[500px] w-full p-6 max-h-[88vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h2 className="font-display text-xl font-bold mb-5">{title}</h2>
        <form onSubmit={onSubmit} className="space-y-4">{children}</form>
      </div>
    </div>
  );
}
