import { Migration } from '@mikro-orm/migrations';

export class Migration20241113130527 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "attachment" add column if not exists "id" serial;');
    this.addSql('alter table if exists "attachment" alter column "file_id" type integer using ("file_id"::integer);');
    this.addSql('alter table if exists "attachment" drop constraint if exists "attachment_pkey";');
    this.addSql('alter table if exists "attachment" alter column "file_id" drop default;');
    this.addSql('alter table if exists "attachment" add constraint "attachment_pkey" primary key ("id");');

    this.addSql('alter table if exists "product_attachment" add column if not exists "id" serial;');
    this.addSql('alter table if exists "product_attachment" drop constraint if exists "product_attachment_pkey";');
    this.addSql('alter table if exists "product_attachment" add constraint "product_attachment_pkey" primary key ("id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "attachment" alter column "file_id" type integer using ("file_id"::integer);');
    this.addSql('alter table if exists "attachment" drop constraint if exists "attachment_pkey";');
    this.addSql('alter table if exists "attachment" drop column if exists "id";');
    this.addSql('create sequence if not exists "attachment_file_id_seq";');
    this.addSql('select setval(\'attachment_file_id_seq\', (select max("file_id") from "attachment"));');
    this.addSql('alter table if exists "attachment" alter column "file_id" set default nextval(\'attachment_file_id_seq\');');
    this.addSql('alter table if exists "attachment" add constraint "attachment_pkey" primary key ("file_id");');

    this.addSql('alter table if exists "product_attachment" drop constraint if exists "product_attachment_pkey";');
    this.addSql('alter table if exists "product_attachment" drop column if exists "id";');
    this.addSql('alter table if exists "product_attachment" add constraint "product_attachment_pkey" primary key ("product_id");');
  }

}
