export class FelidType {
  static types: Attributes[] = [
    {
      type: "string-tiny",
      modal: `
        @Column(DataType.TEXT('tiny'))
        @ApiProperty({type:"string-tiny"})
        {{felidName}}: string;
        `,
    },
    {
      type: "string-long",
      modal: `
        @Column(DataType.TEXT('long'))
        @ApiProperty({type:"string-long"})
        {{felidName}}: string;
        `,
    },
    {
      type: "integer",
      modal: `
        @Column(DataType.INTEGER)
        @ApiProperty({type:"integer"})
        {{felidName}}: number;`,
    },
    {
      type: "float",
      modal: `
        @Column(DataType.FLOAT)
        @ApiProperty({type:"float"})
        {{felidName}}: number;`,
    },
    {
      type: "date",
      modal: `
        @Column(DataType.DATE)
        @ApiProperty({type:"date"})
        {{felidName}}: Date;`,
    },
    {
      type: "boolean",
      modal: `
        @Column(DataType.BOOLEAN)
        @ApiProperty({type:"boolean"})
        {{felidName}}: boolean;`,
    },
    {
      type: "enum",
      modal: `
        @Column
        @ApiProperty({ type:"enum",enum: {{enums}} })
        @IsEnum({{enums}}, {
         message: "role value must be in {{enums}}",
        })
        {{felidName}}: string;`,
    },
    {
      type: "email",
      modal: `
        @Column
        @IsEmail()
        @ApiProperty({type:"email"})
        {{felidName}}: string;`,
    },
    {
      type: "password",
      modal: `
        @Column
        @ApiProperty({type:"password"})
        {{felidName}}: string;
        @BeforeSave
        static async beforeSaveFunc(instance) {
          instance.{{felidName}} = await bcrypt.hash(instance.{{felidName}}, 10);
         }`,
    },
    {
      type: "uid",
      modal: `
          @Column({unique: true})
          @ApiProperty({type:"uid"})
          {{felidName}}: string;
          @BeforeSave
          static async beforeCreateFunc(instance) {
            instance.{{felidName}} = UUIDV4();
          }`,
    },
  ];
  static getModal(type: string, name: string, enums: string) {
    try {
      return this.types
        .find((i: Attributes) => i.type == type)
        .modal.replace(/{{felidName}}/g, name)
        .replace(/{{enums}}/g, `${enums}`);
    } catch (error) {
      console.log(error);
    }
  }
  static restructure(
    attributes: { type: string; name: string; enum: string }[]
  ) {
    return attributes.map((i) => this.getModal(i.type, i.name, i.enum || ""));
  }
  static allTypes() {
    return this.types.map((i: Attributes) => ({
      type: i.type
    }))

  }
}
export type Attributes = { type: string; modal: string };
