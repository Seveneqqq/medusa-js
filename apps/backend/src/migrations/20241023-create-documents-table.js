const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class CreateDocumentsTable20241023 {
  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE documents (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products(id),
        file_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
      DROP TABLE documents
    `);
  }
};
