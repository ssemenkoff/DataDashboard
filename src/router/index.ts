import { createRouter, createWebHistory } from 'vue-router'

import ReportView from '@/pages/ReportView.vue'
import EditReport from '@/pages/EditReport.vue'
import DataDesigner from '@/pages/DataDesigner.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:id',
      name: 'home',
      component: ReportView
    },
    {
      path: '/:id/edit',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: EditReport
    },
    {
      path: '/:id/data',
      name: 'data',
      component: DataDesigner
    }
  ]
})

export default router
