
export type CreateParams = {
  user_id: number,
  name: string,
  description: string,
  institution: string,
  associated_users_emails: string[],
  filter_set_ids: number[],
}


export type ResearcherInfo = {
  first_name: string,
  id: number,
  institution: string,
  last_name: string
}

export type DataRequestProject = {
  completed_at: string,
  has_access: boolean,
  id: number,
  name: string,
  researcher: ResearcherInfo,
  status: 'Approved' | 'Rejected' | 'In Review' | 'Data Delivered',
  submitted_at: string
}

export type DataRequestState = {
  projects: DataRequestProject[],
  isError: boolean,
  isAdminActive: boolean,
  isProjectsLoading: boolean
}