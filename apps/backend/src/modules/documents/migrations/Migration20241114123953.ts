import { Migration } from '@mikro-orm/migrations';

export class Migration20241114123953 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "attachment" alter column "id" type text using ("id"::text);');
    this.addSql('alter table if exists "attachment" alter column "file_id" type text using ("file_id"::text);');
    this.addSql('alter table if exists "attachment" alter column "file_id" drop not null;');
    this.addSql('alter table if exists "attachment" alter column "id" drop default;');

    this.addSql('alter table if exists "product_attachment" alter column "id" type text using ("id"::text);');
    this.addSql('alter table if exists "product_attachment" alter column "file_id" type text using ("file_id"::text);');
    this.addSql('alter table if exists "product_attachment" alter column "id" drop default;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "attachment" alter column "id" type integer using ("id"::integer);');
    this.addSql('alter table if exists "attachment" alter column "file_id" type integer using ("file_id"::integer);');
    this.addSql('alter table if exists "attachment" alter column "file_id" set not null;');
    this.addSql('create sequence if not exists "attachment_id_seq";');
    this.addSql('select setval(\'attachment_id_seq\', (select max("id") from "attachment"));');
    this.addSql('alter table if exists "attachment" alter column "id" set default nextval(\'attachment_id_seq\');');

    this.addSql('alter table if exists "product_attachment" alter column "id" type integer using ("id"::integer);');
    this.addSql('alter table if exists "product_attachment" alter column "file_id" type integer using ("file_id"::integer);');
    this.addSql('create sequence if not exists "product_attachment_id_seq";');
    this.addSql('select setval(\'product_attachment_id_seq\', (select max("id") from "product_attachment"));');
    this.addSql('alter table if exists "product_attachment" alter column "id" set default nextval(\'product_attachment_id_seq\');');
  }

}
