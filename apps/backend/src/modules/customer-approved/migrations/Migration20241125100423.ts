import { Migration } from '@mikro-orm/migrations';

export class Migration20241125100423 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "customer_approved" ("email" text not null, "approved" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_approved_pkey" primary key ("email"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "customer_approved" cascade;');
  }

}
