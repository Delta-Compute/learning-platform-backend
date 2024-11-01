export class AssignmentDto {
  id?: string;
  classRoomId: string;
  description: string;
  // deadline: Date;
  // title:
  createdAt: number;

  public constructor(partial: Partial<AssignmentDto>) {
    this.id = partial?.id || "";
    this.description = partial.description || "";
    this.classRoomId = partial.classRoomId || "";
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