<template>
  <section class="container mx-auto px-4 lg:px-0 py-12 md:py-20" dir="rtl">
    <div class="flex flex-col items-center text-center mb-12 md:mb-16">
      <span class="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-3" dir="ltr">
        Hirad Team
      </span>
      <h2 class="text-2xl md:text-3xl font-black text-base-content tracking-tight">تیم هیراد</h2>
      <div class="h-1 w-12 bg-primary mt-4 rounded-full opacity-80" />
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
      <div
        v-for="member in team"
        :key="member.name"
        class="card-lift bg-base-100 border border-base-200 rounded-2xl p-4 flex flex-col items-center text-center gap-3"
      >
        <div class="w-20 h-20 rounded-full overflow-hidden bg-base-200 border-2 border-primary/20">
          <img
            v-if="member.photo_url"
            :src="resolveAssetUrl(member.photo_url)"
            :alt="member.name_fa"
            class="w-full h-full object-cover"
            @error="handleImgError"
          />
          <img 
            v-else 
            src="~/assets/placeholder.png" 
            :alt="member.name_fa"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-sm font-bold text-base-content">{{ member.name_fa }}</span>
          <span class="text-xs text-base-content/50">{{ member.role_fa }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import placeholderImg from '~/assets/placeholder.png'
import { resolveAssetUrl } from '~/utils/resolveAssetUrl'
import type { TeamMember } from '~/composables/useAboutCompany'

defineProps<{
  team: TeamMember[]
}>()

function handleImgError(event: Event) {
  const imgTarget = event.target as HTMLImageElement
  imgTarget.src = placeholderImg
}
</script>