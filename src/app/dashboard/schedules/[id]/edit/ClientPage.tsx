"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSchedule } from "@/app/actions/schedules";
import toast from "react-hot-toast";

export default function EditScheduleForm({ users, schedule }: { users: any[], schedule: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>(schedule.users.map((u: any) => u.id));
  
  const [formData, setFormData] = useState({
    date: new Date(schedule.date).toISOString().split('T')[0],
    partner: schedule.partner || "",
    event: schedule.event || "",
    type: schedule.type || "Εντός",
    location: schedule.location || "",
    timeframe: schedule.timeframe || "",
    peopleCount: schedule.peopleCount || "",
    carsCount: schedule.carsCount || "",
    team: schedule.team || "",
    manager: schedule.manager || "",
    notes: schedule.notes || ""
  });

  const toggleUser = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(u => u !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUsers.length === 0) {
      toast.error("Παρακαλώ επιλέξτε τουλάχιστον έναν υπάλληλο");
      return;
    }
    setLoading(true);
    try {
      await updateSchedule(schedule.id, formData, selectedUsers);
      toast.success("Το πρόγραμμα ενημερώθηκε επιτυχώς!");c
      router.push("/dashboard");
    } catch (err) {
      toast.error("Σφάλμα κατά την ενημέρωση");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Επεξεργασία Προγράμματος</h1>

      <form onSubmit={handleSubmit} className="bg-card border border-border p-6 sm:p-8 rounded-2xl shadow-sm space-y-8">
        
        {/* Στοιχεία Βάρδιας */}
        <div>
          <h2 className="text-lg font-bold border-b border-border pb-2 mb-4 text-primary">Βασικά Στοιχεία</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ημερομηνία *</label>
              <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-border bg-input outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Τύπος (Εντός / Εκτός) *</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-border bg-input outline-none focus:ring-2 focus:ring-primary">
                <option value="Εντός">Εντός</option>
                <option value="Εκτός">Εκτός</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Εκδήλωση / Πελάτης</label>
              <input type="text" value={formData.event} onChange={e => setFormData({...formData, event: e.target.value})} placeholder="π.χ. Γάμος στον Πύργο" className="w-full px-4 py-2 rounded-xl border border-border bg-input outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Τοποθεσία</label>
              <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Διεύθυνση" className="w-full px-4 py-2 rounded-xl border border-border bg-input outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ωράριο</label>
              <input type="text" value={formData.timeframe} onChange={e => setFormData({...formData, timeframe: e.target.value})} placeholder="π.χ. 18:00 - 02:00" className="w-full px-4 py-2 rounded-xl border border-border bg-input outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        </div>

        {/* Επιλογή Υπαλλήλων - MultiSelect */}
        <div>
          <h2 className="text-lg font-bold border-b border-border pb-2 mb-4 text-primary">Επιλογή Υπαλλήλων *</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {users.map(user => (
              <label key={user.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                selectedUsers.includes(user.id) ? 'border-primary bg-primary/10 text-primary-hover dark:text-primary' : 'border-border bg-input hover:border-gray-400 dark:hover:border-gray-600'
              }`}>
                <input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => toggleUser(user.id)} className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary" />
                <span className="font-medium text-sm">{user.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Πρόσθετες Πληροφορίες */}
        <div>
          <h2 className="text-lg font-bold border-b border-border pb-2 mb-4 text-primary">Πρόσθετες Πληροφορίες</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Άτομα (Πλήθος)</label>
              <input type="text" value={formData.peopleCount} onChange={e => setFormData({...formData, peopleCount: e.target.value})} placeholder="π.χ. 300" className="w-full px-4 py-2 rounded-xl border border-border bg-input outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Αυτοκίνητα</label>
              <input type="text" value={formData.carsCount} onChange={e => setFormData({...formData, carsCount: e.target.value})} placeholder="π.χ. 150" className="w-full px-4 py-2 rounded-xl border border-border bg-input outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Εξ. Συνεργάτης</label>
              <input type="text" value={formData.partner} onChange={e => setFormData({...formData, partner: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-border bg-input outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Υπεύθυνος</label>
              <input type="text" value={formData.manager} onChange={e => setFormData({...formData, manager: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-border bg-input outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Οδηγίες / Σχόλια</label>
            <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={3} placeholder="Ειδικές οδηγίες για τη βάρδια..." className="w-full px-4 py-2 rounded-xl border border-border bg-input outline-none focus:ring-2 focus:ring-primary resize-none"></textarea>
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-4 border-t border-border">
          <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors">
            Ακύρωση
          </button>
          <button disabled={loading} type="submit" className="bg-primary hover:bg-primary-hover text-black px-8 py-3 rounded-xl font-bold shadow-lg glow disabled:opacity-70">
            {loading ? 'Αποθήκευση...' : 'Ενημέρωση Προγράμματος'}
          </button>
        </div>
      </form>
    </div>
  );
}
