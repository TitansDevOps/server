import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    const message = Array.isArray((exceptionResponse as any)?.message)
      ? (exceptionResponse as any).message.join(', ')
      : (exceptionResponse as any)?.message || 'Internal server error';

    response.status(status).json({
      status: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      body: null,
    });
  }
}
