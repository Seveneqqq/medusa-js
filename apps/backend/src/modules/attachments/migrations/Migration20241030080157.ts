import { Migration } from '@mikro-orm/migrations';

export class Migration20241030080157 extends Migration {
  async up(): Promise<void> {
    // Tworzenie tabeli 'file'
    this.addSql(
      `CREATE TABLE IF NOT EXISTS public.file
      (
          file_id SERIAL PRIMARY KEY,
          file_name text NOT NULL,
          language character varying(10) NOT NULL,
          document_type character varying(50) NOT NULL,
          created_at timestamp with time zone DEFAULT now()
      );`
    );

    // Tworzenie tabeli pośredniej 'product_file' dla relacji wiele-do-wielu
    this.addSql(
      `CREATE TABLE IF NOT EXISTS public.product_file
      (
          product_id text NOT NULL,
          file_id INT NOT NULL,
          PRIMARY KEY (product_id, file_id),
          CONSTRAINT product_file_product_id_foreign FOREIGN KEY (product_id)
              REFERENCES public.product (id)
              ON DELETE CASCADE,
          CONSTRAINT product_file_file_id_foreign FOREIGN KEY (file_id)
              REFERENCES public.file (file_id)
              ON DELETE CASCADE
      );`
    );
  }

  async down(): Promise<void> {
    // Usunięcie tabeli pośredniej 'product_file'
    this.addSql('DROP TABLE IF EXISTS "product_file" CASCADE;');

    // Usunięcie tabeli 'file'
    this.addSql('DROP TABLE IF EXISTS "file" CASCADE;');
  }
}