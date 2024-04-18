DROP DATABASE medtech;
CREATE DATABASE medtech;
USE medtech;

-- Usuario
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
  statusPC TINYINT,
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
  descricaoHardware VARCHAR(45)
);

CREATE TABLE Componente (
  idComponente INT PRIMARY KEY AUTO_INCREMENT,
  valor DECIMAL(8,2),
  dataHora DATETIME,
  fkComputador INT,
  fkComponente INT,
  unidadeMedida VARCHAR(45),
  FOREIGN KEY (fkComputador) REFERENCES Computador(idComputador),
  FOREIGN KEY (fkComponente) REFERENCES Componente(idComponente)
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