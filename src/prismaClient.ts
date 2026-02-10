// Lazy, safe Prisma client factory
// Only loads @prisma/client when actually needed

let prismaClient: any = undefined;

export async function getPrismaClient() {
	if (!prismaClient) {
		const { PrismaClient } = await import('@prisma/client');
		prismaClient = new PrismaClient();
	}
	return prismaClient;
}
