import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Attachment } from './Attachment';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ACTION_REQUIRED = 'ACTION_REQUIRED',
}

export enum PaymentStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  application_no: string;

  // --- Travel Info ---
  @Column()
  nationality: string;

  @Column({ default: false })
  has_other_nationalities: boolean;

  @Column({ nullable: true })
  other_nationalities: string;

  @Column({ type: 'date' })
  arrival_date: string; // Storing as string or Date depending on driver

  @Column()
  passport_number: string;

  // --- Personal Info ---
  @Column()
  full_name: string;

  @Column({ type: 'date' })
  date_of_birth: string;

  @Column({ default: '+20' })
  phone_code: string;

  @Column()
  phone_number: string;

  @Column()
  email: string;

  // --- Address Info ---
  @Column()
  street_name: string;

  @Column()
  building_no: string;

  @Column()
  apartment: string;

  @Column({ nullable: true })
  area: string;

  @Column()
  postal_code: string;

  @Column()
  town_city: string;

  @Column()
  country: string;

  // --- Additional Info ---
  @Column({ default: false })
  has_job: boolean;

  @Column({ nullable: true })
  job_title: string;

  @Column({ default: false })
  has_criminal_record: boolean;

  @Column({ type: 'text', nullable: true })
  criminal_details: string;

  @Column({ default: false })
  has_involvement: boolean;

  @Column({ type: 'text', nullable: true })
  involvement_details: string;

  // --- Declarations ---
  @Column({ default: false })
  confirm_info_declaration: boolean;

  @Column({ default: false })
  accept_terms_declaration: boolean;

  @Column({ default: false })
  confirm_processing_time_declaration: boolean;

  // --- Status & Meta ---
  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  payment_status: PaymentStatus;

  @OneToMany(() => Attachment, (attachment) => attachment.application, {
    cascade: true,
  })
  attachments: Attachment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
