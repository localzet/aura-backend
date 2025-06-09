import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { getQuery } from 'ufo';

import { Logger } from '@nestjs/common';

const logger = new Logger('CookieAuth');

export function checkAuthCookieMiddleware(authJwtSecret: string, nonce: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const query = getQuery(req.originalUrl);

        if (query.nonce && query.nonce === nonce) {
            const token = signJwt(authJwtSecret);

            res.cookie('nonce', token, {
                httpOnly: true,
                secure: true,
                maxAge: 2_592_000_000, // 30 days
                sameSite: 'strict',
            });

            logger.warn(`Nonce access granted. Request: ${req.originalUrl}. IP: ${req.ip}`);

            return next();
        }

        if ('nonce' in req.cookies) {
            const isVerified = verifyJwt(req.cookies.nonce, authJwtSecret);

            if (!isVerified) {
                logger.error(`Cookie mismatch. Request: ${req.originalUrl}. IP: ${req.ip}`);

                res.socket?.destroy();

                return;
            }

            return next();
        }

        res.socket?.destroy();

        logger.error(`Cookie not found. Request: ${req.originalUrl}. IP: ${req.ip}`);

        return;
    };
}

function signJwt(authJwtSecret: string) {
    return jwt.sign({ sessionId: nanoid(48) }, authJwtSecret, {
        expiresIn: '2592000s',
        issuer: 'Aura',
    });
}

function verifyJwt(token: string, authJwtSecret: string): boolean {
    try {
        const decoded = jwt.verify(token, authJwtSecret, {
            issuer: 'Aura',
        });

        if (typeof decoded === 'object' && 'sessionId' in decoded) {
            return true;
        }

        return false;
    } catch (error) {
        logger.error(`Cookie mismatch: ${error}`);

        return false;
    }
}
