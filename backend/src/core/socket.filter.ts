import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { SocketException } from './socket.exception';

@Catch(SocketException)
export class SocketExceptionFilter extends BaseWsExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ackCallback = host.getArgByIndex(2);
        ackCallback(exception);
    }
}
