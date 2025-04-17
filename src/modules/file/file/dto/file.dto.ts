export class ObjectFile {
  private id: number | null;
  private entity: string | null;
  private idEntity: number | null;
  private fileDate: Date | null;
  private type: string | null;
  private size: number | null;
  private filePath: string | null;
  private webPath: string | null;
  private name: string | null;

  constructor(
    id: number | null = null,
    entity: string | null = null,
    idEntity: number | null = null,
    fileDate: Date | null = null,
    type: string | null = null,
    size: number | null = null,
    filePath: string | null = null,
    webPath: string | null = null,
    name: string | null = null,
  ) {
    this.id = id;
    this.entity = entity;
    this.idEntity = idEntity;
    this.fileDate = fileDate;
    this.type = type;
    this.size = size;
    this.filePath = filePath;
    this.webPath = webPath;
    this.name = name;
  }

  public async getId() {
    return this.id;
  }

  public async setId(id: number | null) {
    this.id = id;
  }

  public async getEntity() {
    return this.entity;
  }

  public async setEntity(entity: string | null) {
    this.entity = entity;
  }

  public async getIdEntity() {
    return this.idEntity;
  }

  public async setIdEntity(idEntity: number | null) {
    this.idEntity = idEntity;
  }

  public async getFileDate() {
    return this.fileDate;
  }

  public async setFileDate(fileDate: Date | null) {
    this.fileDate = fileDate;
  }

  public async setType(type: string | null) {
    this.type = type;
  }

  public async getType() {
    return this.type;
  }

  public async getSize() {
    return this.size;
  }

  public async setSize(size: number | null) {
    this.size = size;
  }

  public async setFilePath(filePath: string | null) {
    this.filePath = filePath;
  }

  public async getFilePath() {
    return this.filePath;
  }

  public async setWebPath(webPath: string | null) {
    this.webPath = webPath;
  }

  public async getWebPath() {
    return this.webPath;
  }

  public async setName(name: string | null) {
    this.name = name;
  }

  public async getName() {
    return this.name;
  }

  public async toJson(): Promise<object> {
    return {
      id: this.id,
      entity: this.entity,
      idEntity: this.idEntity,
      fileDate: this.fileDate,
      type: this.type,
      size: this.size,
      filePath: this.filePath,
      webPath: this.webPath,
      name: this.name,
    };
  }
}
