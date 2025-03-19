import { Response } from 'express';
import { HttpException } from '@nestjs/common';

export class BaseController {
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

  handleError(res: Response, error: any) {
    if (error instanceof HttpException) {
      const status = error.getStatus();
      const message = error.message;

      switch (status) {
        case 400:
          this.badRequestResponse(res, message, null);
          break;
        case 401:
          this.unauthorizedResponse(res, message, null);
          break;
        case 403:
          this.forbiddenResponse(res, message, null);
          break;
        case 404:
          this.notFoundResponse(res, message, null);
          break;
        case 500:
          this.internalServerErrorResponse(res, message, null);
          break;
        default:
          this.internalServerErrorResponse(res, 'Internal server error', null);
      }
    } else {
      this.internalServerErrorResponse(res, 'Internal server error', null);
    }
  }
}
