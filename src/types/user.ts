export interface UserBookmark {
  id: string;
  user_id: string;
  paper_id: string;
  created_at: string;
}

export interface UserTopic {
  id: string;
  user_id: string;
  topic: string;
  created_at: string;
}

export interface UserReadPaper {
  id: string;
  user_id: string;
  paper_id: string;
  read_at: string;
}
