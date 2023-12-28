export interface User {
  user_id?: number;
  tenant_id?: number;
  user_type_id?: number;
  user_name?: string;
  password?: string;
  confirm_password?: string;
  existing_password?: string;
  email_id?: string;
  phone?: string;
  access_token?: string;
  activation_token?: string;
  user_status_id?: number;
  active?: boolean;
  created_by_id?: number;
  last_access?: Date;
  created_dt?: Date;
  last_updated_dt?: Date;
}
