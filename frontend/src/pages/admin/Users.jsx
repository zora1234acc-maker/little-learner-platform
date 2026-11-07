import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../api/client";
import { Search, UserPlus, Trash2, Edit3 } from "lucide-react";

export function AdminUsers() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ full_name: "", email: "", role: "student", preferred_lang: "en" });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await api.users.list();
    setUsers(res.data);
    setLoading(false);
  };

  const filtered = users.filter((u) =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (u) => {
    setEditing(u.id);
    setForm({ full_name: u.full_name, email: u.email, role: u.role, preferred_lang: u.preferred_lang });
  };

  const saveEdit = async () => {
    await api.users.update(editing, form);
    setEditing(null);
    loadUsers();
  };

  const deactivate = async (id) => {
    if (window.confirm("Deactivate this user?")) {
      await api.users.update(id, { is_active: false });
      loadUsers();
    }
  };

  const roleColors = { admin: "border-blueberry text-blueberry", teacher: "border-sunshine text-sunshine-800", student: "border-mint text-mint-700", parent: "border-sky text-sky-700" };

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground animate-pulse">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="eyebrow">Users</span>
          <h1 className="text-2xl font-bold text-blueberry">Manage accounts</h1>
          <p className="text-muted-foreground">Create and manage accounts for all roles.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blueberry text-white font-medium hover:bg-blueberry/90 transition-colors touch-target">
          <UserPlus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-blueberry focus:border-transparent outline-none text-base"
        />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Email</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Role</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-border hover:bg-accent/40 transition-colors">
                <td className="px-4 py-3">{u.full_name}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${roleColors[u.role] || "border-muted text-muted-foreground"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${u.is_active ? "bg-mint/10 text-mint-700 border border-mint/20" : "bg-muted/10 text-muted-foreground border border-muted/20"}`}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: u.is_active ? "#2FBF94" : "#cbd5e1" }} />
                    {u.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {editing === u.id ? (
                    <div className="flex gap-2">
                      <input
                        value={form.full_name}
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                        className="px-3 py-2 border rounded-lg text-sm w-32 focus:ring-2 focus:ring-blueberry"
                      />
                      <button onClick={saveEdit} className="px-3 py-2 bg-mint text-white rounded-lg text-xs font-medium hover:bg-mint/90 transition-colors touch-target">Save</button>
                      <button onClick={() => setEditing(null)} className="px-3 py-2 text-muted-foreground rounded-lg hover:bg-accent transition-colors touch-target">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(u)} className="p-2 text-muted-foreground hover:text-blueberry hover:bg-blueberry/10 rounded-lg transition-colors touch-target" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deactivate(u.id)} className="p-2 text-muted-foreground hover:text-bubblegum hover:bg-bubblegum/10 rounded-lg transition-colors touch-target" title="Deactivate">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
