export const texts = {

  topNav: {
    title: 'Gerenciador de aulas Mobilis',

    menuDir: {
      listCompanies: 'Empresas',
      buttons: {
        adminArea: 'Área Administrativa'
      }
    },
  },

  menu: {
    dashboard: 'Dashboard',
    moduleA: {
      moduleA: 'ModuleAo',
      simulationLesson: 'Agendar Aulas',
      enrollment: 'Matricular aluno',
    },
    moduleR: {
      moduleR: 'Cadastros',
      student: 'Alunos',
      sharedUnit: 'Centros compartilhados',
      drivingSchool: 'CFCs',
      simulatorHistory: 'Historico de simuladores',
      instructor: 'Instrutores',
      simulators: 'Simuladores',
    },
    moduleCf: {
      moduleCf: 'Configuração',
      simulationActivity: 'Atividades possiveis em simulação',
      simulationModule: 'Aulas de simulação',
      simulationEvent: 'Eventos possiveis em simulação',
      simulationExercise: 'Exercicios de simulação',
      holiday: 'Feriados',
      infraction: 'Infrações de trânsito',
      vehicleModel: 'Modelos de veículos',
      userType: 'Perfis de usuário',
      vehicleType: 'Tipos de veículos',
      user: 'Usuários',
      softwareVersion: 'Versões de software de simulação',
      department: 'Departamento de trânsito',
      smtpServer: 'Servidor SMTP',
      system: 'Sistema',
    },
    moduleCs: {
      moduleCs: 'ModuleCsas',
      scheduleLesson: 'Agendamento de aulas',
      cfcCash: 'Caixa por CFC',
      requisition: 'Requisições',
    },
    moduleF: {
      moduleF: 'Financeiro',
      contract: 'Cadastrar contatos',
      creditEntry: 'Entrada de crédito',
      bonusEntry: 'Entrada de Bônus',
      manageCredits: 'Gerenciamento de créditos',
      manageBonus: 'Gerenciamento de Bônus',
    },
    login: {
      login: 'Login',
      newPass: 'Redefinir senha',
      view: 'Visão',
    },
  },

  login: {

    login: {
      buttons: {
        login: 'Acessar',
        forgotPass: 'Esqueci minha senha',
        rememberMe: 'Lembrar-me',
      },
      messages: {
        error: 'Ocorreu um erro no sistema',
        errorPass: 'Senha incorreta.',
        notRegistered: 'CPF não registrado.',
        noCompanyUser: 'Nenhuma empresa relaciona a esse usuário.',
        emailPass: 'Uma mensagem foi enviada para o e-mail cadastrado para esse cpf.'
      },
      fields: {
        cpf: {
          label: 'CPF',
          errors: {
            required: 'Digite o CPF.',
            cpf: 'Digite um CPF válido.',
          }
        },
        password: {
          label: 'Senha',
          errors: {
            required: 'Digite a senha.',
            maxlength: 'A senha não pode ter mais que 100 caracteres.',
          }
        },
      },
      modal: {
        title: 'Redefinir senha',
        subTitle: 'Esqueceu a sua senha?',
        messages: 'Digite seu CPF e enviaremos instruções para o e-mail cadastrado.',
        buttons: {
          ok: 'Enviar e-mail',
          cancel: 'Cancelar',
          close: 'Fechar'
        }
      }
    },

    newPass: {
      title: 'Por favor defina sua nova senha.',
      buttons: {
        save: 'Salvar',
      },
      messages: {
        error: 'Ocorreu um erro no sistema',
        passSaved: 'Nova senha registrada.',
      },
      fields: {
        password: {
          label: 'Nova senha',
          errors: {
            required: 'Digite a senha.',
            maxlength: 'A senha não pode ter mais que 100 caracteres.',
          }
        },
        rePass: {
          label: 'Confirme sua senha',
          errors: {
            equalTo: 'A senha deve ser igual nos dois campos.',
          }
        },
      },
    },

    view: {
      title: 'Selecione a visão desejada:',
      buttons: 'Área Administrativa'
    },

  },

  moduleA: {

    enrollment: {
      title: 'Matrícula',
      buttons: {
        save: 'Efetuar matrícula',
        cancel: 'Cancelar'
      },
      messages: {
        saved: 'Salvou dados',
        error: 'Ocorreu um erro no sistema: ',
        noEnrollment: 'Não existe contrato ativo para o CFC!'
      },
      fields: {
        student: {
          label: 'Aluno',
          errors: {
            required: 'Um aluno deve ser selecionado.',
          }
        },
        lessonsCategory: {
          label: 'Categoria das aulas',
          options: [
            {id: 2, value:'Em simulador'}
          ],
          errors: {
            required: 'A categoria das aulas deve ser selecionada.',
          }
        },
        lessonsType: {
          label: 'Tipo das aulas',
          options: [
            {id:0 , value:'Aulas Detran'},
            {id:1 , value:'Aulas Avulsas'},
            {id:2 , value:'Aulas Livres'}
          ],
          errors: {
            required: 'O tipo das aulas deve ser selecionado.',
          }
        },
        numLessonsLoaded: {
          label: {
            numberLessons: 'Quantidade de aulas',
            workload: 'Quantidade de aulas'
          },
          errors: {
            required: 'Esse campo não pode ficar vazio.',
            maxlength: 'Esse campo não pode ter mais que 6 caracteres.',
            maxlength2: 'Esse campo não pode ter mais que 2 caracteres.',
            min: 'Esse campo deve ser maior que 0.'
          }
        },
        paymentType: {
          label: 'Forma de pagamento',
          options: [
            {id:0 , value:'Debitar do Caixa (disponível {value})'},
            {id:1 , value:'Debitar Bônus (disponível {bonus} H/A)'}
          ],
          errors: {
            required: 'A forma de pagamento deve ser selecionada.',
          }
        },
        departmentProcessNumber: {
          label: 'Nº processo',
          errors: {
            required: 'O número do processo não pode ficar vazio.',
            maxlength: 'O número do processo não pode ter mais que 50 caracteres.',
          }
        },
        paymentValue: {
          label: 'Valor total da matrícula',
        },
        enrollmentValue: {
          label: '{result} (Valor H/A: {value})'
        }
        // totalValueOfContract: {
        //   label: 'Valor total do contrato (Aluno)'
        // },
      },
      modal: {
        title: 'Confirmação de matrícula',
        messages: 'Aluno matrículado com sucesso! Gerado número de matrícula {number}.',
        buttons: {
          ok: 'OK',
          cancel: null,
          close: 'Fechar'
        }
      }
    },

    simulationLesson: {
      title: {
        list: 'Agendar aulas',
        view: 'ModuleCsar Agendamento de Aula'
      },
      h3: 'Agenda',
      pAvaliableLessons: 'Aulas Disponíveis: (Arraste a aula para a agenda)',
      buttons: {
        save: 'Confirmar',
        cancel: 'Cancelar',
        close: 'Fechar',
        cancelSchedule: 'Cancelar Agendamento'
      },
      messages: {
        saved: 'Salvou dados',
        error: 'Ocorreu um erro no sistema: ',
        deleted: 'Aula Cancelada',
        scheduleAlert: {
          olderDate: 'Não é possível agenda a aula para uma data/hora que já passou.',
          overlappingLesson: 'Não é possível uma aula sobre outra.',
          simultaneousLessonsPerStudent: 'Não é possível agendar aulas para um aluno em simuladores diferentes ao mesmo tempo.',
          maxSimultaneousLessonsPerInstructor: 'O máximo de aulas simultâneas permitidas para o instrutor é de {n} aulas.',
          maxNumFreeLessonsPerDay: 'O máximo de aulas livres permitidas por dia é de {n} aulas.',
          maxNumLessonsPerDayPerStudent: 'O máximo de aulas por dia para um mesmo aluno é de {n} aulas.',
          maxNumLessonsInSequencePerStudent: 'O máximo de aulas em sequência para um mesmo aluno é de {n} aulas.',
          minIntervalBetweenLessonsSequence: 'O intervalo mínimo entre sequências de aulas é de {n} minutos.',
        }
      },
      fields: {
        drivingSchoolId: {
          label: 'CFC',
          errors: {
            required: 'Um cfc deve ser selecionado.',
          }
        },
        studentId: {
          label: 'Aluno',
          errors: {
            required: 'Um aluno deve ser selecionado.',
          }
        },
        instructorId: {
          label: 'Instrutor',
          errors: {
            required: 'Um instrutor deve ser selecionado.',
          }
        },
        moduleId: {
          label: 'Módulo',
          errors: {
            required: 'Um módulo deve ser selecionado.',
          }
        },
        vehicleModelId: {
          label: 'Modelo do Veículo',
          errors: {
            required: 'Um modelo de veículo deve ser selecionado.',
          }
        },
        date: {
          label: 'Data',
          errors: {
            required: 'A hora de inicio não pode ficar vazio.',
          }
        },
        lessonType: {
          label: 'Tipo da Aula',
          options: {
            0: 'Aula Detran',
            1: 'Aula Avulsa',
            2: 'Aula Livre'
          },
          errors: {
          }
        },
        simulatorId: {
          label: 'Simulador',
          errors: {
          }
        },
        period: {
          label: {
            period: 'Período',
            at: 'às'
          },
          errors: {
            required: 'O horário de início deve ser definido.',
          }
        },
        situation: {
          label: 'Situação'
        }
      },
      modal: {
        title: 'Cancelar agendamento',
        messages: 'Deseja realmente cancelar o agendamento?',
        buttons: {
          ok: 'Sim, efetuar o cancelamento',
          cancel: 'Desistir',
          close: 'Fechar'
        }
      }
    }

  },

  moduleR: {

    simulators: {
      title: {
        new: 'Novo Simulador',
        edit: 'Editar Simulador',
        list: 'Simuladores',
      },
      buttons: {
        new: 'Adicionar novo simulador',
        save: 'Salvar',
        cancel: 'Cancelar'
      },
      messages: {
        added: 'Simulador adicionado com sucesso',
        error: 'Ocorreu um erro no sistema',
        deleted: 'Excluido com sucesso.',
        notDeleted: 'O simulador não pode ser excluído pois possui registros vinculados!',
        saved: 'Salvou dados',
      },
      fields: {
        filter: 'Filtrar',
        active: {
          label: 'Ativo',
        },
        name: {
          label: 'Nome',
          errors: {
            required: 'O nome não pode ficar vazio.',
            maxlength: 'O nome não pode ter mais que 40 caracteres.',
          }
        },
        serialNumber: {
          label: 'Número de série',
          errors: {
            required: 'O número de série não pode ficar vazio.',
            maxlength: 'O número de série não pode ter mais que 20 caracteres.',
          }
        },
        vehicleType: {
          label: 'Tipo de veículo',
          errors: {
            required: 'O tipo de veículo não pode ficar vazio.',
          }
        },
      },
      modal: {
        title: 'Excluir simulador',
        messages: 'Tem certeza que deseja excluir esse simulador?',
        buttons: {
          ok: 'OK',
          cancel: 'Cancelar',
          close: 'Fechar'
        }
      }
    },

    drivingSchool: {
      title: {
        new: 'Novo CFC',
        edit: 'Editar CFC',
        list: 'Centro de Formação de Condutores',
      },
      h3: 'Endereço',
      buttons: {
        new: 'Adicionar novo CFC',
        save: 'Salvar',
        cancel: 'Cancelar'
      },
      messages: {
        added: 'CFC adicionado com sucesso',
        error: 'Ocorreu um erro no sistema',
        errorCep: 'Ocorreu um erro ao carregar os dados do endereço. Por favor tente novamente mais tarde.',
        invalidCep: 'Cep inválido',
        deleted: 'Excluido com sucesso.',
        notDeleted: 'Este CFC não pode ser excluído pois possui registros vinculados!',
        saved: 'Salvou dados',
        cnpjUsed: 'Este CNPJ já esta cadastrado no sistema!',
      },
      fields: {
        filter: 'Filtrar',
        cnpj: {
          label: 'CNPJ',
          errors: {
            required: 'O cnpj não pode ficar vazio.',
            maxlength: 'O cnpj não pode ter mais que 18 caracteres.',
            cnpj: 'Digite um cnpj válido.',
          }
        },
        name: {
          label: 'Nome fantasia',
          errors: {
            required: 'O nome fantasia não pode ficar vazio.',
            maxlength: 'O nome fantasia não pode ter mais que 50 caracteres.',
          }
        },
        tradingName: {
          label: 'Razão social',
          errors: {
            required: 'A razão social não pode ficar vazio.',
            maxlength: 'A razão social não pode ter mais que 100 caracteres.',
          }
        },
        stateModuleR: {
          label: 'Inscrição estadual',
          errors: {
            required: 'A inscrição estadual não pode ficar vazio.',
            maxlength: 'A inscrição estadual não pode ter mais que 30 caracteres.',
          }
        },
        email: {
          label: 'E-mail',
          errors: {
            required: 'O e-mail não pode ficar vazio.',
            maxlength: 'O e-mail não pode ter mais que 100 caracteres.',
            email: 'Por favor digite um e-mail válido.',
          }
        },
        phoneNumber: {
          label: 'Telefone',
          errors: {
            required: 'O telefone não pode ficar vazio.',
            maxlength: 'O telefone não pode ter mais que 15 caracteres.',
          }
        },
        zipcode: {
          label: 'CEP',
          errors: {
            required: 'O cep não pode ficar vazio.',
            maxlength: 'O cep não pode ter mais que 9 caracteres.',
          }
        },
        street: {
          label: 'Endereço',
          errors: {
            required: 'O logradouro não pode ficar vazio.',
            maxlength: 'O logradouro não pode ter mais que 200 caracteres.',
          }
        },
        number: {
          label: 'Número',
          errors: {
            required: 'O número não pode ficar vazio.',
            maxlength: 'O número não pode ter mais que 20 caracteres.',
          }
        },
        complement: {
          label: 'Complemento',
          errors: {
            maxlength: 'O complemento não pode ter mais que 50 caracteres.',
          }
        },
        cityArea: {
          label: 'Bairro',
          errors: {
            required: 'O bairro não pode ficar vazio.',
            maxlength: 'O bairro não pode ter mais que 100 caracteres.',
          }
        },
        city: {
          label: 'Município',
          errors: {
            required: 'Um município deve ser selecionado.',
          }
        },
      },
      modal: {
        title: 'Excluir CFC',
        messages: 'Tem certeza que deseja excluir esse CFC?',
        buttons: {
          ok: 'OK',
          cancel: 'Cancelar',
          close: 'Fechar'
        }
      }
    },

    sharedUnit: {
      title: {
        new: 'Novo Centro Compartilhado',
        edit: 'Editar Centro Compartilhado',
        list: 'Centros Compartilhados',
      },
      h3: {
        adress: 'Endereço',
        permission: 'Autorizações'
      },
      buttons: {
        new: 'Adicionar novo Centro Compartilhado',
        save: 'Salvar',
        cancel: 'Cancelar',
      },
      messages: {
        added: 'Centro Compartilhado adicionado com sucesso',
        error: 'Ocorreu um erro no sistema',
        deleted: 'Excluido com sucesso.',
        notDeleted: 'O centro compartilhado não pode ser excluído pois possui simuladores vinculados!',
        saved: 'Salvou dados',
        cnpjUsed: 'Este CNPJ já esta cadastrado no sistema!',
        errorCep: 'Ocorreu um erro ao carregar os dados do endereço. Por favor tente novamente mais tarde.',
        invalidCep: 'Cep inválido',
      },
      fields: {
        filter: 'Filtrar',
        cnpj: {
          label: 'CNPJ',
          errors: {
            required: 'O cnpj não pode ficar vazio.',
            maxlength: 'O cnpj não pode ter mais que 18 caracteres.',
            cnpj: 'Digite um cnpj válido.',
          }
        },
        name: {
          label: 'Nome fantasia',
          errors: {
            required: 'O nome fantasia não pode ficar vazio.',
            maxlength: 'O nome fantasia não pode ter mais que 50 caracteres.',
          }
        },
        tradingName: {
          label: 'Razão social',
          errors: {
            required: 'A razão social não pode ficar vazio.',
            maxlength: 'A razão social não pode ter mais que 100 caracteres.',
          }
        },
        stateModuleR: {
          label: 'Inscrição estadual',
          errors: {
            required: 'A inscrição estadual não pode ficar vazio.',
            maxlength: 'A inscrição estadual não pode ter mais que 30 caracteres.',
          }
        },
        email: {
          label: 'E-mail',
          errors: {
            required: 'O e-mail não pode ficar vazio.',
            maxlength: 'O e-mail não pode ter mais que 100 caracteres.',
            email: 'Por favor digite um e-mail válido.',
          }
        },
        phoneNumber: {
          label: 'Telefone',
          errors: {
            required: 'O telefone não pode ficar vazio.',
            maxlength: 'O telefone não pode ter mais que 15 caracteres.',
          }
        },
        zipcode: {
          label: 'CEP',
          errors: {
            required: 'O cep não pode ficar vazio.',
            maxlength: 'O cep não pode ter mais que 9 caracteres.',
          }
        },
        street: {
          label: 'Endereço',
          errors: {
            required: 'O logradouro não pode ficar vazio.',
            maxlength: 'O logradouro não pode ter mais que 200 caracteres.',
          }
        },
        number: {
          label: 'Número',
          errors: {
            required: 'O número não pode ficar vazio.',
            maxlength: 'O número não pode ter mais que 20 caracteres.',
          }
        },
        complement: {
          label: 'Complemento',
          errors: {
            maxlength: 'O complemento não pode ter mais que 50 caracteres.',
          }
        },
        cityArea: {
          label: 'Bairro',
          errors: {
            required: 'O bairro não pode ficar vazio.',
            maxlength: 'O bairro não pode ter mais que 100 caracteres.',
          }
        },
        city: {
          label: 'Município',
          errors: {
            required: 'Um município deve ser selecionado.',
          }
        },
        relatedDrivingSchools: {
          label: 'CFCs autorizados',
          errors: {
            required: 'Pelo menus um CFC deve ser selecionado.',
          }
        },
        scheduleAccessEnabled: {
          label: 'CFCs podem acessar agenda de aulas:',
          errors: {}
        },
        scheduleAccessReadOnly: {
          label: {
            true: 'Somente visualização da agenda',
            false: 'Efetuar agendamentos de aulas'
          },
          errors: {}
        },
      },
      modal: {
        title: 'Excluir Centro Compartilhado',
        messages: 'Tem certeza que deseja excluir esse Centro Compartilhado?',
        buttons: {
          ok: 'OK',
          cancel: 'Cancelar',
          close: 'Fechar'
        }
      }
    },

    simulatorHistory: {
      title: {
        new: 'Novo Histórico de Simulador',
        edit: 'Editar Histórico de Simulador',
        list: 'Histórico de Simuladores',
      },
      h3: {
        simulators: 'Simuladores:',
        history: 'Histórico:'
      },
      buttons: {
        new: 'Adicionar novo Histórico de Simulador',
        save: 'Salvar',
        cancel: 'Cancelar',
      },
      messages: {
        added: 'Histórico de Simulador adicionado com sucesso',
        error: 'Ocorreu um erro no sistema',
        deleted: 'Excluido com sucesso.',
        notDeleted: 'O histórico não pode ser excluído pois possui registros vinculados!',
        saved: 'Salvou dados',
      },
      fields: {
        filter: 'Filtrar',
        serialNumber: {
          label: 'Número de série',
          errors: {
            required: 'O número de série deve ser selecionado.',
          }
        },
        startDate: {
          label: 'Data Início',
          errors: {
            required: 'A data de início não pode ficar vazia.',
          }
        },
        endDate: {
          label: 'Data Término',
          errors: {
            required: 'A data término não pode ficar vazia.',
            bigger: 'A data de término deve ser maior que a data de início.'
          }
        },
        actual: {
          label: 'Vigente',
          errors: {
          }
        },
        company: {
          label: {
            local: 'Alocação',
            drivingSchool: 'CFC',
            sharedUnit: 'Centro Compartilhado'
          },
          errors: {
            required: 'Uma alocação deve ser selecionada.',
          }
        },
        softwareVersion: {
          label: 'Versão de software',
          errors: {
            required: 'Uma versão de software deve ser selecionado.',
          }
        },
      },
      modal: {
        title: 'Excluir Histórico de Simulador',
        messages: 'Tem certeza que deseja excluir esse Histórico de Simulador?',
        buttons: {
          ok: 'OK',
          cancel: 'Cancelar',
          close: 'Fechar'
        }
      }
    },

    student: {
      title: {
        list: 'Alunos',
        new: 'Novo Aluno',
        edit: 'Editar Aluno',
      },
      h3: {
        personalData: 'Dados pessoais',
        identityDoc: 'Documento de identidade',
        contactInfo: 'Informações para contato'
      },
      buttons: {
        new: 'Adicionar novo Aluno',
        save: 'Salvar',
        cancel: 'Cancelar',
      },
      messages: {
        error: 'Ocorreu um erro no sistema',
        deleted: 'Excluido com sucesso.',
        canceled: 'Matrícula cancelada.',
        saved: 'Salvou dados',
        notDeleted: 'O aluno não pode ser excluído pois possui matrículas vinculadas!',
        errorCep: 'Ocorreu um erro ao carregar os dados do endereço. Por favor tente novamente mais tarde.',
        invalidCep: 'Cep inválido',
      },
      fields: {
        filter: 'Filtrar',
        colName: {
          label: 'Nome'
        },
        colBirth: {
          label: 'Nascimento'
        },
        cpf: {
          label: 'CPF',
          errors: {
            required: 'O CPF não pode ficar vazio.',
            maxlength: 'O CPF não pode ter mais que 14 caracteres.',
            cpf: 'Por favor digite um CPF válido.',
          }
        },
        name: {
          label: 'Nome completo',
          errors: {
            required: 'O nome não pode ficar vazio.',
            maxlength: 'O nome não pode ter mais que 255 caracteres.',
          }
        },
        email: {
          label: 'E-mail',
          errors: {
            maxlength: 'O e-mail não pode ter mais que 100 caracteres.',
            email: 'Por favor digite um e-mail válido.',
          }
        },
        birthDate: {
          label: 'Data de nascimento',
          errors: {
          }
        },
        gender: {
          label: {
            sex: 'Sexo',
            m: 'Masculino',
            f: 'Feminino'
          },
          errors: {
          }
        },
        rg: {
          label: 'RG',
          errors: {
            maxlength: 'O RG não pode ter mais que 20 caracteres.',
          }
        },
        rgExpeditionAgency: {
          label: 'Órgão de expedição',
          errors: {
            maxlength: 'O órgão de expedição não pode ter mais que 20 caracteres.',
          }
        },
        rgState: {
          label: 'UF',
          errors: {
          }
        },
        rgExpeditionDate: {
          label: 'Data de expedição',
          errors: {
          }
        },
        zipcode: {
          label: 'CEP',
          errors: {
            required: 'O cep não pode ficar vazio.',
            maxlength: 'O CEP não pode ter mais que 9 caracteres.',
          }
        },
        street: {
          label: 'Logradouro',
          errors: {
            required: 'O logradouro não pode ficar vazio.',
            maxlength: 'O logradouro não pode ter mais que 200 caracteres.',
          }
        },
        number: {
          label: 'Número',
          errors: {
            required: 'O número não pode ficar vazio.',
            maxlength: 'O número não pode ter mais que 20 caracteres.',
          }
        },
        complement: {
          label: 'Complemento',
          errors: {
            maxlength: 'O complemento não pode ter mais que 50 caracteres.',
          }
        },
        cityArea: {
          label: 'Bairro',
          errors: {
            required: 'O bairro não pode ficar vazio.',
            maxlength: 'O bairro não pode ter mais que 100 caracteres.',
          }
        },
        city: {
          label: 'Município',
          errors: {
            required: 'O município deve ser selecionado.',
          }
        },
        phoneNumber: {
          label: 'Telefone fixo',
          errors: {
            maxlength: 'O telefone não pode ter mais que 14 caracteres.',
          }
        },
        cellPhoneNumber: {
          label: 'Telefone celular',
          errors: {
            maxlength: 'O telefone não pode ter mais que 15 caracteres.',
          }
        },
      },
      modal: {
        title: {
          cancel: 'Confirmar Cancelamento de Matrícula',
          delete: 'Excluir aluno',
          list: 'Matrículas do Aluno'
        },
        messages: {
          cancelDetran:      `Confirma cancelamento da matrícula {enrollment} do
                             aluno {student} realizada em {date} às {hour}
                             referente a {temp} H/A de aulas tipo Aulas Detran? As
                             horas/aula contratadas serão convertidas em bônus H/A
                             que podem ser utilizadas em novas matrículas.`,
          cancelSingleClass: `Confirma o cancelamento da matrícula {enrollment}
                             do aluno {student} realizada em {date} às {hour} referente
                             a {temp} H/A de aulas tipo Aulas Avulsas? No caso da
                             identificação do pagamento do boleto referente a esta
                             matrícula, o valor pago ficará disponível em caixa para
                             utilização em novas matrículas.`,
          cancelFreeClass:   `Confirma o cancelamento da matrícula {enrollment} do
                             aluno {student} realizada em {date} às {hour} referente
                             a {temp} H/A de aulas tipo Aulas Livres?`,
          delete: 'Tem certeza que deseja excluir esse aluno?',
        },
        fields: {
          colNumEnrollment: {
            label: 'Matrícula'
          },
          colDate: {
            label: 'Data'
          },
          colLessonsType: {
            label: 'Tipo aulas',
            options: {
              0: 'Aulas Detran',
              1: 'Aulas Avulsas',
              2: 'Aulas Livres'
            },
          },
          colNumLessonsLoaded: {
            label: 'Quantidade de aulas'
          },
          colPaymentType: {
            label: 'Pagamento',
            options: {
              0: 'Débito em Caixa',
              1: 'Débito em Bônus'
            }
          },
        },
        buttons: {
          cancel: 'Cancelar',
          confirm: 'Confirmar',
          ok: 'OK',
          close: 'Fechar'
        },
      }
    },

    instructor: {
      title: {
        list: 'Instrutores',
        new: 'Novo Instrutor',
        edit: 'Editar Instrutor',
      },
      h3: {
        personalData: 'Dados pessoais',
        identityDoc: 'Documento de identidade',
        contactInfo: 'Informações para contato',
        authorization: 'Autorizações',
        situation: 'Situação'
      },
      buttons: {
        new: 'Adicionar novo Instrutor',
        save: 'Salvar',
        cancel: 'Cancelar',
      },
      messages: {
        error: 'Ocorreu um erro no sistema',
        deleted: 'Excluido com sucesso.',
        saved: 'Salvou dados',
        notDeleted: 'O instrutor não pode ser excluído pois possui aulas vinculadas!',
        errorCep: 'Ocorreu um erro ao carregar os dados do endereço. Por favor tente novamente mais tarde.',
        invalidCep: 'Cep inválido',
      },
      fields: {
        filter: 'Filtrar',
        colName: {
          label: 'Nome'
        },
        colBirth: {
          label: 'Nascimento'
        },
        colSituation: {
          label: 'Situação'
        },
        cpf: {
          label: 'CPF',
          errors: {
            required: 'O CPF não pode ficar vazio.',
            maxlength: 'O CPF não pode ter mais que 14 caracteres.',
            cpf: 'Por favor digite um CPF válido.',
          }
        },
        name: {
          label: 'Nome completo',
          errors: {
            required: 'O nome não pode ficar vazio.',
            maxlength: 'O nome não pode ter mais que 255 caracteres.',
          }
        },
        email: {
          label: 'E-mail',
          errors: {
            required: 'O e-mail não pode ficar vazio.',
            maxlength: 'O e-mail não pode ter mais que 100 caracteres.',
            email: 'Por favor digite um e-mail válido.',
          }
        },
        birthDate: {
          label: 'Data de nascimento',
          errors: {
            required: 'A data de nascimento não pode ficar vazia.',
          }
        },
        gender: {
          label: {
            sex: 'Sexo',
            m: 'Masculino',
            f: 'Feminino'
          },
          errors: {
            required: 'O sexo deve ser selecionado.',
          }
        },
        rg: {
          label: 'RG',
          errors: {
            maxlength: 'O RG não pode ter mais que 20 caracteres.',
          }
        },
        rgExpeditionAgency: {
          label: 'Órgão de expedição',
          errors: {
            maxlength: 'O órgão de expedição não pode ter mais que 20 caracteres.',
          }
        },
        rgState: {
          label: 'UF',
          errors: {
          }
        },
        rgExpeditionDate: {
          label: 'Data de expedição',
          errors: {
          }
        },
        zipcode: {
          label: 'CEP',
          errors: {
            required: 'O cep não pode ficar vazio.',
            maxlength: 'O CEP não pode ter mais que 9 caracteres.',
          }
        },
        street: {
          label: 'Logradouro',
          errors: {
            required: 'O logradouro não pode ficar vazio.',
            maxlength: 'O logradouro não pode ter mais que 200 caracteres.',
          }
        },
        number: {
          label: 'Número',
          errors: {
            required: 'O número não pode ficar vazio.',
            maxlength: 'O número não pode ter mais que 20 caracteres.',
          }
        },
        complement: {
          label: 'Complemento',
          errors: {
            maxlength: 'O complemento não pode ter mais que 50 caracteres.',
          }
        },
        cityArea: {
          label: 'Bairro',
          errors: {
            required: 'O bairro não pode ficar vazio.',
            maxlength: 'O bairro não pode ter mais que 100 caracteres.',
          }
        },
        city: {
          label: 'Município',
          errors: {
            required: 'O Município deve ser selecionado.',
          }
        },
        phoneNumber: {
          label: 'Telefone fixo',
          errors: {
            maxlength: 'O telefone não pode ter mais que 14 caracteres.',
          }
        },
        cellPhoneNumber: {
          label: 'Telefone celular',
          errors: {
            maxlength: 'O telefone não pode ter mais que 15 caracteres.',
          }
        },
        authTheoricalLesson: {
          label: 'Aulas teóricas',
          errors: {
            required: 'Obrigatória a seleção de ao menos um tipo de autorização.',
          }
        },
        authPraticalLesson: {
          label: 'Aulas práticas'
        },
        authSimulatorLesson: {
          label: 'Aulas em simulador'
        },
        active: {
          label: 'Ativo'
        },
      },
      modal: {
        title: 'Excluir instrutor',
        messages: 'Tem certeza que deseja excluir esse instrutor?',
        buttons: {
          ok: 'OK',
          cancel: 'Cancelar',
          close: 'Fechar'
        }
      }
    },

  },

  moduleCf: {

    infraction: {
      title: {
        new: 'Nova Infração de trânsito',
        edit: 'Editar Infração de trânsito',
        list: 'Infrações de trânsito',
      },
      buttons: {
        cancel: 'Cancelar',
        new: 'Adicionar nova infração de trânsito',
        save: 'Salvar',
      },
      messages: {
        added: 'Infração adicionada com sucesso',
        error: 'Ocorreu um erro no sistema',
        deleted: 'Excluido com sucesso.',
        notDeleted: 'A atividade não pode ser excluído pois possui resultados vinculados!',
        saved: 'Salvou dados',
      },
      fields: {
        filter: 'Filtrar',
        code: {
          label: 'Código',
          errors: {
            required: 'O código não pode ficar vazio.',
            maxlength: 'O código não pode ter mais que 5 caracteres.',
            range: 'O código deve ficar entre 1 e 99999.',
            number: 'Somente números são permitidos nesse campo.',
          }
        },
        category: {
          label: 'Categoria',
          errors: {
            required: 'Uma categoria deve ser selecionada.',
          }
        },
        points: {
          label: 'Pontos',
          errors: {
            required: 'O campo pontos não pode ficar vazio.',
            maxlength: 'O campo pontos não pode ter mais que 2 caracteres.',
            range: 'O campo pontos deve ficar entre 1 e 99.',
            number: 'Somente números são permitidos nesse campo.',
          }
        },
        article: {
          label: 'Artigo',
          errors: {
            required: 'O artigo não pode ficar vazio.',
            maxlength: 'O código não pode ter mais que 10 caracteres.',
          }
        },
        paragraph: {
          label: 'Alínea',
          errors: {
            required: 'A alínea não pode ficar vazia.',
            maxlength: 'A alínea não pode ter mais que 10 caracteres.',
          }
        },
        law: {
          label: 'Lei',
          errors: {
            required: 'A lei não pode ficar vazia.',
            maxlength: 'A lei não pode ter mais que 255 caracteres.',
          }
        },
      },
      modal: {
        title: 'Excluir infração',
        messages: 'Tem certeza que deseja excluir essa infração?',
        buttons: {
          ok: 'OK',
          cancel: 'Cancelar',
          close: 'Fechar'
        }
      }
    },

    userType: {
      title: {
        new: 'Novo Perfil de Usuário',
        edit: 'Editar Perfil de Usuário',
        list: 'Perfil de Usuário',
      },
      buttons: {
        cancel: 'Cancelar',
        new: 'Adicionar novo perfil de usuário',
        save: 'Salvar',
      },
      messages: {
        added: 'Perfil adicionado com sucesso',
        error: 'Ocorreu um erro no sistema',
        deleted: 'Excluido com sucesso.',
        notDeleted: 'O perfil de usuário não pode ser excluído pois possui usuários vinculados!',
        saved: 'Salvou dados',
      },
      fields: {
        filter: 'Filtrar',
        description: {
          label: 'Descrição',
          errors: {
            required: 'A descrição não pode ficar vazia.',
            maxlength: 'A descrição não pode ter mais que 30 caracteres.',
          }
        },
        permissions: {
          label: 'Permissões:'
        },
        funcionality: {
          label: 'Funcionalidade',
        },
        authCreate: {
          label: 'Incluir',
        },
        authUpdate: {
          label: 'Editar',
        },
        authDelete: {
          label: 'Excluir',
        },
        authRead: {
          label: 'ModuleCsar',
        },
      },
      modal: {
        title: 'Excluir perfil',
        messages: 'Tem certeza que deseja excluir esse perfil?',
        buttons: {
          ok: 'OK',
          cancel: 'Cancelar',
          close: 'Fechar'
        }
      }
    },

    simulationEvent: {
      title: {
        new: 'Novo Evento',
        edit: 'Editar Evento',
        list: 'Eventos Possíveis em Simulação',
      },
      buttons: {
        cancel: 'Cancelar',
        new: 'Adicionar novo evento',
        save: 'Salvar',
      },
      messages: {
        added: 'Evento adicionado com sucesso',
        error: 'Ocorreu um erro no sistema',
        deleted: 'Excluido com sucesso.',
        notDeleted: 'O evento não pode ser excluído pois possui resultados de aulas vinculados!',
        saved: 'Salvou dados',
      },
      fields: {
        filter: 'Filtrar',
        id: {
          label: 'Código',
          errors: {
            required: 'O código não pode ficar vazio.',
            maxlength: 'O código não pode ter mais que 8 caracteres.',
            number: 'Somente números são permitidos nesse campo.',
          }
        },
        category: {
          label: 'Categoria',
          errors: {
            required: 'A categoria deve ser selecionada.',
          }
        },
        description: {
          label: 'Descrição',
          errors: {
            required: 'A descrição não pode ficar vazia.',
            maxlength: 'A descrição não pode ter mais que 100 caracteres.',
          }
        },
      },
      modal: {
        title: 'Excluir evento',
        messages: 'Tem certeza que deseja excluir esse evento?',
        buttons: {
          ok: 'OK',
          cancel: 'Cancelar',
          close: 'Fechar'
        }
      }
    },

    simulationExercise: {
      title: {
        new: 'Novo Exercício',
        edit: 'Editar Exercício',
        list: 'Exercícios de Simulação',
        clone: 'Clonar Conjuntos de Exercicios'
      },
      buttons: {
        cancel: 'Cancelar',
        new: 'Adicionar novo Exercício',
        save: 'Salvar',
        cloneExercises: 'Clonar Conjunto de Exercícios',
        clone: 'Clonar',
      },
      messages: {
        added: 'Exercício adicionado com sucesso',
        error: 'Ocorreu um erro no sistema',
        deleted: 'Excluido com sucesso.',
        notDeleted: 'O exercício não pode ser excluído pois possui aulas vinculadas!',
        notSameCodeVersion: 'Não é permitido salvar um exercício com mesmo código para a mesma versão de software.',
        saved: 'Salvou dados',
        cloneMsg: 'Todos os exercicios da versão de origem serão copiados para a versão de destino',
      },
      fields: {
        filter: 'Filtrar',
        code: {
          label: 'Código',
          errors: {
            required: 'O código não pode ficar vazio.',
            maxlength: 'O código não pode ter mais que 6 caracteres.',
            range: 'O código deve ficar entre 1 e 999999.',
            number: 'Somente números são permitidos nesse campo.',
          }
        },
        description: {
          label: 'Descrição',
          errors: {
            required: 'A descrição não pode ficar vazia.',
            maxlength: 'A descrição não pode ter mais que 100 caracteres.',
          }
        },
        softwareVersion: {
          label: 'Versão de software',
          errors: {
            required: 'Uma versão de software deve ser selecionada.',
          }
        },
        sourceSoftwareVersionId: {
          label: 'Versão de origem',
          errors: {
            required: 'Uma versão de origem deve ser selecionada.',
          }
        },
        destSoftwareVersionId: {
          label: 'Versão de destino',
          errors: {
            required: 'Uma versão de destino deve ser selecionada.',
            notEqualTo: 'A versão de origem selecionada deve ser diferente da versão de destino.',
          }
        },
      },
      modal: {
        title: 'Excluir exercício',
        messages: 'Tem certeza que deseja excluir esse exercício?',
        buttons: {
          ok: 'OK',
          cancel: 'Cancelar',
          close: 'Fechar'
        }
      }
    },

    simulationModule: {
      title: {
        new: 'Nova Aula',
        edit: 'Editar Aula',
        list: 'Aulas de Simulação',
        clone: 'Clonar Conjunto de Aulas',
      },
      buttons: {
        new: 'Adicionar Nova Aula',
        save: 'Salvar',
        cancel: 'Cancelar',
        cloneLessons: 'Clonar Conjunto de Aulas',
        clone: 'Clonar',
      },
      messages: {
        added: 'Aula adicionada com sucesso',
        error: 'Ocorreu um erro no sistema',
        deleted: 'Excluido com sucesso.',
        notDeleted: 'A aula não pode ser excluída pois já existem agendamentos realizados!',
        saved: 'Salvou dados',
        // notSameCodeVersion: 'Não é permitido salvar um exercício com mesmo código para a mesma versão de software.',
        cloneMsg: 'Todas as aulas da versão de origem serão copiadas para a versão de destino',
      },
      fields: {
        filter: 'Filtrar',
        active: {
          label: 'Ativo',
        },
        description: {
          label: 'Descrição',
          errors: {
            required: 'A descrição não pode ficar vazia.',
            maxlength: 'O nome não pode ter mais que 100 caracteres.',
          }
        },
        softwareVersion: {
          label: 'Versão de software',
          errors: {
            required: 'Uma versão de software deve ser selecionada.',
          }
        },
        identifierOnDepartment: {
          label: 'Identificação no departamento',
          errors: {
            required: 'A identificação no departamento não pode ficar vazio.',
            maxlength: 'A identificação no departamento não deve ser maior que 5 dígitos.',
            max: 'A identificação no departamento não deve ser maior que 32767.',
          }
        },
        exercises: {
          label: 'Exercícios',
          errors: {
            minLength: 'Ao menos um exercicio deve ser adicionado.',
          }
        },
        sourceSoftwareVersionId: {
          label: 'Versão de origem',
          errors: {
            required: 'Uma versão de origem deve ser selecionada.',
          }
        },
        destSoftwareVersionId: {
          label: 'Versão de destino',
          errors: {
            required: 'Uma versão de destino deve ser selecionada.',
            notEqualTo: 'A versão de origem selecionada deve ser diferente da versão de destino.',
          }
        },
      },
      modal: {
        title: 'Excluir aula',
        messages: 'Tem certeza que deseja excluir essa aula?',
        buttons: {
          ok: 'OK',
          cancel: 'Cancelar',
          close: 'Fechar'
        }
      }
    },

    vehicleType: {
      title: {
        new: 'Novo Tipo de Veículo',
        edit: 'Editar Tipo de Veículo',
        list: 'Tipos de Veículos',
      },
      buttons: {
        cancel: 'Cancelar',
        new: 'Adicionar novo tipo de veículo',
        save: 'Salvar',
      },
      messages: {
        added: 'Tipo de veículo adicionado com sucesso',
        error: 'Ocorreu um erro no sistema',
        deleted: 'Excluido com sucesso.',
        notDeleted: 'O tipo do veículo não pode ser excluído pois possui modelos de veículos vinculados!',
        saved: 'Salvou dados',
      },
      fields: {
        filter: 'Filtrar',
        id: {
          label: 'Código',
          errors: {
            required: 'O código não pode ficar vazio.',
            maxlength: 'O código não pode ter mais que 4 caracteres.',
            number: 'Somente números são permitidos nesse campo.',
          }
        },
        description: {
          label: 'Descrição',
          errors: {
            required: 'A descrição não pode ficar vazia.',
            maxlength: 'A descrição não pode ter mais que 20 caracteres.',
          }
        },
      },
      modal: {
        title: 'Excluir tipo de veículo',
        messages: 'Tem certeza que deseja excluir esse tipo de veículo?',
        buttons: {
          ok: 'OK',
          cancel: 'Cancelar',
          close: 'Fechar'
        }
      }
    },

    vehicleModel: {
      title: {
        new: 'Novo Modelo de Veículo',
        edit: 'Editar Modelo de Veículo',
        list: 'Modelos de Veículos',
      },
      buttons: {
        cancel: 'Cancelar',
        new: 'Adicionar novo modelo de veículo',
        save: 'Salvar',
      },
      messages: {
        added: 'Modelo de veículo adicionado com sucesso',
        error: 'Ocorreu um erro no sistema',
        deleted: 'Excluido com sucesso.',
        notDeleted: 'O modelo de veículo não pode ser excluído pois possui agendamentos vinculados!',
        saved: 'Salvou dados',
      },
      fields: {
        filter: 'Filtrar',
        id: {
          label: 'Código',
          errors: {
            required: 'O código não pode ficar vazio.',
            maxlength: 'O código não pode ter mais que 6 caracteres.',
            number: 'Somente números são permitidos nesse campo.',
          }
        },
        description: {
          label: 'Descrição',
          errors: {
            required: 'A descrição não pode ficar vazia.',
            maxlength: 'A descrição não pode ter mais que 20 caracteres.',
          }
        },
        vehicleType: {
          label: 'Tipo',
          errors: {
            required: 'Um tipo de veículo deve ser selecionado.',
          }
        },
      },
      modal: {
        title: 'Excluir modelo de veículo',
        messages: 'Tem certeza que deseja excluir esse modelo de veículo?',
        buttons: {
          ok: 'OK',
          cancel: 'Cancelar',
          close: 'Fechar'
        }
      }
    },

    simulationActivity: {
      title: {
        new: 'Nova Atividade',
        edit: 'Editar Atividade',
        list: 'Atividades',
      },
      buttons: {
        cancel: 'Cancelar',
        new: 'Adicionar nova atividade',
        save: 'Salvar',
      },
      messages: {
        added: 'Atividade adicionada com sucesso',
        error: 'Ocorreu um erro no sistema',
        deleted: 'Excluida com sucesso.',
        notDeleted: 'A atividade pode ser excluída pois possui resultados de aulas vinculados!',
        saved: 'Salvou dados',
      },
      fields: {
        filter: 'Filtrar',
        id: {
          label: 'Código',
          errors: {
            required: 'O código não pode ficar vazio.',
            maxlength: 'O código não pode ter mais que 9 caracteres.',
            number: 'Somente números são permitidos nesse campo.',
          }
        },
        description: {
          label: 'Descrição',
          errors: {
            required: 'A descrição não pode ficar vazia.',
            maxlength: 'A descrição não pode ter mais que 512 caracteres.',
          }
        },
        vehicleType: {
          label: 'Tipo',
          errors: {
            required: 'Um tipo de veículo deve ser selecionado.',
          }
        },
      },
      modal: {
        title: 'Excluir atividade',
        messages: 'Tem certeza que deseja excluir essa atividade?',
        buttons: {
          ok: 'OK',
          cancel: 'Cancelar',
          close: 'Fechar'
        }
      }
    },

    holiday: {
      title: {
        new: 'Novo Feriado',
        edit: 'Editar Feriado',
        list: 'Feriados',
      },
      h3: {
        fixed: 'Feriados fixos:',
        variable: 'Feriados variáveis:'
      },
      buttons: {
        cancel: 'Cancelar',
        new: 'Adicionar novo feriado',
        save: 'Salvar',
      },
      messages: {
        added: 'Feriado adicionado com sucesso',
        error: 'Ocorreu um erro no sistema',
        deleted: 'Excluido com sucesso.',
        saved: 'Salvou dados',
      },
      fields: {
        filter: 'Filtrar',
        holidayDate: {
          label: 'Data',
          errors: {
            required: 'A data do feriado não pode ficar vazia.',
          }
        },
        description: {
          label: 'Descrição',
          errors: {
            required: 'A descrição não pode ficar vazia.',
            maxlength: 'A descrição não pode ter mais que 50 caracteres.',
          }
        },
        type: {
          label: 'Tipo',
          errors: {
            required: 'Um tipo de feriado deve ser selecionado.',
          }
        },
      },
      modal: {
        title: 'Excluir feriado',
        messages: 'Tem certeza que deseja excluir esse feriado?',
        buttons: {
          ok: 'OK',
          cancel: 'Cancelar',
          close: 'Fechar'
        }
      }
    },

    user: {
      title: {
        list: 'Usuários',
        new: 'Novo Usuário',
        edit: 'Editar Usuário',
      },
      buttons: {
        new: 'Adicionar novo Usuário',
        save: 'Salvar',
        cancel: 'Cancelar',
      },
      messages: {
        error: 'Ocorreu um erro no sistema',
        deleted: 'Excluido com sucesso.',
        saved: 'Salvou dados',
        notDeleted: 'O usuário não pode ser excluído pois possui registros vinculados!',
        reseted: 'Um e-mail foi enviado com um link para cadastrar uma nova senha.',
      },
      fields: {
        filter: 'Filtrar',
        cpf: {
          label: 'CPF',
          errors: {
            required: 'O CPF não pode ficar vazio.',
            maxlength: 'O CPF não pode ter mais que 14 caracteres.',
            cpf: 'Por favor digite um CPF válido.',
          }
        },
        firstName: {
          label: 'Nome',
          errors: {
            required: 'O nome não pode ficar vazio.',
            maxlength: 'O nome não pode ter mais que 30 caracteres.',
          }
        },
        lastName: {
          label: 'Sobrenome',
          errors: {
            required: 'O sobrenome não pode ficar vazio.',
            maxlength: 'O sobrenome não pode ter mais que 80 caracteres.',
          }
        },
        email: {
          label: 'E-mail',
          errors: {
            required: 'O e-mail não pode ficar vazio.',
            maxlength: 'O e-mail não pode ter mais que 100 caracteres.',
            email: 'Por favor digite um e-mail válido.',
          }
        },
        userTypeId: {
          label: 'Perfil',
          errors: {
            required: 'O perfil não pode ficar vazio.',
          }
        },
        active: {
          label: 'Ativo',
        },
      },
      modal: {
        title: {
          reset: 'Redefinir senha',
          delete: 'Excluir usuário'
        },
        messages: {
          reset: 'Deseja realmente redefinir a senha deste usuário?',
          delete: 'Tem certeza que deseja excluir esse usuário?',
        },
        buttons: {
          cancel: 'Cancelar',
          confirm: 'Confirmar',
          ok: 'OK',
          close: 'Fechar'
        },
      }
    },

    softwareVersion: {
      title: {
        new: 'Nova Versão do Software',
        edit: 'Editar Versão do Software',
        list: 'Versões do Software de Simulação',
      },
      buttons: {
        cancel: 'Cancelar',
        new: 'Adicionar nova versão de software',
        save: 'Salvar',
      },
      messages: {
        added: 'Versão adicionada com sucesso',
        error: 'Ocorreu um erro no sistema',
        deleted: 'Excluido com sucesso.',
        notDeleted: 'A versão de software não pode ser excluída pois possui exercícios vinculados!',
        saved: 'Salvou dados',
      },
      fields: {
        filter: 'Filtrar',
        version: {
          label: 'Versão',
          errors: {
            required: 'A versão não pode ficar vazia.',
            maxlength: 'A versão não pode ter mais que 10 caracteres.',
          }
        },
        description: {
          label: 'Descrição',
          errors: {
            required: 'A descrição não pode ficar vazia.',
            maxlength: 'A descrição não pode ter mais que 100 caracteres.',
          }
        },
        releaseDate: {
          label: 'Data de Liberação',
          errors: {
            required: 'A data de liberação não pode ficar vazia.',
          }
        }
      },
      modal: {
        title: 'Excluir versão',
        messages: 'Tem certeza que deseja excluir essa versão?',
        buttons: {
          ok: 'OK',
          cancel: 'Cancelar',
          close: 'Fechar'
        }
      }
    },

    department: {
      title: 'Departamento de Trânsito',
      buttons: {
        save: 'Salvar'
      },
      messages: {
        saved: 'Salvou dados',
        error: 'Ocorreu um erro no sistema'
      },
      fields: {
        name: {
          label: 'Nome',
          errors: {
            required: 'O nome não pode ficar vazio.',
            maxlength: 'O nome não pode ter mais que 20 caracteres.',
          }
        },
        state: {
          label: 'UF',
          errors: {
            required: 'O estado deve ser selecionado.',
          }
        },
        communicationType: {
          label: 'Forma de Integração',
          errors: {
            required: 'A forma de integração deve ser selecionada.',
          }
        },
        webserviceAddress: {
          label: 'Endereço de Webservice',
          errors: {
            required: 'O endereço de webservice não pode ficar vazio.',
            maxlength: 'O endereço de webservice não pode ter mais que 200 caracteres.',
            url: 'A URL não é válida.',
          }
        }
      }
    },

    smtpServer: {
      title: 'Servidor SMTP',
      buttons: {
        save: 'Salvar',
        sendEmail: 'Enviar e-mail de teste'
      },
      messages: {
        saved: 'Salvou dados',
        error: 'Ocorreu um erro no sistema: '
      },
      fields: {
        description: {
          label: 'Descrição',
          errors: {
            required: 'A descrição não pode ficar vazia.',
            maxlength: 'A descrição não pode ter mais que 100 caracteres.',
          }
        },
        server: {
          label: 'Servidor',
          errors: {
            required: 'O servidor não pode ficar vazio.',
            maxlength: 'O servidor não pode ter mais que 100 caracteres.',
          }
        },
        port: {
          label: 'Porta',
          errors: {
            required: 'A porta não pode ficar vazia.',
            maxlength: 'A porta não pode ter mais que 5 caracteres.',
            number: 'Somente números são permitidos nesse campo.',
          }
        },
        username: {
          label: 'Usuário',
          errors: {
            required: 'O usuário não pode ficar vazio.',
            maxlength: 'O usuário não pode ter mais que 50 caracteres.',
          }
        },
        password: {
          label: 'Senha',
          errors: {
            required: 'A senha não pode ficar vazia.',
            maxlength: 'A senha não pode ter mais que 50 caracteres.',
          }
        },
        enableSSL: {
          label: 'Habilitar SSL'
        },
        timeout: {
          label: 'Timeout',
          errors: {
            required: 'O timeout não pode ficar vazio.',
            maxlength: 'O timeout não pode ter mais que 3 caracteres.',
            range: 'O timeout deve ter entre 1 a 120 segundos',
            number: 'Somente números são permitidos nesse campo.',
          }
        },
      },
      modal: {
        title: 'Enviar e-mail de teste',
        buttons: {
          send: 'Enviar',
          close: 'Fechar'
        },
        messages: {
          sent: 'Enviou e-mail de teste',
          error: 'Ocorreu um erro no sistema: '
        },
        fields: {
          email: 'E-mail de destino',
          errors: {
            required: 'O email não pode ficar vazio.',
            email: 'Por favor digite um e-mail válido.'
          }
        }
      },
    },

    system: {
      title: 'Sistema',
      h3: {
        generalParams: 'Parâmetros gerais',
        diaryParams: 'Parâmetros da agenda',
        diaryParamsSim: 'Parâmetros para agendamento de aulas em simuladores',
        finParams: 'Parâmetros financeiros'
      },
      h4: {
        detranClassLoose: 'Aula Detran / Aula Avulsa',
        freeClass: 'Aula Livre',
      },
      buttons: {
        save: 'Salvar'
      },
      messages: {
        saved: 'Salvou dados',
        error: 'Ocorreu um erro no sistema: '
      },
      fields: {
        externalAccessUrl: {
          label: 'URL para acesso externo',
          errors: {
            required: 'A URL não pode ficar vazia.',
            maxlength: 'A URL não pode ter mais que 200 caracteres.',
            url: 'A URL não é válida.'
          }
        },
        scheduleOpenTime: {
          label: 'Hora de abertura',
          errors: {
            required: 'A hora de abertura não pode ficar vazia.'
          }
        },
        scheduleCloseTime: {
          label: 'Hora de fechamento',
          errors: {
            required: 'A hora de fechamento não pode ficar vazia.'
          }
        },
        scheduleTimeDivision: {
          label: 'Intervalo',
          errors: {
            required: 'O intervalo deve ser selecionado.'
          }
        },
        lessonScheduler: {
          label: 'Agendamento de aulas realizado pelo Departamento de Trânsito'
        },
        officialLessonTotalTime: {
          label: 'Tempo total de aula',
          errors: {
            required: 'O tempo total de aula não pode ficar vazio.',
            maxlength: 'O tempo total de aula não pode ter mais que 4 caracteres',
            number: 'Somente números são permitidos nesse campo.',
          }
        },
        officialLessonEffectiveTime: {
          label: 'Tempo efetivo de aula',
          errors: {
            required: 'O tempo efetivo de aula não pode ficar vazio.',
            maxlength: 'O tempo efetivo de aula não pode ter mais que 4 caracteres',
            number: 'Somente números são permitidos nesse campo.',
          }
        },
        freeLessonTotalTime: {
          label: 'Tempo total de aula',
          errors: {
            required: 'O tempo total de aula não pode ficar vazio.',
            maxlength: 'O tempo total de aula não pode ter mais que 4 caracteres',
            number: 'Somente números são permitidos nesse campo.',
          }
        },
        freeLessonEffectiveTime: {
          label: 'Tempo efetivo de aula',
          errors: {
            required: 'O tempo efetivo de aula não pode ficar vazio.',
            maxlength: 'O tempo efetivo de aula não pode ter mais que 4 caracteres',
            number: 'Somente números são permitidos nesse campo.',
          }
        },
        maxNumFreeLessonsPerDay: {
          label: 'Máximo de aulas por dia',
          errors: {
            required: 'O número máximo de aulas por dia não pode ficar vazio.',
            maxlength: 'O número máximo de aulas por dia não pode ter mais que 4 caracteres',
            number: 'Somente números são permitidos nesse campo.',
          }
        },
        maxNumLessonsPerDayPerStudent: {
          label: 'Máximo de aulas por dia para o mesmo aluno',
          errors: {
            required: 'O número máximo de aulas para o mesmo aluno não pode ficar vazio.',
            maxlength: 'O número máximo de aulas para o mesmo aluno não pode ter mais que 4 caracteres',
            number: 'Somente números são permitidos nesse campo.',
          }
        },
        maxNumLessonsInSequencePerStudent: {
          label: 'Máximo de aulas em sequencia para o mesmo aluno',
          errors: {
            required: 'O número máximo de aulas em sequencia para o mesmo aluno não pode ficar vazio.',
            maxlength: 'O número máximo de aulas em sequencia para o mesmo aluno não pode ter mais que 4 caracteres',
            number: 'Somente números são permitidos nesse campo.',
          }
        },
        minIntervalBetweenLessonsSequence: {
          label: 'Intervalo mínimo entre sequênias de aulas',
          errors: {
            required: 'O intervalo mínimo entre sequênias de aulas não pode ficar vazio.',
            maxlength: 'O intervalo mínimo entre sequênias de aulas não pode ter mais que 4 caracteres',
            number: 'Somente números são permitidos nesse campo.',
          }
        },
        maxSimultaneousLessonsPerInstructor: {
          label: 'Máximo de aulas simultâneas por instrutor',
          errors: {
            required: 'O número máximo de aulas simultâneas por instrutor não pode ficar vazio.',
            maxlength: 'O número máximo de aulas simultâneas por instrutor não pode ter mais que 4 caracteres',
            number: 'Somente números são permitidos nesse campo.',
          }
        },
        maxSizeAttachment: {
          label: 'Tamanho máximo permitido para anexos (comprovante) em MB',
          errors: {
            required: 'O tamanho máximo permitido para anexos não pode ficar vazio.',
            maxlength: 'O tamanho máximo permitido para anexos não pode ter mais que 6 caracteres',
            number: 'Somente números são permitidos nesse campo.',
          }
        },
      }
    }
  },

  moduleF: {

    contract: {
      title: {
        list: 'Contratos',
        new: 'Novo Contrato',
        edit: 'Editar Contrato',
      },
      h3: {
        cfcLists: 'CFCs',
        contracts: 'Contratos'
      },
      buttons: {
        new: 'Adicionar novo contrato',
        save: 'Salvar',
        cancel: 'Cancelar',
      },
      messages: {
        added: 'Contrato adicionado com sucesso',
        error: 'Ocorreu um erro no sistema',
        deleted: 'Cancelado com sucesso.',
        notDeleted: 'O contrato não pode ser excluído pois possui agendamentos de aulas vinculados!',
        saved: 'Salvou dados',
      },
      fields: {
        filter: 'Filtrar',
        drivingSchool: {
          label: 'CFC',
          errors: {
            required: 'Um CFC deve ser selecionado.',
          }
        },
        startDate: {
          label: 'Data Início',
          errors: {
            required: 'A data de início não pode ficar vazia.',
          }
        },
        endDate: {
          label: 'Data Término',
          errors: {
            required: 'A data de término não pode ficar vazia.',
            bigger: 'A data de término deve ser maior que a data de início.'
          }
        },
        lessonPrice: {
          label: 'Valor Hora/Aula',
          errors: {
            required: 'O valor hora/aula não pode ficar vazio.',
            maxlength: 'O código não pode ter mais que 17 caracteres.',
          }
        },
        advanceDaysToAlert: {
          label: {
            pre: 'Emitir alerta diário por e-mail a partir de',
            label: 'dias',
            pos: 'de antecedência do término do contrato para os seguintes usuários:'
          },
          errors: {
            required: 'O numero de dias não pode ficar vazio.',
            maxlength: 'Esse campo não pode ter mais que 6 caracteres.',
            number: 'Somente números são permitidos nesse campo.',
          }
        },
        usersToAlert: {
          label: 'Usuários:',
          errors: {
            required: 'É necessário selecionar ao menos um usuário.',
          }
        },
        active: {
          label: 'Situação'
        }
      },
      modal: {
        title: 'Cancelar contrato',
        messages: 'Tem certeza que deseja cancelar esse contrato?',
        buttons: {
          ok: 'OK',
          cancel: 'Cancelar',
          close: 'Fechar'
        }
      }
    },

    bonusEntry: {
      title: 'Entrada de Bônus',
      buttons: {
        save: 'Adicionar',
        cancel: 'Cancelar'
      },
      h3: 'Últimos Lançamentos',
      messages: {
        saved: 'Salvou dados',
        error: 'Ocorreu um erro no sistema: '
      },
      fields: {
        drivingSchoolId: {
          label: 'CFC',
          errors: {
            required: 'Uma CFC deve ser selecionada.',
          }
        },
        bonusValue: {
          label: 'Quantidade bônus H/A',
          errors: {
            required: 'A quantidade bônus h/a não pode ficar vazia.',
            maxlength: 'A quantidade bônus h/a não pode ter mais que 6 caracteres.',
            number: 'Somente números são permitidos nesse campo.',
          }
        },
        justification: {
          label: 'Justificativa',
          errors: {
            required: 'A justificativa não pode ficar vazia.',
            maxlength: 'A justificativa não pode ter mais que 500 caracteres.',
          }
        },
        date: {
          label: 'Data',
          errors: {
          }
        },
        type: {
          label: 'Tipo',
          errors: {
          }
        },
        quantity: {
          label: 'Quantidade',
          errors: {
          }
        },
        user: {
          label: 'Usuário',
          errors: {
          }
        },
      },
      modalConfirmEntry: {
        title: 'Confirmar entrada de bônus',
        messages: 'Confirma a entrada de {bonus} H/A de bônus para {drivingSchool}?',
        buttons: {
          ok: 'Confirmar',
          cancel: 'Cancelar'
        }
      },
      modalCancelBonus: {
        title: {
          cancel : 'Cancelar Bônus',
          canceled : 'Bônus Cancelado'
        },
        buttons: {
          ok: 'Cancelar Bônus',
          cancel: 'Desistir',
          close: 'Fechar'
        },
      },
      modalConfirmCancel: {
        title: 'Confirmar cancelamento de Bônus',
        messages: 'Confirma o cancelamento da entrada de {bonus}H/A de bônus para {drivingSchool}?',
        buttons: {
          ok: 'Confirmar cancelamento',
          cancel: 'Cancelar'
        },
      },
    },

    manageBonus: {
      title: 'Gerenciar Bônus',
      buttons: {
        find: 'Buscar',
      },
      messages: {
        canceled: 'O bônus foi cancelado',
        error: 'Ocorreu um erro no sistema: '
      },
      fields: {
        idCFC: {
          label: 'CFC',
          errors: {
            required: 'Uma CFC deve ser selecionada.',
          }
        },
        initialTimestamp: {
          label: 'Data inicial',
          errors: {
            required: 'A data inicial não pode ficar vazia.',
          }
        },
        finalTimestamp: {
          label: 'Data final',
          errors: {
            required: 'A data final não pode ficar vazia.',
            bigger: 'A data final deve ser maior que a data inicial.'
          }
        },
        date: {
          label: 'Data',
          errors: {
          }
        },
        type: {
          label: 'Tipo',
          errors: {
          }
        },
        quantity: {
          label: 'Quantidade',
          errors: {
          }
        },
        user: {
          label: 'Usuário',
          errors: {
          }
        },
      },
    },

    creditEntry: {
      title: 'Entrada de Crédito',
      buttons: {
        save: 'Confirmar',
        cancel: 'Cancelar'
      },
      h3: 'Últimos Lançamentos',
      messages: {
        saved: 'Salvou dados',
        error: 'Ocorreu um erro no sistema: '
      },
      fields: {
        drivingSchoolId: {
          label: 'CFC',
          errors: {
            required: 'Uma CFC deve ser selecionada.',
          }
        },
        creditValue: {
          label: 'Valor Crédito',
          errors: {
            required: 'O valor crédito não pode ficar vazio.',
            maxlength: 'O valor crédito não pode ter mais que 17 caracteres.',
          }
        },
        justification: {
          label: 'Justificativa',
          errors: {
            required: 'A justificativa não pode ficar vazia.',
            maxlength: 'A justificativa não pode ter mais que 500 caracteres.',
          }
        },
        evidences: {
          label: 'Comprovantes',
          errors: {
            required: 'Pelo menos um comprovante deve ser adicionado.',
            maxSize: 'O arquivo não pode ter mais que {size} MB de tamanho.',
            fileType: 'São permitidos somente arquivos de imagens e documentos (extenção jpg, jpeg, bmp, png, pdf, txt, xls, xlt, doc e docx).'
          }
        },
        dragAndDrop: {
          label: 'Arraste e solte aqui'
        },
        date: {
          label: 'Data',
          errors: {
          }
        },
        type: {
          label: 'Tipo',
          errors: {
          }
        },
        value: {
          label: 'Valor',
          errors: {
          }
        },
        user: {
          label: 'Usuário',
          errors: {
          }
        },
      },
      modalConfirmEntry: {
        title: 'Confirmar entrada de crédito',
        messages: 'Confirma a entrada de crédito no valor de {value} para {drivingSchool}?',
        buttons: {
          ok: 'Creditar',
          cancel: 'Cancelar'
        }
      },
      modalCancelCredit: {
        title: {
          cancel : 'Estornar Crédito',
          canceled : 'Crédito Estornado'
        },
        buttons: {
          ok: 'Estornar',
          cancel: 'Desistir',
          close: 'Fechar'
        },
      },
      modalConfirmCancel: {
        title: 'Confirmar estorno de crédito',
        messages: 'Confirma o estorno do crédito no valor de {value} para {drivingSchool}?',
        buttons: {
          ok: 'Confirmar estorno',
          cancel: 'Cancelar'
        },
      },
    },

    manageCredit: {
      title: 'Gerenciar Créditos',
      buttons: {
        find: 'Buscar',
      },
      messages: {
        canceled: 'O crédito foi cancelado',
        error: 'Ocorreu um erro no sistema: '
      },
      fields: {
        idCFC: {
          label: 'CFC',
          errors: {
            required: 'Uma CFC deve ser selecionada.',
          }
        },
        initialTimestamp: {
          label: 'Data inicial',
          errors: {
            required: 'A data inicial não pode ficar vazia.',
          }
        },
        finalTimestamp: {
          label: 'Data final',
          errors: {
            required: 'A data final não pode ficar vazia.',
            bigger: 'A data final deve ser maior que a data inicial.'
          }
        },
        date: {
          label: 'Data',
          errors: {
          }
        },
        type: {
          label: 'Tipo',
          errors: {
          }
        },
        value: {
          label: 'Valor',
          errors: {
          }
        },
        user: {
          label: 'Usuário',
          errors: {
          }
        },
      },
    },

  }

};
