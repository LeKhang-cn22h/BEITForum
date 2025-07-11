// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { logAndSend } from '../../utils/logAndSendToSheet';

// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//   async catch(exception: unknown, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();

//     const status =
//       exception instanceof HttpException
//         ? exception.getStatus()
//         : HttpStatus.INTERNAL_SERVER_ERROR;

//     const message =
//       exception instanceof HttpException
//         ? exception.message
//         : JSON.stringify(exception);

//     const log = `Error ${status} at ${request.method} ${request.url} - ${message}`;

//     await logAndSend('error', log);

//     response.status(status).json({
//       statusCode: status,
//       timestamp: new Date().toISOString(),
//       path: request.url,
//     });
//   }
// }
