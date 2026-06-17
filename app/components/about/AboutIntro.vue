<template>
  <section class="container mx-auto px-4 lg:px-0 py-12 md:py-20" dir="rtl">
<div class="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-4">

      <div class="card-lift bg-primary/3 border border-primary/10 p-6 md:p-8 flex flex-col h-full gap-5 rounded-t-3xl lg:rounded-none lg:rounded-r-3xl">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shrink-0">
            <CalendarDays class="size-6" />
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-base-content/50 font-bold">سال تأسیس</span>
            <span class="text-base font-medium text-base-content">{{ foundedFa }}</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shrink-0">
            <MapPin class="size-6" />
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-base-content/50 font-bold">مرکز اصلی</span>
            <span class="text-base font-medium text-base-content">{{ headquartersFa }}</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shrink-0">
            <FileBadge class="size-6" />
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-base-content/50 font-bold">شماره ثبت</span>
            <span class="text-base font-medium text-base-content">{{ toFaDigits(registrationNumber) }}</span>
          </div>
        </div>

        <div class="divider my-0"></div>

        <div class="flex flex-col gap-2">
          <span class="text-sm text-base-content/50 font-bold">ماموریت ما</span>
          <p class="text-sm text-base-content/70 text-justify leading-7" style="text-justify: kashida;">{{ missionFa }}</p>
        </div>
      </div>
      <div class="card-lift h-full bg-base-100 border border-base-200 rounded-b-3xl lg:rounded-none lg:rounded-l-3xl p-6 md:p-8">
        <h2 class="text-xl font-bold text-base-content mb-4">درباره شرکت</h2>
        <p class="text-sm md:text-base text-justify text-base-content/70 leading-8 whitespace-pre-line" style="text-justify: kashida;">
          {{ aboutFa }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CalendarDays, MapPin, FileBadge } from 'lucide-vue-next'
import { toFaDigits } from '~/utils/toFaDigits'

defineProps<{
  aboutFa: string
  foundedFa: string
  headquartersFa: string
  missionFa: string
  registrationNumber: string
}>()
</script>