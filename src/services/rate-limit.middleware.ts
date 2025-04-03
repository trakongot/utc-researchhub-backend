// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { NextFunction, Request, Response } from 'express';
// import { RedisService } from '../services/redis.service';

// @Injectable()
// export class RateLimitMiddleware implements NestMiddleware {
//   private readonly WINDOW_MS = 15 * 60 * 1000; // 15 phút
//   private readonly MAX_REQUESTS = 100; // Tối đa 100 requests trong 15 phút

//   constructor(private readonly redisService: RedisService) {}

//   async use(req: Request, res: Response, next: NextFunction) {
//     const ip = req.ip;
//     const key = `rate_limit:${ip}`;

//     try {
//       // Lấy số lượng requests hiện tại
//       const current = await this.redisService.get(key);
//       const count = current ? parseInt(current) : 0;

//       // Kiểm tra nếu vượt quá giới hạn
//       if (count >= this.MAX_REQUESTS) {
//         return res.status(429).json({
//           status: 'error',
//           message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.',
//           retryAfter: Math.ceil(this.WINDOW_MS / 1000),
//         });
//       }

//       // Tăng số lượng requests
//       if (count === 0) {
//         // Nếu là request đầu tiên, set key với thời gian hết hạn
//         await this.redisService.set(key, '1', this.WINDOW_MS / 1000);
//       } else {
//         // Nếu đã có requests, tăng số lượng
//         await this.redisService.incr(key);
//       }

//       // Thêm headers để client biết giới hạn
//       res.setHeader('X-RateLimit-Limit', this.MAX_REQUESTS);
//       res.setHeader('X-RateLimit-Remaining', this.MAX_REQUESTS - (count + 1));
//       res.setHeader('X-RateLimit-Reset', Date.now() + this.WINDOW_MS);

//       next();
//     } catch (error) {
//       // Nếu có lỗi với Redis, cho phép request tiếp tục
//       console.error('Rate limit error:', error);
//       next();
//     }
//   }
// }
