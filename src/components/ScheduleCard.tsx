"use client";

import { Calendar, Clock, MapPin, Users, Car, UserCircle, Phone } from "lucide-react";
import { format } from "date-fns";
import { el } from "date-fns/locale";

export default function ScheduleCard({ 
  schedule, 
  currentUserId 
}: { 
  schedule: any; 
  currentUserId?: string;
}) {
  const formattedDate = format(new Date(schedule.date), "EEEE, d MMMM yyyy", { locale: el });
  
  // Find partners (co-workers assigned to the same schedule, excluding current user)
  const partners = schedule.users?.filter((u: any) => u.id !== currentUserId) || [];

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative overflow-hidden group">
      {/* Decorative top bar */}
      <div className={`absolute top-0 left-0 w-full h-1 ${schedule.type === 'Εντός' ? 'bg-primary' : 'bg-gray-500'}`} />
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg">{schedule.event || 'Βάρδια'}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{formattedDate}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
          schedule.type === 'Εντός' 
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' 
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
        }`}>
          {schedule.type}
        </span>
      </div>

      <div className="space-y-3 flex-1">
        {schedule.timeframe && (
          <div className="flex items-center text-sm gap-3">
            <Clock size={16} className="text-gray-400" />
            <span>{schedule.timeframe}</span>
          </div>
        )}
        
        {schedule.location && (
          <div className="flex items-center text-sm gap-3">
            <MapPin size={16} className="text-gray-400" />
            <span>{schedule.location}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border">
          {schedule.peopleCount && (
            <div className="flex items-center text-sm gap-2">
              <Users size={16} className="text-gray-400" />
              <span>{schedule.peopleCount} Άτομα</span>
            </div>
          )}
          {schedule.carsCount && (
            <div className="flex items-center text-sm gap-2">
              <Car size={16} className="text-gray-400" />
              <span>{schedule.carsCount} Οχήματα</span>
            </div>
          )}
        </div>

        {partners.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase">Συνεργατες</p>
            {partners.map((p: any) => (
              <div key={p.id} className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-[#262626]">
                <div className="flex items-center gap-2">
                  <UserCircle size={16} className="text-gray-500" />
                  <span className="text-sm font-medium">{p.name}</span>
                </div>
                {p.phone && (
                  <a href={`tel:${p.phone}`} className="flex items-center gap-1 text-primary hover:underline text-xs font-medium">
                    <Phone size={12} />
                    {p.phone}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {schedule.partner && (
          <div className="mt-2 text-sm">
            <span className="font-semibold text-gray-600 dark:text-gray-400">Εξ. Συνεργάτης:</span> {schedule.partner}
          </div>
        )}
        {schedule.manager && (
          <div className="mt-1 text-sm">
            <span className="font-semibold text-gray-600 dark:text-gray-400">Υπεύθυνος:</span> {schedule.manager}
          </div>
        )}
      </div>

      {schedule.notes && (
        <div className="mt-4 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 text-sm">
          <p className="text-yellow-800 dark:text-yellow-200">
            <strong>Οδηγίες:</strong> {schedule.notes}
          </p>
        </div>
      )}
    </div>
  );
}
