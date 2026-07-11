export const mockData = {
    // Dados do Perfil do Usuário
    userProfile: {
        name: "User Test",
        unit: "AHSV - Bombeiros",
        avatar: "https://placehold.co/100x100/EFEFEF/333333?text=U"
    },

    // Dados para os Cards de Estatísticas (Dashboard)
    stats: [
        { title: "Ocorrências Pendentes", count: 82, type: "pendente", icon: "triangle-exclamation" },
        { title: "Ocorrências Arquivadas", count: 114, type: "arquivado", icon: "box-archive" },
        { title: "Ocorrências Validadas", count: 0, type: "validado", icon: "check-double" },
        { title: "Rascunhos Registrados", count: 0, type: "rascunho", icon: "file-lines" }
    ],

    // Dados para a Tabela de Ações Prioritárias (Dashboard)
    priorities: [
        { id: 1, occurrence: "Vazamento de gás em residência", unit: "São Domingos do Prata", date: "15/07/2025", status: "Urgente", statusClass: "urgente" },
        { id: 2, occurrence: "Verificação de risco de desabamento", unit: "Centro", date: "14/07/2025", status: "Pendente", statusClass: "pendente" },
        { id: 3, occurrence: "Resgate de animal preso", unit: "Bairro Teste", date: "14/07/2025", status: "Pendente", statusClass: "pendente" },
        { id: 4, occurrence: "Apoio em evento comunitário", unit: "Vila Maria", date: "12/07/2025", status: "Pendente", statusClass: "pendente" }
    ],

    // Dados para a Tabela de Controle de Produtos
    products: [
        { id: 101, name: "ATADURA 10CM", price: "1.08", unit: "Unidade", stock: "25.00", stockMin: "20.00", status: "Ativo" },
        { id: 102, name: "GARRAFA TÉRMICA ALADDIN 5L", price: "37.50", unit: "Unidade", stock: "2.00", stockMin: "5.00", status: "Ativo" }, // Alert Example
        { id: 103, name: "LUVA DE PROCEDIMENTO G", price: "18.98", unit: "Caixa", stock: "3.00", stockMin: "5.00", status: "Ativo" }, // Alert Example
        { id: 104, name: "LUVA DE PROCEDIMENTO PP", price: "18.04", unit: "Caixa", stock: "45.00", stockMin: "20.00", status: "Ativo" }
    ],

    // Dados para o Controle Patrimonial
    assets: [
        { id: 163472, description: "TV 32 POLEGADAS SAMSUNG", value: "2100.00", date: "10/11/2021", status: "Ativo" },
        { id: 724895, description: "APARELHO DE SOM SONY", value: "1500.00", date: "10/11/2021", status: "Ativo" },
        { id: 938471, description: "NOTEBOOK DELL LATITUDE", value: "4500.00", date: "15/01/2022", status: "Em Manutenção" },
        { id: 102938, description: "CADEIRA DE ESCRITÓRIO", value: "450.00", date: "20/03/2022", status: "Baixado" }
    ],

    // Dados para a Tabela de Controle de Ocorrências (Todas)
    allOccurrences: [
        { id: 1254, victim: "Manuel da Silva Gomes", type: "Incêndio", date: "15/07/2025", status: "Pendente", statusClass: "pendente" },
        { id: 1253, victim: "Maciel Gonçalves Menezes", type: "Salvamento", date: "14/07/2025", status: "Pendente", statusClass: "pendente" },
        { id: 1252, victim: "Inez da Conceição Bitencourt", type: "Simplificado", date: "14/07/2025", status: "Concluído", statusClass: "concluido" },
        { id: 1251, victim: "Luiz Felipe Bittencourt de Souza", type: "Salvamento", date: "13/07/2025", status: "Concluído", statusClass: "concluido" },
    ],

    // Dados para a Tabela de Controle de Ocorrências (Histórico)
    history: [
        { id: '0001/60-2018', cpf: '142.453.236-12', user: 'Silvandro', email: 'silvandro_oliveira@hotmail.com', date: '07/01/2019 20:41:23' },
        { id: '0002/60-2019', cpf: '392.574.106-25', user: 'Bráulio Teste', email: 'braulioperigoso@outlook.com', date: '12/01/2019 14:42:54' },
        { id: '0002/60-2019', cpf: '392.574.106-25', user: 'Lessandro Teste', email: 'lelebhz@gmail.com', date: '12/01/2019 14:49:11' },
        { id: '0011/60-2018', cpf: '723.501.816-53', user: 'Bráulio Teste', email: 'braulioperigoso@outlook.com', date: '08/01/2019 11:47:28' },
    ],

    // Dados para a Aba de Sincronização (Controle de Ocorrências)
    syncData: {
        lastSync: "02/08/2025 às 18:30",
        logs: [
            { id: 1, action: "Envio de Ocorrências (3 itens)", status: "Sucesso", time: "02/08/2025 18:30" },
            { id: 2, action: "Atualização de Protocolos", status: "Sucesso", time: "01/08/2025 09:15" },
            { id: 3, action: "Sincronização Completa", status: "Sucesso", time: "30/07/2025 20:00" },
            { id: 4, action: "Envio de Ocorrências (1 item)", status: "Sucesso", time: "28/07/2025 14:22" }
        ]
    },

    // Dados para a Tabela de Doações
    donations: [
        { id: 1, date: "10/12/2021", type: "Dinheiro", donor: "João da Silva", amount: "R$ 150,00" },
        { id: 2, date: "15/12/2021", type: "Material", donor: "Maria Souza", amount: "20 Cx. Luvas" },
        { id: 3, date: "20/12/2021", type: "Serviço", donor: "Mecânica Rápida", amount: "Manutenção VTR" },
        { id: 4, date: "05/01/2022", type: "Dinheiro", donor: "Anônimo", amount: "R$ 500,00" },
    ]
};