import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Application } from './Application';

export enum AttachmentType {
  PASSPORT_COPY = 'PASSPORT_COPY',
  PERSONAL_PHOTO = 'PERSONAL_PHOTO',
  OTHER = 'OTHER',
}

@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  application_id: string;

  @ManyToOne(() => Application, (application) => application.attachments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'application_id' })
  application: Application;

  @Column({
    type: 'enum',
    enum: AttachmentType,
    default: AttachmentType.OTHER,
  })
  type: AttachmentType;

  @Column()
  file_url: string;

  @Column()
  file_path: string; // Cloudinary public_id or local path

  @CreateDateColumn()
  created_at: Date;
}
