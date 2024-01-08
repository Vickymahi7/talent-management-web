import type { User } from "./User";

export interface Tenant {
  tenant_id?: number;
  user_id?: number;
  name?: string;
  tenant_email_id?: string;
  tenant_phone?: string;
  tenant_type_id?: number;
  tenant_status_id?: number;
  description?: string;
  location?: string;
  logo_url?: string;
  is_official_contact_info?: boolean;
  is_skill_experience?: boolean;
  user?: User;
  active?: boolean;
  created_by_id?: number;
  created_dt?: Date;
  last_updated_dt?: Date;
}
