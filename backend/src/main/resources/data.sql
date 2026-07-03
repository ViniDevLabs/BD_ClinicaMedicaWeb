INSERT IGNORE INTO Pessoa (id, cpf, nome, email, senha, data_nascimento, eh_administrador) VALUES 
(1, '11111111111', 'Admin Sistema', 'admin@clinica.com', 'hash_senha_123', '1980-01-01', 1),
(2, '22222222222', 'Dr. House', 'house@clinica.com', 'hash_senha_123', '1965-05-15', 0),
(3, '33333333333', 'João Silva', 'joao@email.com', 'hash_senha_123', '1990-10-20', 0),
(4, '44444444444', 'Maria Atendente', 'maria@clinica.com', 'hash_senha_123', '1995-02-10', 0);

INSERT IGNORE INTO Medico (id_pessoa, numero, estado) VALUES (2, 12345, 'SP');
INSERT IGNORE INTO Medico_Especialidade (id_medico, especialidade) VALUES (2, 'Infectologia');

INSERT IGNORE INTO Paciente (id_pessoa, convenio, num_carteirinha) VALUES (3, 'Unimed', '1234567890');

INSERT IGNORE INTO Atendente (id_pessoa, matricula) VALUES (4, 'ATND-001');

INSERT IGNORE INTO Agendamento (id_agendamento, id_paciente, id_medico, id_atendente, data_hora, status) 
VALUES (1, 3, 2, 4, '2026-07-10 14:30:00', 'Agendado');