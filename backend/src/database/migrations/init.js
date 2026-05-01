'use strict';

const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class initMigration1620000000000 {
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);

        await queryRunner.query(`
            CREATE TABLE departments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);

        await queryRunner.query(`
            CREATE TABLE employees (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                department_id INT,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                date_of_birth DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (department_id) REFERENCES departments(id)
            );
        `);

        await queryRunner.query(`
            CREATE TABLE attendance (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id INT,
                date DATE NOT NULL,
                status ENUM('present', 'absent', 'leave') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (employee_id) REFERENCES employees(id)
            );
        `);

        await queryRunner.query(`
            CREATE TABLE leave_types (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);

        await queryRunner.query(`
            CREATE TABLE leave_requests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id INT,
                leave_type_id INT,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                status ENUM('pending', 'approved', 'rejected') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (employee_id) REFERENCES employees(id),
                FOREIGN KEY (leave_type_id) REFERENCES leave_types(id)
            );
        `);

        await queryRunner.query(`
            CREATE TABLE payroll (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id INT,
                salary DECIMAL(10, 2) NOT NULL,
                pay_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (employee_id) REFERENCES employees(id)
            );
        `);

        await queryRunner.query(`
            CREATE TABLE contracts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id INT,
                contract_start_date DATE NOT NULL,
                contract_end_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (employee_id) REFERENCES employees(id)
            );
        `);
    }

    async down(queryRunner) {
        await queryRunner.query("DROP TABLE IF EXISTS contracts;");
        await queryRunner.query("DROP TABLE IF EXISTS payroll;");
        await queryRunner.query("DROP TABLE IF EXISTS leave_requests;");
        await queryRunner.query("DROP TABLE IF EXISTS leave_types;");
        await queryRunner.query("DROP TABLE IF EXISTS attendance;");
        await queryRunner.query("DROP TABLE IF EXISTS employees;");
        await queryRunner.query("DROP TABLE IF EXISTS departments;");
        await queryRunner.query("DROP TABLE IF EXISTS users;");
    }
};
