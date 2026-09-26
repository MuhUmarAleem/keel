export class MeetingNotFoundError extends Error {
  constructor(id: string) {
    super(`Meeting not found: ${id}`);
    this.name = "MeetingNotFoundError";
  }
}

export class HighlightNotFoundError extends Error {
  constructor(id: string) {
    super(`Highlight not found: ${id}`);
    this.name = "HighlightNotFoundError";
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}
