import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(process.env.NODE_ENV)
  if(process.env.NODE_ENV === 'test'){

  }
  const { method, url, ip } = req;
  const time = new Date();
  const month = time
    .toLocaleString('default', { month: 'long' })
    .substring(0, 3);
  const timestamp = `${time.getDate()}/${month}/${time.getFullYear()}:${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} -0700`;

  const userAgent = req.headers['user-agent'];
  const httpVersion = req.httpVersion;
  const referer = req.headers['referer'];

  console.log(
    `${ip} - [${timestamp}] "${method} ${url} HTTP/${httpVersion}" "${referer}" "${userAgent}"`,
  );
  next();
}
