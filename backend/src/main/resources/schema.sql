CREATE TABLE IF NOT EXISTS Pessoa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cpf CHAR(11) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_nascimento DATE,
    eh_administrador TINYINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Paciente (
    id_pessoa INT PRIMARY KEY,
    convenio VARCHAR(100),
    num_carteirinha VARCHAR(50),
    FOREIGN KEY (id_pessoa) REFERENCES Pessoa(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Atendente (
    id_pessoa INT PRIMARY KEY,
    matricula VARCHAR(50) NOT NULL UNIQUE,
    FOREIGN KEY (id_pessoa) REFERENCES Pessoa(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Medico (
    id_pessoa INT PRIMARY KEY,
    numero INT NOT NULL UNIQUE, 
    estado CHAR(2) NOT NULL,
    FOREIGN KEY (id_pessoa) REFERENCES Pessoa(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Medico_Especialidade (
    id_medico INT,
    especialidade VARCHAR(45),
    PRIMARY KEY (id_medico, especialidade),
    FOREIGN KEY (id_medico) REFERENCES Medico(id_pessoa) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Disponibilidade_Padrao (
    id_disponibilidade INT AUTO_INCREMENT PRIMARY KEY,
    id_medico INT NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    horario_inicio TIME NOT NULL,
    horario_fim TIME NOT NULL,
    dia_semana ENUM('DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO') NOT NULL,
    duracao_consulta INT NOT NULL,
    FOREIGN KEY (id_medico) REFERENCES Medico(id_pessoa) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Excecao_Agenda (
    id_excecao INT AUTO_INCREMENT PRIMARY KEY,
    id_medico INT NOT NULL,
    data_excecao DATE NOT NULL,
    tipo_excecao ENUM('Bloqueio', 'Adição') NOT NULL,
    horario_inicio TIME,
    horario_fim TIME,
    FOREIGN KEY (id_medico) REFERENCES Medico(id_pessoa) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Agendamento (
    id_agendamento INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_atendente INT,
    id_medico INT NOT NULL,
    id_agendamento_pai INT,
    data_hora DATETIME NOT NULL,
    status ENUM('Agendado', 'Cancelado', 'Confirmado', 'Realizado') NOT NULL DEFAULT 'Agendado',
    FOREIGN KEY (id_paciente) REFERENCES Paciente(id_pessoa),
    FOREIGN KEY (id_atendente) REFERENCES Atendente(id_pessoa),
    FOREIGN KEY (id_medico) REFERENCES Medico(id_pessoa),
    FOREIGN KEY (id_agendamento_pai) REFERENCES Agendamento(id_agendamento)
);

CREATE TABLE IF NOT EXISTS Prontuario_Clinico (
    id_prontuario INT AUTO_INCREMENT PRIMARY KEY,
    id_agendamento INT NOT NULL UNIQUE,
    diagnostico VARCHAR(255),
    prescricao VARCHAR(255),
    registro_observacoes VARCHAR(255),
    FOREIGN KEY (id_agendamento) REFERENCES Agendamento(id_agendamento)
);

CREATE TABLE IF NOT EXISTS Exame (
    id_exame INT AUTO_INCREMENT PRIMARY KEY,
    id_agendamento INT NOT NULL,
    nome_exame VARCHAR(255) NOT NULL,
    data_solicitacao DATE NOT NULL,
    local_realizacao ENUM('Interno', 'Externo') NOT NULL,
    observacoes_medicas VARCHAR(255),
    arquivo_laudo_path VARCHAR(255),
    status ENUM('Solicitado', 'Cancelado', 'Laudo Anexado', 'Concluído') NOT NULL DEFAULT 'Solicitado',
    FOREIGN KEY (id_agendamento) REFERENCES Agendamento(id_agendamento)
);