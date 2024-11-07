import { Migration } from '@mikro-orm/migrations';

export class Migration20241107102147 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "customer_approved" ("id" text not null, "email" text not null, "approved" boolean not null default false, constraint "customer_approved_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "customer_approved" cascade;');
  }

}
