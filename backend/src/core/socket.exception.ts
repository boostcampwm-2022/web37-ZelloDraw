import { WsException } from '@nestjs/websockets';

export type SocketExceptionStatus =
    | 'BadRequest'
    | 'Unauthorized'
    | 'Forbidden'
    | 'NotFound'
    | 'Conflict'
    | 'InternalServerError';

export class SocketException extends WsException {
    constructor(status: SocketExceptionStatus, message: string) {
        super({ status, message });
    }
}
