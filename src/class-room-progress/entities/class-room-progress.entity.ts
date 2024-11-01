type StudentProgress = {

};

export class ClassRoomProgressDto {
  id?: string;
  classRoomId: string;
  assignmentId: string;
  studentEmails: string[];
  createdAt: number;

  public constructor(partial: Partial<ClassRoomProgressDto>) {
    this.id = partial?.id || "";
    this.studentEmails = partial?.studentEmails || [];
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