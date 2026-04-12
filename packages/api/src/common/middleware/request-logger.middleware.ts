import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const requestId = (req.headers['x-request-id'] as string) || randomUUID();
    const startTime = Date.now();

    // Set request ID header for correlation
    res.setHeader('x-request-id', requestId);

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { method, originalUrl } = req;
      const { statusCode } = res;
      const userId = (req as any).user?.sub || 'anonymous';

      const logMessage = `${method} ${originalUrl} ${statusCode} ${duration}ms [${userId}] [${requestId}]`;

      if (statusCode >= 500) {
        this.logger.error(logMessage);
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage);
      } else {
        this.logger.log(logMessage);
      }
    });

    next();
  }
}
