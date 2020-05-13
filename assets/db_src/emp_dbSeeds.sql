-- Department Seed
INSERT INTO department (name) VALUES ("Sales"), ("Finance"), ("IT"), ("Marketing");

-- Role Seed
INSERT INTO role (title, salary, department_id) VALUES ("Sales Associate", 32000.00, 1), ("Accountant", 45000.00, 2), ("Software Engineer", 98000.00, 3), ("Designer", 85000.00, 4);

-- Employee Seed
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Joe", "Dirt", 5, null), ("Ricky", "Bobby", 8, null), ("Tiny", "Tim", 6, null), ("Jane", "Tarzan", 7, null);