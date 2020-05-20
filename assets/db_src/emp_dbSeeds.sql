-- Department Table Seed
INSERT INTO department (name) VALUES ("Sales"), ("Finance"), ("IT"), ("Marketing");

-- Role Table Seed
INSERT INTO role (title, salary, department_id) VALUES ("Sales Associate", 32000.00, 1), ("Accountant", 45000.00, 2), ("Software Engineer", 98000.00, 3), ("Designer", 85000.00, 4);

-- Employee Table Seed
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Joe", "Dirt", 2, null), ("Ricky", "Bobby", 3, 1), ("Tiny", "Tim", 1, 2), ("Jane", "Tarzan", 4, 1);
