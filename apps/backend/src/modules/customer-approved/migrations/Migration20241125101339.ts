import { Migration } from '@mikro-orm/migrations';

export class Migration20241125101339 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "customer_approved" add column if not exists "id" text not null;');
    this.addSql('alter table if exists "customer_approved" drop constraint if exists "customer_approved_pkey";');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_customer_approved_email_unique" ON "customer_approved" (email) WHERE deleted_at IS NULL;');
    this.addSql('alter table if exists "customer_approved" add constraint "customer_approved_pkey" primary key ("id");');
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_customer_approved_email_unique";');
    this.addSql('alter table if exists "customer_approved" drop constraint if exists "customer_approved_pkey";');
    this.addSql('alter table if exists "customer_approved" drop column if exists "id";');
    this.addSql('alter table if exists "customer_approved" add constraint "customer_approved_pkey" primary key ("email");');
  }

}
