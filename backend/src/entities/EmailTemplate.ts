import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

export enum EmailType {
  WELCOME = 'WELCOME',
  APPLICATION_RECEIVED = 'APPLICATION_RECEIVED',
  APPLICATION_APPROVED = 'APPLICATION_APPROVED',
  APPLICATION_REJECTED = 'APPLICATION_REJECTED',
  ACTION_REQUIRED = 'ACTION_REQUIRED',
  STATUS_UPDATE = 'STATUS_UPDATE',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

@Entity('email_templates')
export class EmailTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: EmailType,
    unique: true,
  })
  type: EmailType;

  @Column()
  subject: string;

  @Column('text')
  body_html: string;

  @Column('text', { nullable: true })
  variables_description: string; // JSON or text description of available variables

  @UpdateDateColumn()
  updated_at: Date;
}
