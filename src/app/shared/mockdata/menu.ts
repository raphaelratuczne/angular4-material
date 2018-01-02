import { texts } from './texts';
/**
 * Menu data mock
 */
export class MenuMock {
  static root = [
    {
      name: 'dashboard',
      title: texts.menu.dashboard,
      faIcon: 'fa-tachometer',
      link: '/dashboard'
    },

    {
      name: 'moduleAo',
      title: texts.menu.moduleA.moduleA,
      faIcon: 'fa-graduation-cap',
      sub: [
        // {
        //   name: 'moduleA',
        //   title: texts.menu.moduleA.moduleA,
        //   link: '/moduleA'
        // },
        {
          id: 22,
          name: 'ROLE_SCHEDULE_LESSON',
          title: texts.menu.moduleA.simulationLesson,
          link: '/moduleA/simulation-lesson'
        },
        {
          id: 21,
          name: 'ROLE_ENROLLMENT',
          title: texts.menu.moduleA.enrollment,
          link: '/moduleA/enrollment'
        }
      ]
    },

    {
      name: 'moduleR',
      title: texts.menu.moduleR.moduleR,
      faIcon: 'fa-pencil-square-o',
      sub: [
        // {
        //   name: 'moduleR',
        //   title: texts.menu.moduleR.moduleR,
        //   link: '/moduleR'
        // },
        {
          id: 17,
          name: 'ROLE_MAINTAIN_STUDENT',
          title: texts.menu.moduleR.student,
          link: '/moduleR/student'
        },
        {
          id: 20,
          name: 'ROLE_MAINTAIN_SHARED_UNIT',
          title: texts.menu.moduleR.sharedUnit,
          link: '/moduleR/shared-unit'
        },
        {
          id: 19,
          name: 'ROLE_MAINTAIN_DRIVING_SCHOOL',
          title: texts.menu.moduleR.drivingSchool,
          link: '/moduleR/driving-school'
        },
        {
          id: 16,
          name: 'ROLE_MAINTAIN_SIMULATOR_HISTORY',
          title: texts.menu.moduleR.simulatorHistory,
          link: '/moduleR/simulator-history'
        },
        {
          id: 18,
          name: 'ROLE_MAINTAIN_INSTRUCTOR',
          title: texts.menu.moduleR.instructor,
          link: '/moduleR/instructor'
        },
        {
          id: 15,
          name: 'ROLE_MAINTAIN_SIMULATOR',
          title: texts.menu.moduleR.simulators,
          link: '/moduleR/simulators'
        },
      ]
    },

    {
      name: 'moduleCf',
      title: texts.menu.moduleCf.moduleCf,
      faIcon: 'fa-cogs',
      sub: [
        // {
        //   name: 'moduleCf',
        //   title: texts.menu.moduleCf.moduleCf,
        //   link: '/moduleCf'
        // },
        {
          id: 12,
          name: 'ROLE_MAINTAIN_SIMULATION_ACTIVITY',
          title: texts.menu.moduleCf.simulationActivity,
          link: '/moduleCf/simulation-activity'
        },
        {
          id: 14,
          name: 'ROLE_MAINTAIN_LESSON',
          title: texts.menu.moduleCf.simulationModule,
          link: '/moduleCf/simulation-module'
        },
        {
          id: 11,
          name: 'ROLE_MAINTAIN_SIMULATION_EVENT',
          title: texts.menu.moduleCf.simulationEvent,
          link: '/moduleCf/simulation-event'
        },
        {
          id: 13,
          name: 'ROLE_MAINTAIN_EXERCISE',
          title: texts.menu.moduleCf.simulationExercise,
          link: '/moduleCf/simulation-exercise'
        },
        {
          id: 8,
          name: 'ROLE_MAINTAIN_HOLIDAY',
          title: texts.menu.moduleCf.holiday,
          link: '/moduleCf/holiday'
        },
        {
          id: 10,
          name: 'ROLE_MAINTAIN_INFRACTION',
          title: texts.menu.moduleCf.infraction,
          link: '/moduleCf/infraction'
        },
        {
          id: 7,
          name: 'ROLE_MAINTAIN_VEHICLE_MODEL',
          title: texts.menu.moduleCf.vehicleModel,
          link: '/moduleCf/vehicle-model'
        },
        {
          id: 4,
          name: 'ROLE_MAINTAIN_USER_TYPE',
          title: texts.menu.moduleCf.userType,
          link: '/moduleCf/user-type'
        },
        {
          id: 6,
          name: 'ROLE_MAINTAIN_VEHICLE_TYPE',
          title: texts.menu.moduleCf.vehicleType,
          link: '/moduleCf/vehicle-type'
        },
        {
          id: 5,
          name: 'ROLE_MAINTAIN_USER',
          title: texts.menu.moduleCf.user,
          link: '/moduleCf/user'
        },
        {
          id: 9,
          name: 'ROLE_MAINTAIN_SIMULATION_SOFTWARE_VERSION',
          title: texts.menu.moduleCf.softwareVersion,
          link: '/moduleCf/software-version'
        },
        {
          id: 3,
          name: 'ROLE_CONFIG_DEPARTMENT',
          title: texts.menu.moduleCf.department,
          link: '/moduleCf/department'
        },
        {
          id: 2,
          name: 'ROLE_CONFIG_SMTP_SERVER',
          title: texts.menu.moduleCf.smtpServer,
          link: '/moduleCf/smtp-server'
        },
        {
          id: 1,
          name: 'ROLE_CONFIG_SYSTEM',
          title: texts.menu.moduleCf.system,
          link: '/moduleCf/system'
        },
      ]
    },

    {
      name: 'moduleCsas',
      title: texts.menu.moduleCs.moduleCs,
      faIcon: 'fa-list',
      sub: [
        // {
        //   name: 'moduleCsas',
        //   title: texts.menu.moduleCs.moduleCs,
        //   link: 'moduleCs'
        // },
        {
          name: 'agendamento_de_aulas',
          title: texts.menu.moduleCs.scheduleLesson,
          link: 'moduleCs/schedule-lesson'
        },
        {
          name: 'caixa_por_cfc',
          title: texts.menu.moduleCs.cfcCash,
          link: 'moduleCs/cfc-cash'
        },
        {
          name: 'requisicoes',
          title: texts.menu.moduleCs.requisition,
          link: 'moduleCs/requisition'
        },
      ]
    },

    {
      name: 'financeiro',
      title: texts.menu.moduleF.moduleF,
      faIcon: 'fa-calculator',
      sub: [
        // {
        //   name: 'financeiro',
        //   title: texts.menu.moduleF.moduleF,
        //   link: '/moduleF'
        // },
        {
          id: 23,
          name: 'ROLE_CONTRACT_MAINTAIN',
          title: texts.menu.moduleF.contract,
          link: '/moduleF/contract'
        },
        {
          id: 24,
          name: 'ROLE_CREDIT_ENTRY',
          title: texts.menu.moduleF.creditEntry,
          link: '/moduleF/credit-entry'
        },
        {
          id: 25,
          name: 'ROLE_BONUS_ENTRY',
          title: texts.menu.moduleF.bonusEntry,
          link: '/moduleF/bonus-entry'
        },
        {
          id: 26,
          name: 'ROLE_MANAGE_CREDITS',
          title: texts.menu.moduleF.manageCredits,
          link: '/moduleF/manage-credits'
        },
        {
          id: 27,
          name: 'ROLE_MANAGE_BONUS',
          title: texts.menu.moduleF.manageBonus,
          link: '/moduleF/manage-bonus'
        },
      ]
    },

    // {
    //   name: 'login',
    //   title: texts.menu.login.login,
    //   faIcon: 'fa-tasks',
    //   sub: [
    //     // {
    //     //   name: 'login',
    //     //   title: texts.menu.login.login,
    //     //   link: '/login'
    //     // },
    //     {
    //       name: 'redefinir_senha',
    //       title: texts.menu.login.newPass,
    //       link: '/login/new-pass'
    //     },
    //     {
    //       name: 'visao',
    //       title: texts.menu.login.view,
    //       link: '/login/view'
    //     },
    //   ]
    // },

  ];
}
