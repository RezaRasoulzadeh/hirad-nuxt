<template>
  <div ref="pageRef" class="resource-page bg-base-100 text-base-content" dir="rtl">
    <section v-if="!compact" class="relative isolate bg-cover bg-center" :style="{ backgroundImage: 'url(' + normalizeLocalAssetUrl(heroBackground) + ')' }"
      aria-labelledby="resource-title">
      <div class="mx-auto max-w-[1720px] px-5 pt-6 md:px-8 lg:px-12">
        <nav :aria-label="resourcesCopy.nav.breadcrumb.fa" class="text-xs text-base-content/60">
          <ol class="flex flex-wrap items-center gap-x-2 gap-y-2 leading-6">
            <li><NuxtLink to="/" class="rounded hover:text-primary focus-visible:outline-primary">{{ resourcesCopy.nav.home.fa }}</NuxtLink></li>
            <li aria-hidden="true"><ChevronLeft class="size-3" /></li>
            <template v-if="section !== 'landing'">
              <li><NuxtLink to="/resources" class="rounded hover:text-primary focus-visible:outline-primary">{{ resourcesCopy.nav.title.fa }}</NuxtLink></li>
              <li aria-hidden="true"><ChevronLeft class="size-3" /></li>
            </template>
            <li aria-current="page" class="text-base-content">{{ section === 'landing' ? resourcesCopy.nav.title.fa : copy.title.fa }}</li>
          </ol>
        </nav>

        <div class="relative py-12 md:py-16">
          <header class="mx-auto min-w-0 max-w-3xl text-center">
            <p data-resource-reveal class="text-xs font-bold tracking-[0.2em] text-primary uppercase" lang="en" dir="ltr">{{ copy.eyebrow.en }}</p>
            <h1 id="resource-title" data-resource-reveal data-resource-delay="70" class="mt-4 text-3xl font-black leading-relaxed tracking-tight md:text-4xl">{{ copy.title.fa }}</h1>
            <span data-resource-reveal data-resource-accent data-resource-delay="140" class="mx-auto mt-4 block h-1 w-12 rounded-full bg-primary/80" aria-hidden="true" />
            <p data-resource-reveal data-resource-delay="180" class="mt-5 text-sm leading-8 text-base-content/65">{{ copy.description.fa }}</p>
            <slot name="actions" />
          </header>
        </div>
      </div>
    </section>

    <nav :aria-label="resourcesCopy.nav.title.fa" class="border-y border-base-300 bg-base-100">
      <div class="mx-auto flex max-w-[1720px] justify-center gap-1 px-3 md:gap-6 md:px-8 lg:px-12">
        <NuxtLink v-for="item in navigation" :key="item.section" :to="item.to"
          :aria-current="section === item.section ? 'page' : undefined"
          class="resource-tab relative -mb-px flex min-h-14 min-w-0 flex-1 items-center justify-center gap-2 border-b-2 border-transparent px-2 py-3 text-center text-xs font-medium transition-colors duration-300 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary sm:flex-none sm:px-4 sm:text-sm"
          :class="section === item.section ? 'text-primary' : 'text-base-content/60'">
          <component :is="item.icon" class="hidden size-4 shrink-0 sm:block" aria-hidden="true" />
          {{ item.label }}
        </NuxtLink>
      </div>
    </nav>

    <div class="mx-auto max-w-[1720px] px-5 py-12 md:px-8 md:py-16 lg:px-12">
      <nav v-if="compact" :aria-label="resourcesCopy.nav.breadcrumb.fa" class="mb-8 text-xs text-base-content/60">
        <ol class="flex flex-wrap items-center gap-x-2 gap-y-2 leading-6">
          <li><NuxtLink to="/" class="rounded hover:text-primary focus-visible:outline-primary">{{ resourcesCopy.nav.home.fa }}</NuxtLink></li>
          <li aria-hidden="true"><ChevronLeft class="size-3" /></li>
          <li><NuxtLink to="/resources" class="rounded hover:text-primary focus-visible:outline-primary">{{ resourcesCopy.nav.title.fa }}</NuxtLink></li>
          <template v-if="breadcrumbParent">
            <li aria-hidden="true"><ChevronLeft class="size-3" /></li>
            <li><NuxtLink :to="breadcrumbParent.to" class="rounded hover:text-primary focus-visible:outline-primary">{{ breadcrumbParent.title }}</NuxtLink></li>
          </template>
          <li aria-hidden="true"><ChevronLeft class="size-3" /></li>
          <li aria-current="page" class="text-base-content">{{ breadcrumbTitle || copy.title.fa }}</li>
        </ol>
      </nav>

      <slot />

      <aside data-resource-reveal class="mt-12 flex flex-col items-center gap-5 rounded-xl border border-base-300 bg-base-200/60 p-6 text-center sm:flex-row sm:text-start md:mt-16 md:p-8">
        <span class="flex size-14 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-base-100 text-primary">
          <Headphones class="size-7" :stroke-width="1.5" aria-hidden="true" />
        </span>
        <div class="min-w-0 flex-1">
          <h2 class="text-lg font-bold leading-8">{{ resourcesCopy.landing.supportTitle.fa }}</h2>
          <p class="mt-1 text-sm leading-7 text-base-content/65">{{ resourcesCopy.landing.supportDescription.fa }}</p>
        </div>
        <NuxtLink to="/contact" class="btn btn-outline btn-primary min-h-11 shrink-0 gap-3 rounded-xl px-6 text-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
          {{ resourcesCopy.landing.contact.fa }}
          <ArrowLeft class="size-4" aria-hidden="true" />
        </NuxtLink>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, BookOpen, ChevronLeft, FileCheck2, Headphones, Wrench } from 'lucide-vue-next'
import heroBackground from '~/assets/hero-background.jpg'
import { resourcesCopy } from '~/data/resources'
import { normalizeLocalAssetUrl } from '~/utils/resolveAssetUrl'

const props = withDefaults(defineProps<{
  section: 'landing' | 'tools' | 'standards'
  compact?: boolean
  breadcrumbParent?: { title: string; to: string }
  breadcrumbTitle?: string
}>(), {
  compact: false,
})
const { compact, breadcrumbParent, breadcrumbTitle } = toRefs(props)
const pageRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | undefined
let motionPreference: MediaQueryList | undefined
const animations = new Set<Animation>()

function stopMotion() {
  observer?.disconnect()
  animations.forEach(animation => animation.cancel())
  animations.clear()
}

function onMotionPreferenceChange(event: MediaQueryListEvent) {
  if (event.matches) stopMotion()
}

function onFocus(event: FocusEvent) {
  // Keyboard focus must never land in a still-fading link or button.
  for (const animation of animations) {
    const target = (animation.effect as KeyframeEffect | null)?.target
    if (target instanceof Element && event.target instanceof Node && target.contains(event.target)) {
      animation.cancel()
    }
  }
}

onMounted(() => {
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  motionPreference.addEventListener('change', onMotionPreferenceChange)
  if (motionPreference.matches || !window.IntersectionObserver || !Element.prototype.animate) return

  observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      observer?.unobserve(entry.target)
      const element = entry.target as HTMLElement
      if (element.contains(document.activeElement)) continue

      const keyframes = element.hasAttribute('data-resource-accent')
        ? { opacity: [0, 1], scale: ['0.35 1', '1 1'] }
        : { opacity: [0, 1], translate: ['0 14px', '0 0'] }
      const animation = element.animate(keyframes, {
        duration: 600,
        delay: Math.min(Number(element.dataset.resourceDelay) || 0, 210),
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'backwards',
      })
      animations.add(animation)
      animation.finished.then(() => animations.delete(animation), () => animations.delete(animation))
    }
  }, { threshold: 0.08 })

  pageRef.value?.querySelectorAll('[data-resource-reveal]').forEach(element => observer?.observe(element))
  pageRef.value?.addEventListener('focusin', onFocus)
})

onBeforeUnmount(() => {
  stopMotion()
  motionPreference?.removeEventListener('change', onMotionPreferenceChange)
  pageRef.value?.removeEventListener('focusin', onFocus)
})

const copy = computed(() => resourcesCopy[props.section])
const navigation = [
  { section: 'landing', to: '/resources', label: resourcesCopy.nav.overview.fa, icon: BookOpen },
  { section: 'tools', to: '/resources/tools', label: resourcesCopy.tools.title.fa, icon: Wrench },
  { section: 'standards', to: '/resources/standards', label: resourcesCopy.nav.standards.fa, icon: FileCheck2 },
]
</script>

<style scoped>
.resource-tab::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  bottom: -2px;
  height: 2px;
  background: var(--color-primary);
  transform: scaleX(0);
  transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

.resource-tab[aria-current='page']::after,
.resource-tab:focus-visible::after {
  transform: scaleX(1);
}

.resource-page :deep(.btn) {
  transition: background-color 250ms ease, color 250ms ease, border-color 250ms ease,
    box-shadow 250ms ease, transform 250ms ease;
}

@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .resource-tab:hover::after {
    transform: scaleX(1);
  }

  .resource-page :deep(.btn:hover) {
    transform: translateY(-2px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .resource-tab,
  .resource-tab::after,
  .resource-page :deep(.btn),
  .resource-page :deep([data-resource-reveal]),
  .resource-page :deep([data-resource-reveal] *) {
    transition: none;
  }
}
</style>
