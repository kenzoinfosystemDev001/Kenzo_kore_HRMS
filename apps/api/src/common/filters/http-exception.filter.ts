import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
        
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';
        
    const responseBody = exception instanceof HttpException ? exception.getResponse() : null;
    
    let errorDetails = null;
    if (responseBody && typeof responseBody === 'object' && 'message' in responseBody) {
      errorDetails = responseBody['message'];
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      errors: errorDetails,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
