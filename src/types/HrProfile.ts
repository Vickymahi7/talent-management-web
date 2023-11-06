import { Docs } from "./Docs";
import { Education } from "./Education";
import { Project } from "./Project";
import { WorkExperience } from "./WorkExperience";

export default interface hrProfile {
  id?: string;
  hr_profile_id?: string;
  tenant_id?: string;
  hr_profile_type_id?: string;
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
  status_id?: string;
  user_id?: string;
  active?: true;
  created_by_id?: string;
  created_dt?: string;
  last_updated_dt?: string;
  skills?: string[];
  work_experience?: WorkExperience[];
  project?: Project[];
  education?: Education[];
  docs?: Docs[];
}
