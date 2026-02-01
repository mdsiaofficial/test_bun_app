import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ type: "varchar", length: 100 })
  first_name: string;

  @Column({ type: "varchar", length: 100 })
  last_name: string;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @Column({ type: "enum", enum: ["user", "admin"], default: "user" })
  role: "user" | "admin";

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}