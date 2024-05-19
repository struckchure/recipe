import { status } from '@grpc/grpc-js';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  static GRPCStatusCode: Record<number, number> = {
    [status.OK]: HttpStatus.OK,
    [status.CANCELLED]: HttpStatus.REQUEST_TIMEOUT,
    [status.UNKNOWN]: HttpStatus.BAD_GATEWAY,
    [status.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
    [status.DEADLINE_EXCEEDED]: HttpStatus.REQUEST_TIMEOUT,
    [status.NOT_FOUND]: HttpStatus.NOT_FOUND,
    [status.ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [status.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
    [status.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
    [status.FAILED_PRECONDITION]: HttpStatus.BAD_REQUEST,
    [status.ABORTED]: HttpStatus.BAD_GATEWAY,
    [status.OUT_OF_RANGE]: HttpStatus.BAD_REQUEST,
    [status.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
    [status.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
    [status.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
    [status.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR,
    [status.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
  };

  catch(exception: RpcException, host: ArgumentsHost) {
    const error: any = exception.getError();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const grpcError = error;
    const grpcErrorCode = grpcError.code || status.INTERNAL;
    const grpcErrorMessage = grpcError.details || 'Internal Server Error';
    const httpStatusCode = RpcExceptionFilter.GRPCStatusCode[grpcErrorCode];

    response.status(httpStatusCode).json({ message: grpcErrorMessage || null });
  }
}
