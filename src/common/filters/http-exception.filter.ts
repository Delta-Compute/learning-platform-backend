import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from "@nestjs/common";
import { Response } from "express";
import { logError } from "../utils/loger.util";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus() ? exception.getStatus() : 500;
    let message = exception.message;
    
    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse() as { message: any };
      const errors = exceptionResponse.message;

      message = Array.isArray(errors)
        ? errors.join(", ")
        : errors || exception.message;
    }

    logError({ status, message, name: exception.name });

    response.status(status).json({
      message,
      statusCode: status,
      error: exception.stack,
    });
  }
}
