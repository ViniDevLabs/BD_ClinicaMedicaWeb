-- Senha de todos os registros abaixo em texto limpo: senha123
INSERT IGNORE INTO Pessoa (id, cpf, nome, email, senha, data_nascimento, eh_administrador) VALUES 
(1, '11111111111', 'Admin Sistema', 'admin@clinica.com', '$argon2id$v=19$m=16384,t=2,p=1$4hwXb6RQmBKCAeqpCEh+uA$dSQq4lbKhuDrLZwxmUMBJLsY6QgnPdLX5CZwsPkMmcY', '1980-01-01', 1),
(2, '22222222222', 'Dr. House', 'house@clinica.com', '$argon2id$v=19$m=16384,t=2,p=1$4hwXb6RQmBKCAeqpCEh+uA$dSQq4lbKhuDrLZwxmUMBJLsY6QgnPdLX5CZwsPkMmcY', '1965-05-15', 0),
(3, '33333333333', 'João Silva', 'joao@email.com', '$argon2id$v=19$m=16384,t=2,p=1$4hwXb6RQmBKCAeqpCEh+uA$dSQq4lbKhuDrLZwxmUMBJLsY6QgnPdLX5CZwsPkMmcY', '1990-10-20', 0),
(4, '44444444444', 'Maria Atendente', 'maria@clinica.com', '$argon2id$v=19$m=16384,t=2,p=1$4hwXb6RQmBKCAeqpCEh+uA$dSQq4lbKhuDrLZwxmUMBJLsY6QgnPdLX5CZwsPkMmcY', '1995-02-10', 0),
(5, '55555555555', 'Usuário Completo', 'completo@clinica.com', '$argon2id$v=19$m=16384,t=2,p=1$4hwXb6RQmBKCAeqpCEh+uA$dSQq4lbKhuDrLZwxmUMBJLsY6QgnPdLX5CZwsPkMmcY', '1992-08-15', 1);
-- As senhas das pessoas acima são "senha123"

INSERT IGNORE INTO Medico (id_pessoa, numero, estado) VALUES (2, 12345, 'SP'), (5, 54321, 'SP');
INSERT IGNORE INTO Medico_Especialidade (id_medico, especialidade) VALUES (2, 'Infectologia'), (5, 'Clínica Geral');

INSERT IGNORE INTO Paciente (id_pessoa, convenio, num_carteirinha) VALUES (3, 'Unimed', '1234567890'), (5, 'Unimed', '9876543210');

INSERT IGNORE INTO Atendente (id_pessoa, matricula) VALUES (4, 'ATND-001'), (5, 'ATND-005');

INSERT IGNORE INTO Agendamento (id_agendamento, id_paciente, id_medico, id_atendente, data_hora, status) 
VALUES (1, 3, 2, 4, '2026-07-10 14:30:00', 'Agendado');