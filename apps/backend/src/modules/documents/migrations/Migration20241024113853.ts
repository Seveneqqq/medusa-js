import { Migration } from '@mikro-orm/migrations';

export class Migration20241024113853 extends Migration {

  async up(): Promise<void> {
    // Tworzenie tabeli 'document'
    this.addSql(
      `CREATE TABLE IF NOT EXISTS public.document
      (
          id SERIAL PRIMARY KEY,  -- Use SERIAL for auto-incrementing integer column
          file_name text NOT NULL,
          language character varying(10) NOT NULL,
          document_type character varying(50) NOT NULL,
          product_id text NOT NULL,
          created_at timestamp with time zone DEFAULT now(),
          updated_at timestamp with time zone DEFAULT now(),
          deleted_at timestamp with time zone,
          CONSTRAINT document_product_id_foreign FOREIGN KEY (product_id)
              REFERENCES public.product (id)
              ON UPDATE CASCADE
              ON DELETE CASCADE
      );`
    );

    // Dodanie indeksu do "product_id" (opcjonalnie)
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_document_product_id" ON "document" ("product_id") WHERE deleted_at IS NULL;'
    );
  }

  async down(): Promise<void> {
    // Usunięcie ograniczeń i tabeli 'document'
    this.addSql(
      'ALTER TABLE IF EXISTS "document" DROP CONSTRAINT IF EXISTS "document_product_id_foreign";'
    );
    this.addSql('DROP TABLE IF EXISTS "document" CASCADE;');
  }
}