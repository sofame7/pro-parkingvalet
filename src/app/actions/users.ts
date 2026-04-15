"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function createUser(data: any) {
  await checkAdmin();
  const hashedPassword = await bcrypt.hash(data.password, 10);
  await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      phone: data.phone,
      role: data.role || "EMPLOYEE",
    }
  });
  revalidatePath("/dashboard/users");
}

export async function updateUser(id: string, data: any) {
  await checkAdmin();
  const updateData: any = {
    email: data.email,
    name: data.name,
    phone: data.phone,
    role: data.role || "EMPLOYEE",
  };
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }
  await prisma.user.update({
    where: { id },
    data: updateData
  });
  revalidatePath("/dashboard/users");
}

export async function deleteUser(id: string) {
  await checkAdmin();
  await prisma.user.delete({ where: { id } });
  revalidatePath("/dashboard/users");
}
