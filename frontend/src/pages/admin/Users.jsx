import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../api/client";
import { Search, UserPlus, Trash2, Edit3, ShieldCheck } from "lucide-react";

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

  const roleColors = { admin: "text-blueberry", teacher: "text-sunshine", student: "text-mint-600", parent: "text-sky-600" };

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground animate-pulse">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blueberry">Users</h1>
          <p className="text-muted-foreground">Create and manage accounts for all roles.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blueberry text-white font-medium hover:bg-blueberry/90 transition-colors">
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
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-blueberry outline-none"
        />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50">
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
              <tr key={u.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                <td className="px-4 py-3">{u.full_name}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${roleColors[u.role] || "text-muted-foreground"} border-${roleColors[u.role] ? roleColors[u.role].replace("text-", "") : "muted"}/20`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`w-2 h-2 rounded-full ${u.is_active ? "bg-mint" : "bg-muted"}`} />
                  {u.is_active ? "Active" : "Inactive"}
                </td>
                <td className="px-4 py-3 text-right">
                  {editing === u.id ? (
                    <div className="flex gap-2">
                      <input
                        value={form.full_name}
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                        className="px-2 py-1 border rounded text-sm w-24"
                      />
                      <button onClick={saveEdit} className="px-2 py-1 bg-mint text-mint-foreground rounded text-xs hover:bg-mint/90">Save</button>
                      <button onClick={() => setEditing(null)} className="px-2 py-1 text-muted-foreground hover:bg-accent rounded text-xs">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(u)} className="p-2 text-muted-foreground hover:text-blueberry hover:bg-blueberry/10 rounded transition-colors" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deactivate(u.id)} className="p-2 text-muted-foreground hover:text-bubblegum hover:bg-bubblegum/10 rounded transition-colors" title="Deactivate">
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
