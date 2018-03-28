import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/page/Hello';
import index from '@/components/page/index';
import intro from '@/components/page/intro';
import e404 from '@/components/page/e404';
import sign from '@/components/page/sign';
import register from '@/components/page/register';
import company from '@/components/page/setting/company';
import group from '@/components/page/setting/group';
import talk from '@/components/page/board/talk';
import qna from '@/components/page/board/qna';
import test from '@/components/page/dev/test';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      children: [
        {
          path: '/',
          name: 'intro',
          component: intro,
          meta: {
            title: 'NEMBV introduce',
            breadcrumb: [{
              text: 'Welcome',
              href: '/',
            }],
          },
        },
        {
          path: '/company',
          name: 'company',
          component: company,
          meta: {
            title: '회사 관리',
            breadcrumb: [{
              text: '환경설정 > 회사 관리',
              href: '/',
            }],
          },
        },
        {
          path: '/group',
          name: 'group',
          component: group,
          meta: {
            title: '그룹 관리',
            breadcrumb: [{
              text: '환경설정 > 그룹 관리',
              href: '/',
            }],
          },
        },
        {
          path: '/talk',
          name: 'talk',
          component: talk,
          meta: {
            title: '잡담',
            breadcrumb: [{
              text: '게시판 > 잡담',
              href: '/',
            }],
          },
        },
        {
          path: '/qna',
          name: 'qna',
          component: qna,
          meta: {
            title: 'Q&A',
            breadcrumb: [{
              text: '게시판 > Q&A',
              href: '/',
            }],
          },
        },
        {
          path: '/test',
          name: 'test',
          component: test,
          meta: {
            title: 'test',
            breadcrumb: [{
              text: '개발자 > test',
              href: '/',
            }],
          },
        },
      ],
    },
    {
      path: '/sign',
      name: 'sign',
      component: sign,
    },

    {
      path: '/register',
      name: 'register',
      component: register,
    },
    {
      path: '/hello',
      name: 'Hello',
      component: Hello,
    },
    {
      path: '*',
      name: 'e404',
      component: e404,
    },
  ],
});
