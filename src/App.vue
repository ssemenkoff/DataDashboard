<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="sidebar">
      <va-sidebar hoverable minimized-width="55px" class="colored-sidebar">
          <va-sidebar-item
              :active="$route.name === 'designer'"
              @click="$router.push('/qweqwe/')"
              class="pointer"
          >
              <va-sidebar-item-content>
                  <va-icon name="preview" />
                  <va-sidebar-item-title>
                      View
                  </va-sidebar-item-title>
              </va-sidebar-item-content>
          </va-sidebar-item>
          <va-sidebar-item
              :active="$route.name === 'dashboard'"
              @click="$router.push('/qweqwe/edit')"
              class="pointer"
          >
              <va-sidebar-item-content>
                  <va-icon name="draw" />
                  <va-sidebar-item-title>
                      Edit
                  </va-sidebar-item-title>
              </va-sidebar-item-content>
          </va-sidebar-item>
          <va-sidebar-item
              :active="$route.name === 'dashboard'"
              @click="$router.push('/qweqwe/data')"
              class="pointer"
          >
              <va-sidebar-item-content>
                  <va-icon name="draw" />
                  <va-sidebar-item-title>
                      Edit
                  </va-sidebar-item-title>
              </va-sidebar-item-content>
          </va-sidebar-item>
          <va-sidebar-item
              :active="$route.name === 'config'"
              @click="$router.push('/configuration')"
              class="pointer"
          >
              <va-sidebar-item-content>
                  <va-icon name="settings" />
                  <va-sidebar-item-title>
                      Configuration
                  </va-sidebar-item-title>
              </va-sidebar-item-content>
          </va-sidebar-item>
      </va-sidebar>
  </div>

  <RouterView />
</template>

<style scoped>
</style>
