interface Assignment {
  assignmentId: string;
  id: string;
  topic: string;
  title: string;
  description: string;
  classRoomId: string;
  deadline: number;
  timeToDiscuss: number;
  createdAt: number;
  summary: string;
  feedback: string;
};

export interface Report {
  studentName: string;
  studentEmail: string;
  completedAssignments: Assignment[];
  inCompletedAssignments: Assignment[];
};