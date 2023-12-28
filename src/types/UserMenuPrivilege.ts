export default interface UserMenuPrivilege {
  user_menu_privilege_id?: number;
  tenant_id?: number;
  user_id?: number;
  standard_menu_id?: number;
  menu_order?: number;
  active?: boolean;
  created_dt?: Date;
  last_updated_dt?: Date;
}
