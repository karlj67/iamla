CREATE DATABASE IF NOT EXISTS iamla_base;
USE iamla_base;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'supervisor', 'medical_visitor')) NOT NULL,
    team_id INT,
    profile_photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE teams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    laboratory_name VARCHAR(100) NOT NULL,
    supervisor_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supervisor_id) REFERENCES users(id)
);

CREATE TABLE prescriber_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prescribers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (type_id) REFERENCES prescriber_types(id)
);

CREATE TABLE visits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    visitor_id INT NOT NULL,
    prescriber_id INT NOT NULL,
    planned_date DATETIME NOT NULL,
    execution_date DATETIME,
    status ENUM('planned', 'executed', 'cancelled') DEFAULT 'planned',
    outcome ENUM('positive', 'neutral', 'negative'),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visitor_id) REFERENCES users(id),
    FOREIGN KEY (prescriber_id) REFERENCES prescribers(id)
);

-- Table pour les objectifs mensuels
CREATE TABLE monthly_objectives (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    month DATE NOT NULL,  -- Stocké comme YYYY-MM-01
    visit_objective INT NOT NULL,
    financial_objective DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table pour les valeurs financières des visites
CREATE TABLE visit_values (
    id INT PRIMARY KEY AUTO_INCREMENT,
    visit_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    products JSON,  -- Pour stocker les détails des produits présentés
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visit_id) REFERENCES visits(id)
);

-- Table pour le suivi des positions
CREATE TABLE location_tracking (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Ajouter l'administrateur (le mot de passe est déjà hashé avec bcrypt)
INSERT INTO users (
    email,
    password,
    first_name,
    last_name,
    role,
    created_at
) VALUES (
    'karlj67@gmail.com',
    '$2b$10$YourHashedPasswordHere',  -- Nous devons générer le hash de @Karljess2023
    'Bobby',
    'Bob',
    'admin',
    CURRENT_TIMESTAMP
);

UPDATE users 
SET password = '[$2a$10$0efdLFjDFdOgHE0Vopga1.kWqScRoNAjUDHqBxhnLrkmJ6Yw/ztCe]'
WHERE email = 'karlj67@gmail.com';

-- Ajouter les visiteurs médicaux pour l'équipe UPM
INSERT INTO users (
    email,
    password,
    first_name,
    last_name,
    role,
    team_id
) VALUES 
('ruth.kablan@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Ruth', 'Kablan', 'medical_visitor', 5),
('bamba.mme@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Mme', 'Bamba', 'medical_visitor', 5),
('solange.bieto@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Solange', 'Bieto', 'medical_visitor', 5),
('cedrick.tra@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Cedrick', 'Tra Bi', 'medical_visitor', 5),
('ella.boka@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Ella', 'Boka', 'medical_visitor', 5),
('georges.lathro@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Georges', 'Lathro', 'medical_visitor', 5),
('chimène.tano@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Chimène', 'Tano', 'medical_visitor', 5),
('euphrem.bidi@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Euphrem', 'Bidi', 'medical_visitor', 5),
('marthe.koffi@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Aya Marthe', 'Koffi', 'medical_visitor', 5);

-- Vérifier la structure actuelle
DESCRIBE visits;

-- Ajouter uniquement les colonnes manquantes
ALTER TABLE visits 
ADD COLUMN outcome ENUM('positive', 'neutral', 'negative') AFTER execution_date,
ADD COLUMN latitude DECIMAL(10, 8) AFTER outcome,
ADD COLUMN longitude DECIMAL(11, 8) AFTER latitude;

-- Tentative d'ajout des index (ignorera les erreurs si les index existent déjà)
ALTER TABLE monthly_objectives 
ADD INDEX idx_user_month (user_id, month);

ALTER TABLE location_tracking 
ADD INDEX idx_user_timestamp (user_id, timestamp);

-- Insertion sécurisée des objectifs mensuels
INSERT IGNORE INTO monthly_objectives 
(user_id, month, visit_objective, financial_objective) 
VALUES 
(3, '2024-02-01', 50, 1000000.00),  -- Pour Ruth Kablan
(4, '2024-02-01', 45, 900000.00),   -- Pour Mme Bamba
(5, '2024-02-01', 48, 950000.00);   -- Pour Solange Bieto

-- Mettre à jour le contrôleur visitController pour utiliser user_id au lieu de team_id

-- 1. Table d'historisation et Triggers
CREATE TABLE IF NOT EXISTS visits_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visit_id INT NOT NULL,
    visitor_id INT NOT NULL,
    prescriber_id INT NOT NULL,
    status VARCHAR(20),
    action VARCHAR(10),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by INT
);

CREATE TRIGGER tr_visits_after_update
AFTER UPDATE ON visits
FOR EACH ROW
BEGIN
    INSERT INTO visits_history (
        visit_id, visitor_id, prescriber_id, 
        status, action, changed_by
    )
    VALUES (
        NEW.id, NEW.visitor_id, NEW.prescriber_id,
        NEW.status, 'UPDATE', @user_id
    );
END;

CREATE TRIGGER tr_visits_after_insert
AFTER INSERT ON visits
FOR EACH ROW
BEGIN
    INSERT INTO visits_history (
        visit_id, visitor_id, prescriber_id, 
        status, action, changed_by
    )
    VALUES (
        NEW.id, NEW.visitor_id, NEW.prescriber_id,
        NEW.status, 'INSERT', @user_id
    );
END;

-- 3. Vues pour le reporting
CREATE OR REPLACE VIEW vw_visitor_performance AS
SELECT 
    u.id as visitor_id,
    u.first_name,
    u.last_name,
    t.name as team_name,
    DATE_FORMAT(v.planned_date, '%Y-%m') as month,
    COUNT(CASE WHEN v.status = 'executed' THEN 1 END) as completed_visits,
    COUNT(CASE WHEN v.status = 'cancelled' THEN 1 END) as cancelled_visits,
    mo.visit_objective,
    COALESCE(SUM(vv.amount), 0) as total_value,
    mo.financial_objective,
    ROUND((COUNT(CASE WHEN v.status = 'executed' THEN 1 END) / mo.visit_objective) * 100, 2) as completion_rate
FROM users u
LEFT JOIN teams t ON u.team_id = t.id
LEFT JOIN visits v ON u.id = v.visitor_id
LEFT JOIN monthly_objectives mo ON 
    u.id = mo.user_id AND 
    DATE_FORMAT(v.planned_date, '%Y-%m-01') = mo.month
LEFT JOIN visit_values vv ON v.id = vv.visit_id
WHERE u.role = 'medical_visitor'
GROUP BY 
    u.id, 
    u.first_name, 
    u.last_name,
    t.name,
    DATE_FORMAT(v.planned_date, '%Y-%m'),
    mo.visit_objective,
    mo.financial_objective;

CREATE OR REPLACE VIEW vw_team_performance AS
SELECT 
    t.id as team_id,
    t.name as team_name,
    t.laboratory_name,
    DATE_FORMAT(v.planned_date, '%Y-%m') as month,
    COUNT(DISTINCT u.id) as total_visitors,
    COUNT(CASE WHEN v.status = 'executed' THEN 1 END) as completed_visits,
    COALESCE(SUM(vv.amount), 0) as total_value
FROM teams t
JOIN users u ON t.id = u.team_id
LEFT JOIN visits v ON u.id = v.visitor_id
LEFT JOIN visit_values vv ON v.id = vv.visit_id
WHERE u.role = 'medical_visitor'
GROUP BY 
    t.id,
    t.name,
    t.laboratory_name,
    DATE_FORMAT(v.planned_date, '%Y-%m');

