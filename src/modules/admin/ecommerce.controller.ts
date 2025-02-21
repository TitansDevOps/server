import { Response } from 'express';

export class EcommerceController {
  private now: string;
  public constructor() {
    this.now = new Date().toISOString();
  }

  // Respuesta 200 OK
  successResponse(res: Response, message: string, body: any) {
    res.status(200).json({ timestamp: this.now, status: 200, message, body });
  }

  // Respuesta 201 Created
  createdResponse(res: Response, message: string, body: any) {
    res.status(201).json({ timestamp: this.now, status: 201, message, body });
  }

  // Respuesta 400 Bad Request
  badRequestResponse(res: Response, message: string, body: JSON = null) {
    res.status(400).json({ timestamp: this.now, status: 400, message, body });
  }

  // Respuesta 401 Unauthorized
  unauthorizedResponse(res: Response, message: string, body: any) {
    res.status(401).json({ timestamp: this.now, status: 401, message, body });
  }

  // Respuesta 403 Forbidden
  forbiddenResponse(res: Response, message: string, body: any) {
    res.status(403).json({ timestamp: this.now, status: 403, message, body });
  }

  // Respuesta 404 Not Found
  notFoundResponse(res: Response, message: string, body: any) {
    res.status(404).json({ timestamp: this.now, status: 404, message, body });
  }

  // Respuesta 500 Internal Server Error
  internalServerErrorResponse(res: Response, message: string, body: any) {
    res.status(500).json({ timestamp: this.now, status: 500, message, body });
  }
}
