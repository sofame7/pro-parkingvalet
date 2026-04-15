"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { createUser, updateUser, deleteUser } from "@/app/actions/users";

export default function UsersTable({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", password: "", role: "EMPLOYEE"
  });

  const openModal = (user?: any) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, phone: user.phone || "", password: "", role: user.role });
    } else {
      setEditingUser(null);
      setFormData({ name: "", email: "", phone: "", password: "", role: "EMPLOYEE" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
        toast.success("Ενημερώθηκε επιτυχώς!");
      } else {
        await createUser(formData);
        toast.success("Δημιουργήθηκε επιτυχώς!");
      }
      setIsModalOpen(false);
      window.location.reload(); // Quick refresh for state
    } catch (err: any) {
      toast.error(err.message || "Σφάλμα αποθήκευσης");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Σίγουρα θέλετε να διαγράψετε αυτόν τον χρήστη;")) {
      try {
        await deleteUser(id);
        toast.success("Διαγράφηκε επιτυχώς!");
        window.location.reload();
      } catch (err) {
        toast.error("Σφάλμα διαγραφής");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => openModal()}
          className="bg-primary hover:bg-primary-hover text-black px-4 py-2 rounded-xl font-semibold shadow-md glow flex items-center gap-2 transition-all"
        >
          <Plus size={20} />
          Νέος Υπάλληλος
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#262626] border-b border-border">
                <th className="p-4 font-semibold text-sm">Όνομα</th>
                <th className="p-4 font-semibold text-sm">Email</th>
                <th className="p-4 font-semibold text-sm">Τηλέφωνο</th>
                <th className="p-4 font-semibold text-sm">Ρόλος</th>
                <th className="p-4 font-semibold text-sm text-right">Ενέργειες</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {initialUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-[#1f1f1f] transition-colors">
                  <td className="p-4">{user.name}</td>
                  <td className="p-4 text-sm text-gray-500">{user.email}</td>
                  <td className="p-4 text-sm">{user.phone || "-"}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openModal(user)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                      <Edit2 size={18} />
                    </button>
                    {user.email !== "admin@proparking.gr" && (
                      <button onClick={() => handleDelete(user.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-border">
            <div className="p-4 sm:p-6 border-b border-border flex justify-between items-center bg-gray-50 dark:bg-[#1a1a1a]">
              <h3 className="text-xl font-bold">{editingUser ? 'Επεξεργασία Υπαλλήλου' : 'Νέος Υπάλληλος'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Ονοματεπώνυμο *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-border bg-input outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email *</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-border bg-input outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Τηλέφωνο</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-border bg-input outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Κωδικός {editingUser ? '(Κενό για διατήρηση)' : '*'}</label>
                <input required={!editingUser} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-border bg-input outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Ρόλος</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-border bg-input outline-none focus:ring-2 focus:ring-primary">
                  <option value="EMPLOYEE">Υπάλληλος</option>
                  <option value="ADMIN">Διαχειριστής</option>
                </select>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium">Ακύρωση</button>
                <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary-hover text-black rounded-xl font-semibold shadow-md transition-all">Αποθήκευση</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
