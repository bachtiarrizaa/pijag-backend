import prisma from "../config/prisma.config";

export class BlacklistTokenRepository {
  static async findBlacklistToken(token: string) {
    try {
      const findToken = await prisma.blacklistToken.findFirst({
        where: { token }
      });
      return findToken;
    } catch (error) {
      throw error;
    };
  };

  static async create(token: string, expiredAt: Date) {
    try {
      const createBlacklistToken = await prisma.blacklistToken.create({
        data: {
          token,
          expiredAt
        }
      });
      return createBlacklistToken;
    } catch (error) {
      throw error;
    };
  };
}