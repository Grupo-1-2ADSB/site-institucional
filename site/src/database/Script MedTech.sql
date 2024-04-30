DROP DATABASE IF EXISTS medtech;
CREATE DATABASE medtech;
USE medtech;

-- Usuário config
DROP USER IF EXISTS 'user_medtech'@'localhost';
CREATE USER 'user_medtech'@'localhost' IDENTIFIED WITH mysql_native_password BY 'URUBU100';
GRANT ALL ON medtech.* TO 'user_medtech'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE UnidadeHospitalar (
  idUnidadeHospitalar INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(60),
  estado VARCHAR(45),
  logradouro VARCHAR(150),
  numero INT NOT NULL,
  cidade VARCHAR(45),
  bairro VARCHAR(45),
  cep CHAR(8),
  cnpj CHAR(14)
);

CREATE TABLE Cargo (
  idCargo INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(60),
  descricao VARCHAR(100),
  areaAtuacao VARCHAR(100)
);

CREATE TABLE Usuario (
  idUsuario INT PRIMARY KEY AUTO_INCREMENT,
  nomeCompleto VARCHAR(45),
  nomeUser VARCHAR(45),
  email VARCHAR(80),
  senha VARCHAR(16),
  fkUnidadeHospitalar INT,
  FOREIGN KEY (fkUnidadeHospitalar) REFERENCES UnidadeHospitalar(idUnidadeHospitalar),
  fkCargo INT,
  FOREIGN KEY (fkCargo) REFERENCES Cargo(idCargo)
);

CREATE TABLE SistemaOperacional (
  idSO INT PRIMARY KEY AUTO_INCREMENT,
  nomeSO VARCHAR(35),
  versaoSO VARCHAR(15),
  arquiteturaSO VARCHAR(10)
);

CREATE TABLE Computador (
  idComputador INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(45),
  localizacao VARCHAR(45),
  statusPC VARCHAR(15) CHECK (statusPC IN ('manutenção', 'ativado', 'desativado')),
  fkUnidadeHospitalar INT,
  fkSO INT, 
  FOREIGN KEY (fkUnidadeHospitalar) REFERENCES UnidadeHospitalar(idUnidadeHospitalar),
  FOREIGN KEY (fkSO) REFERENCES SistemaOperacional(idSO)
);

CREATE TABLE Hardware (
  idHardware INT PRIMARY KEY AUTO_INCREMENT,
  nomeHardware VARCHAR(45),
  descricaoValor VARCHAR(45),
  valor DECIMAL(8,2),
  descricaoHardware VARCHAR(45),
  fkComputador INT,
  FOREIGN KEY (fkComputador) REFERENCES Computador(idComputador)
);

CREATE TABLE Registro (
  idRegistro INT PRIMARY KEY AUTO_INCREMENT,
  fkComputador INT,
  FOREIGN KEY (fkComputador) REFERENCES Computador(idComputador)
);

CREATE TABLE Evento (
  idEvento INT PRIMARY KEY AUTO_INCREMENT,
  gravidade VARCHAR(15),
  descricao VARCHAR(100),
  fkRegistro INT,
  FOREIGN KEY (fkRegistro) REFERENCES Registro(idRegistro)
);

INSERT INTO UnidadeHospitalar (nome, estado, logradouro, numero, cidade, bairro, cep, cnpj)
VALUES 
  ('Hospital Municipal', 'São Paulo', 'Rua da Saúde', 123, 'São Paulo', 'Centro', '01001000', '12345678901234'),
  ('Hospital Santa Maria', 'Rio de Janeiro', 'Avenida das Flores', 456, 'Rio de Janeiro', 'Copacabana', '22041100', '98765432109876'),
  ('Hospital São Lucas', 'Minas Gerais', 'Rua dos Médicos', 789, 'Belo Horizonte', 'Savassi', '30130180', '45678901234567');

-- Inserindo dados na tabela Cargo
INSERT INTO Cargo (idCargo, nome, descricao, areaAtuacao)
VALUES 
  (1, 'Engenheiro de infraestrutura', 'Responsável pelo planejamento, implementação e manutenção de sistemas, redes e servidores', 'infraestrutura de TI'),
  (2, 'Gerente de infraestrutura', 'Gestão de equipes', 'infraestrutura de TI'),
  (3, 'Técnico de infraestrutura', 'Análise crítica e atuação assertiva na resolução de problemas', 'infraestrutura de TI');
  
-- Inserindo usuários (Proto personas)
INSERT INTO Usuario (idUsuario, nomeCompleto, nomeUser, email, senha, fkUnidadeHospitalar, fkCargo)
VALUES (NULL, 'Pedro Henrique', 'PH', 'pedroHenrique@upaZonaSulSantos.com', 'Senha123!', 2, 1),
	   (NULL, 'Ana Luiza', 'Ana_luiza', 'anaLuiza@upaZonaSulSantos.com', 'Senha123!', 2, 2),
       (NULL, 'John', 'devJohn', 'John@upaZonaSulSantos.com', 'Senha123!', 2, 3);


SELECT * FROM hardware JOIN computador ON fkComputador = idComputador;