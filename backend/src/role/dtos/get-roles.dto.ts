import { Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

export class GetRolesDto {
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    includePermissions: boolean
}