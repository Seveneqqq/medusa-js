import { Migration } from '@mikro-orm/migrations';

export class Migration20241113121055 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "attachment" ("file_id" serial primary key, "file_name" text not null, "language" text not null, "document_type" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null);');

    this.addSql('create table if not exists "document" ("id" text not null, "name" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "document_pkey" primary key ("id"));');

    this.addSql('create table if not exists "product_attachment" ("product_id" text not null, "file_id" integer not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_attachment_pkey" primary key ("product_id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "attachment" cascade;');

    this.addSql('drop table if exists "document" cascade;');

    this.addSql('drop table if exists "product_attachment" cascade;');
  }

}
