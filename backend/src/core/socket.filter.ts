import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { SocketException } from './socket.exception';

@Catch(Error)
export class SocketExceptionFilter extends BaseWsExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        if (exception instanceof SocketException) {
            const ackCallback = host.getArgByIndex(2);
            ackCallback(exception);
        } else {
            console.error(exception);
        }
    }
}
