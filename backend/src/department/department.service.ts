import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/common/prisma";

@Injectable()
export class DepartmentService {
    private readonly logger = new Logger(DepartmentService.name);
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async getDepartments() {
        return this.prisma.department.findMany({
            orderBy: {
                id: 'asc'
            }
        });
    }

}