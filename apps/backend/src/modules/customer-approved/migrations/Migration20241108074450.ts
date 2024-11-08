import { Migration } from '@mikro-orm/migrations';

export class Migration20241108074450 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "customer_approved" drop constraint if exists "customer_approved_pkey";');
    this.addSql('alter table if exists "customer_approved" rename column "user_id" to "email";');
    this.addSql('alter table if exists "customer_approved" add constraint "customer_approved_pkey" primary key ("email");');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "customer_approved" drop constraint if exists "customer_approved_pkey";');
    this.addSql('alter table if exists "customer_approved" rename column "email" to "user_id";');
    this.addSql('alter table if exists "customer_approved" add constraint "customer_approved_pkey" primary key ("user_id");');
  }

}
