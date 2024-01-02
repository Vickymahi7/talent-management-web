import type { User } from "./User";

export interface Tenant {
  tenant_id?: number;
  user_id?: number;
  name?: string;
  tenant_type_id?: number;
  tenant_status_id?: number;
  description?: string;
  location?: string;
  logo_url?: string;
  user?: User;
  active?: boolean;
  created_by_id?: number;
  created_dt?: Date;
  last_updated_dt?: Date;
}
