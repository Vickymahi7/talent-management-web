import type { Docs } from "./Docs";
import type { Education } from "./Education";
import type { Project } from "./Project";
import type { WorkExperience } from "./WorkExperience";

export default interface HrProfile {
  id?: string;
  hr_profile_id?: string;
  tenant_id?: string;
  hr_profile_type_id?: string;
  profile_title?: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  email_id?: string;
  alternate_email_id?: string;
  mobile?: string;
  alternate_mobile?: string;
  phone?: string;
  office_phone?: string;
  location?: string;
  ctc?: string;
  experience_month?: number | null;
  experience_year?: number | null;
  objective?: string;
  summary?: string;
  note?: string;
  gender?: string;
  date_of_birth?: string;
  resume_url?: string;
  photo_url?: string;
  buiding_number?: string;
  street_name?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  website?: string;
  facebook_id?: string;
  twitter_id?: string;
  linkedin_id?: string;
  skype_id?: string;
  status?: string;
  status_id?: number | null;
  user_id?: string;
  active?: true;
  created_by_id?: string;
  created_dt?: string;
  last_updated_dt?: Date;
  skills?: string[];
  work_experience?: WorkExperience[];
  project?: Project[];
  education?: Education[];
  docs?: Docs[];
}

export type HrProfileChilderen = WorkExperience | Project | Education | Docs;
