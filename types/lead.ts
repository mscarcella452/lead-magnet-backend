import {
  Lead as PrismaLead,
  Note as PrismaNote,
  Activity,
  LeadMagnet,
} from "@prisma/client";

/**
 * Lead Types
 *
 * These types define the structure of lead data throughout the application.
 */

// Re-export Prisma Lead type
export type Lead = PrismaLead;

// Re-export Prisma Note type
export type Note = PrismaNote;

// Lead with all relations (notes, activities, and leadMagnet)
export type LeadWithRelations = PrismaLead & {
  notes: Note[];
  activities: Activity[];
  leadMagnet: LeadMagnet | null;
};

// Input type for creating a new lead
export interface LeadCreateInput {
  email: string;
  name: string;
  source?: string;
  metadata?: Record<string, any>;
}

// Dashboard statistics
export interface LeadStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

// Generic API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API error response
export interface ApiError {
  success: false;
  error: string;
  statusCode?: number;
}

// Table row type for leads table display
export interface LeadTableRow {
  id: string; // full ObjectId
  displayId: string; // user-friendly short ID
  displayName: string; // name || displayId
  email: string; // lead email
  name: string | null; // lead name (nullable)
  status: PrismaLead["status"];
  priority: PrismaLead["priority"];
  score?: number;
  source?: PrismaLead["source"];
  campaign?: PrismaLead["campaign"];
  createdAt: Date;
  assignedTo?: string;
}
