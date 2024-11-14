type StudentProgress = {
  firstName: string;
  lastName: string;
  email: string;
  progress: string;
  feedback: string;
};

export class ClassRoomProgressDto {
  id?: string;
  classRoomId: string;
  assignmentId: string;
  studentsProgress: StudentProgress[];
  createdAt: number;

  public constructor(partial: Partial<ClassRoomProgressDto>) {
    this.id = partial?.id || "";
    this.studentsProgress = partial?.studentsProgress || [];
    this.createdAt =
      partial?.createdAt || new Date().getTime();
  }

  toPlainObject() {
    return Object.keys(this).reduce((acc, key) => {
      acc[key] = (this as any)[key];
      return acc;
    }, {});
  }
}