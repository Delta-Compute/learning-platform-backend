import { School } from "./../../auth/dto/auth-user-dto";

export class ClassRoomDto {
  id?: string;
  name: string;
  teacherId: string;
  logo: string;
  studentEmails: string[];
  assignmentIds: string[];
  learningPlan: string;
  subject: string;
  verificationCode: string;
  createdAt: number;
  school: School;

  public constructor(partial: Partial<ClassRoomDto>) {
    this.id = partial?.id || "";
    this.name = partial?.name || "";
    this.teacherId = partial?.teacherId || "";
    this.logo = partial?.logo || "";
    this.studentEmails = partial?.studentEmails || [];
    this.assignmentIds = partial?.assignmentIds || [];
    this.learningPlan = partial?.learningPlan || "";
    this.subject = partial?.subject || "";
    this.verificationCode = partial?.verificationCode || "";
    this.school = partial?.school || School.MapleBear;
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