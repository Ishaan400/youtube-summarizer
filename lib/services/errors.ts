export class ServiceConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServiceConfigError';
  }
}

export class UpstreamServiceError extends Error {
  status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.name = 'UpstreamServiceError';
    this.status = status;
  }
}
