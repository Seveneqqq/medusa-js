import { Migration } from '@mikro-orm/migrations';

export class Migration20241107111827 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "customer_approved" ("user_id" text not null, "approved" boolean not null default false, constraint "customer_approved_pkey" primary key ("user_id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "customer_approved" cascade;');
  }

}
