<template>
  <component :is="item.to ? NuxtLink : 'article'" v-bind="item.to ? { to: item.to } : {}"
    data-resource-reveal
    class="relative flex h-full min-w-0 flex-col rounded-xl border border-base-300 bg-base-100 p-6 text-start"
    :class="item.to ? 'group shadow-sm transition duration-300 ease-out hover:border-primary/25 hover:shadow-md motion-safe:hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary' : ''">
    <span v-if="item.to" class="absolute inset-y-6 start-0 w-0.75 rounded-e-full bg-primary" aria-hidden="true" />
    <div class="flex items-center gap-4">
      <span class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary transition-colors duration-300 group-hover:bg-primary/10">
        <component :is="item.icon" class="size-7" :stroke-width="1.5" aria-hidden="true" />
      </span>
      <div class="min-w-0">
        <h3 class="text-base font-bold leading-7 text-base-content">{{ item.title.fa }}</h3>
        <p class="mt-1 text-xs leading-5 text-base-content/55"><span lang="en" dir="ltr" class="inline-block">{{ item.title.en }}</span></p>
      </div>
    </div>
    <p class="mb-6 mt-5 text-sm leading-8 text-base-content/65">{{ item.description.fa }}</p>
    <div class="mt-auto flex items-center gap-2 border-t border-base-300 pt-4 text-xs">
      <template v-if="item.to">
        <span class="font-bold text-primary">{{ resourcesCopy.card.open.fa }}</span>
        <ArrowLeft class="ms-auto size-4 text-primary transition-transform motion-safe:group-hover:-translate-x-1" aria-hidden="true" />
      </template>
      <template v-else>
        <Clock3 class="size-3.5 text-base-content/50" aria-hidden="true" />
        <span class="text-base-content/60">{{ item.status?.fa || resourcesCopy.card.upcoming.fa }}</span>
      </template>
    </div>
  </component>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'
import { ArrowLeft, Clock3 } from 'lucide-vue-next'
import { resourcesCopy, type ResourceCardDefinition } from '~/data/resources'

defineProps<{ item: ResourceCardDefinition }>()
</script>
