import { ApiProperty } from "@nestjs/swagger";

export class LabelDto {
  @ApiProperty({ example: 'label_name' })
  labelName: string;
}
