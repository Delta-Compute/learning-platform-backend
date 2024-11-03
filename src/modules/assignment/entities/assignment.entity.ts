export class AssignmentDto {
  id?: string;
  classRoomId: string;
  topic: string;
  description: string;
  title: string;
  createdAt: number;
  deadline: Date;

  public constructor(partial: Partial<AssignmentDto>) {
    this.id = partial?.id || "";
    this.topic = partial?.topic || "";
    this.title = partial?.title || "";
    this.description = partial.description || "";
    this.classRoomId = partial.classRoomId || "";
    this.deadline = partial?.deadline;
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