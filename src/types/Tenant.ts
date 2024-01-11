import type { User } from "./User";

export interface Tenant {
  tenant_id?: number | null;
  user_id?: number | null;
  name?: string;
  tenant_email_id?: string;
  tenant_phone?: string;
  user_name?: string;
  email_id?: string;
  phone?: string;
  tenant_type_id?: number | null;
  tenant_status_id?: number | null;
  description?: string;
  location?: string;
  logo_url?: string;
  is_official_contact_info?: boolean;
  is_skill_experience?: boolean;
  user?: User;
  active?: boolean;
  created_by_id?: number | null;
  created_dt?: Date | null;
  last_updated_dt?: Date | null;
}
