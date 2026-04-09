import "server-only";
import { prisma } from "@/lib/db";

// ============================================================================
// deleteLead(leadIds: string[]): Promise<void>
// Deletes a lead(s) and all related data (notes, activities)
// Throws error if lead(s) not found
// ============================================================================

export async function deleteLead(leadIds: string[]): Promise<void> {
  await prisma.lead.deleteMany({
    where: { id: { in: leadIds } },
  });
}
