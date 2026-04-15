"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import nodemailer from "nodemailer";
import { format } from "date-fns";
import { el } from "date-fns/locale";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function createSchedule(data: any, userIds: string[]) {
  await checkAdmin();
  
  const schedule = await prisma.schedule.create({
    data: {
      date: new Date(data.date),
      partner: data.partner,
      event: data.event,
      type: data.type,
      location: data.location,
      timeframe: data.timeframe,
      peopleCount: data.peopleCount,
      carsCount: data.carsCount,
      team: data.team,
      manager: data.manager,
      notes: data.notes,
      users: {
        connect: userIds.map(id => ({ id }))
      }
    },
    include: { users: true }
  });

  // SEND EMAIL NOTIFICATIONS
  await sendEmailNotifications(schedule, schedule.users);

  revalidatePath("/dashboard");
  return schedule.id;
}

async function sendEmailNotifications(schedule: any, users: any[]) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.ethereal.email",
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const formattedDate = format(new Date(schedule.date), "EEEE, d MMMM yyyy", { locale: el });

    for (const user of users) {
      if (!user.email || user.email === 'admin@proparking.gr') continue; // Don't send to admin dummy
      
      const mailOptions = {
        from: '"Pro Parking Valet" <noreply@proparking.gr>',
        to: user.email,
        subject: `Νέο Πρόγραμμα: ${schedule.event || 'Βάρδια'} - ${formattedDate}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #000; color: #F5C400; padding: 20px; text-align: center;">
              <h2>Pro Parking Valet</h2>
            </div>
            <div style="padding: 20px;">
              <p>Γεια σου <strong>${user.name}</strong>,</p>
              <p>Σου ανατέθηκε νέο πρόγραμμα εργασίας. Παρακάτω θα βρεις τις λεπτομέρειες:</p>
              <ul style="list-style: none; padding: 0; background: #f9f9f9; padding: 15px; border-radius: 5px;">
                <li><strong>Ημερομηνία:</strong> ${formattedDate}</li>
                <li><strong>Είδος:</strong> ${schedule.type}</li>
                ${schedule.location ? `<li><strong>Τοποθεσία:</strong> ${schedule.location}</li>` : ''}
                ${schedule.timeframe ? `<li><strong>Ωράριο:</strong> ${schedule.timeframe}</li>` : ''}
                ${schedule.notes ? `<li><strong>Οδηγίες:</strong> ${schedule.notes}</li>` : ''}
              </ul>
              <p>Για περισσότερες λεπτομέρειες και για να δεις τους συνεργάτες σου, συνδέσου στο σύστημα διαχείρισης.</p>
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login" style="background-color: #F5C400; color: #000; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Σύνδεση στο Σύστημα</a>
              </div>
            </div>
          </div>
        `
      };

      if (!process.env.SMTP_USER) {
        console.log("Mock Email Sent to:", user.email, "Subject:", mailOptions.subject);
      } else {
        await transporter.sendMail(mailOptions);
        console.log("Email Sent to:", user.email);
      }
    }
  } catch (error) {
    console.error("Email sending failed:", error);
  }
}
