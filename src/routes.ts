import express, { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();
export function healthRoutes(): Router {
  router.get('/notification-health', (req, res) => {
    res.status(StatusCodes.OK).send('Notification service is healthy and Ok');
  });
  return router;
}
