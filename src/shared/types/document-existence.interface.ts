export interface DocumentExistenceInterface {
  exists(documentId: string): Promise<boolean>;
}
