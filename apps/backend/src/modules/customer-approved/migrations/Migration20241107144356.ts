import { Migration } from '@mikro-orm/migrations';

export class Migration20241107144356 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "customer_approved" add column if not exists "created_at" timestamptz not null default now(), add column if not exists "updated_at" timestamptz not null default now(), add column if not exists "deleted_at" timestamptz null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "customer_approved" drop column if exists "created_at";');
    this.addSql('alter table if exists "customer_approved" drop column if exists "updated_at";');
    this.addSql('alter table if exists "customer_approved" drop column if exists "deleted_at";');
  }

}
