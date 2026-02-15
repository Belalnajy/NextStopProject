import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('settings')
export class Settings {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // --- General ---
  @Column({ default: 'NextStop Visa' })
  site_name: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column({ default: false })
  maintenance_mode: boolean;

  @Column({ default: false })
  registration_closed: boolean;

  @Column({ default: true })
  email_notifs: boolean;

  @Column({ default: true })
  seo_indexing: boolean;

  // --- Hero Section ---
  @Column({ nullable: true })
  hero_title: string;

  @Column({ type: 'text', nullable: true })
  hero_subtitle: string;

  // --- About Section ---
  @Column({ nullable: true })
  about_title: string;

  @Column({ type: 'text', nullable: true })
  about_mission: string;

  // --- Stats ---
  @Column({ nullable: true })
  stats_travelers: string;

  @Column({ nullable: true })
  stats_support: string;

  @Column({ nullable: true })
  stats_approval: string;

  // --- Contact ---
  @Column({ nullable: true })
  contact_email: string;

  @Column({ nullable: true })
  contact_phone: string;

  @Column({ type: 'text', nullable: true })
  contact_address: string;

  @Column({ nullable: true })
  map_lat: string;

  @Column({ nullable: true })
  map_lng: string;

  // --- Footer ---
  @Column({ nullable: true })
  copyright_text: string;

  @Column('simple-array', { nullable: true })
  hero_images: string[];

  @Column('json', { nullable: true })
  quick_links: { label: string; url: string }[];

  @UpdateDateColumn()
  updated_at: Date;
}
