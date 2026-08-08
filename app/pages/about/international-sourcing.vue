<template>
  <div class="overflow-hidden bg-base-100" dir="rtl">
    <section class="relative isolate border-b border-base-300 bg-base-200/40">
      <div class="absolute inset-0 -z-10 opacity-70 sourcing-grid" />
      <div class="absolute -left-32 top-8 -z-10 size-96 rounded-full bg-primary/10 blur-3xl" />
      <div class="container mx-auto px-4 py-16 md:py-24 lg:py-28">

        <div class="grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <p class="mb-4 flex items-center gap-2 text-sm font-semibold text-primary">
              <span class="h-px w-8 bg-primary" />{{ page.hero.eyebrow }}
            </p>
            <h1 class="max-w-4xl text-3xl font-black leading-normal text-base-content md:text-5xl md:leading-[1.4]">
              {{ page.hero.title }}
            </h1>
            <p class="mt-6 max-w-3xl text-base leading-9 text-base-content/65 md:text-lg">
              {{ page.hero.summary }}
            </p>
            <div class="mt-9 flex flex-wrap gap-3">
              <NuxtLink to="/contact" class="btn btn-primary gap-2 px-6">
                درخواست مشاوره تأمین <ArrowLeft class="size-4" />
              </NuxtLink>
              <a href="#capabilities" class="btn btn-outline border-base-300 bg-base-100/60 px-6">مشاهده حوزه‌های تأمین</a>
            </div>
          </div>

          <div class="relative mx-auto w-full max-w-md" aria-hidden="true">
            <div class="aspect-square rounded-[2.5rem] border border-primary/15 bg-base-100/80 p-6 shadow-2xl shadow-primary/10 backdrop-blur">
              <div class="grid h-full grid-cols-2 gap-4">
                <div v-for="item in heroCards" :key="item.label" class="flex flex-col justify-center items-center text-center rounded-3xl border border-base-300 bg-base-200/50 p-5 gap-3">
                  <component :is="item.icon" class="size-10 lg:size-18 text-primary" :stroke-width="1.5" />
                  <span class="text-xs lg:text-sm font-bold leading-7">{{ item.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <main>
      <section class="container mx-auto px-4 py-16 md:py-24">
        <div class="mx-auto max-w-5xl border-r-4 border-primary pr-6 md:pr-10">
          <p v-for="paragraph in page.introduction" :key="paragraph" class="mb-5 text-justify text-base leading-9 text-base-content/70 last:mb-0 md:text-lg md:leading-10">
            {{ paragraph }}
          </p>
        </div>
      </section>

      <section id="capabilities" class="border-y border-base-300 bg-base-200/40 py-16 md:py-24">
        <div class="container mx-auto px-4">
          <SectionHeading eyebrow="دامنه خدمات" title="تأمین تجهیزات تخصصی صنعت نفت، گاز و پتروشیمی" description="تأمین تجهیزات و متریال پروژه‌های EPC، تعمیرات اساسی، اورهال، توسعه واحدهای فرآیندی و نیازهای بهره‌برداری صنایع مختلف." />
          <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <article v-for="(item, index) in page.capabilities" :key="item.title" class="group rounded-2xl border border-base-300 bg-base-100 p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
              <div class="flex items-start gap-4">
                <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">{{ toFaDigits(index + 1) }}</span>
                <div><h3 class="font-bold leading-7">{{ item.title }}</h3><p v-if="item.description" class="mt-1 text-sm leading-7 text-base-content/55">{{ item.description }}</p></div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="container mx-auto grid gap-12 px-4 py-16 md:py-24 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
        <div class="relative flex min-h-80 items-center justify-center rounded-4xl bg-primary p-8 text-primary-content">
          <Globe2 class="size-40 opacity-15" :stroke-width="1" />
          <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
            <SearchCheck class="mb-5 size-14" :stroke-width="1.5" />
            <span class="text-2xl font-black">دسترسی به منابع معتبر جهانی</span>
            <span class="mt-3 text-sm opacity-75">ارزیابی فنی و تجاری پیش از خرید</span>
          </div>
        </div>
        <div>
          <SectionHeading :eyebrow="page.specialty.eyebrow" :title="page.specialty.title" />
          <p v-for="paragraph in page.specialty.paragraphs" :key="paragraph" class="mt-5 text-justify leading-9 text-base-content/70">{{ paragraph }}</p>
        </div>
      </section>

      <section class="py-16 md:py-24">
        <div class="mx-auto w-full max-w-[1920px] px-4">
          <div class="relative overflow-hidden rounded-3xl border border-base-300 bg-base-200/40 px-6 py-10 md:px-10 md:py-14">
            <!-- Decorative blurs shared with the home Catalogue section -->
            <div class="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />
            <div class="pointer-events-none absolute -bottom-20 -left-20 size-64 rounded-full bg-primary/5 blur-3xl" />

            <div class="relative">
              <div class="mx-auto max-w-4xl text-center">
                <p class="text-xs font-bold tracking-[.18em] text-primary">{{ page.supplyChain.eyebrow }}</p>
                <h2 class="mt-4 text-3xl font-black leading-[1.65] text-base-content md:text-4xl">{{ page.supplyChain.title }}</h2>
                <div class="mx-auto mt-5 h-1 w-12 rounded-full bg-primary" />
                <p class="mt-5 text-sm leading-8 text-base-content/60">{{ page.supplyChain.description }}</p>
              </div>

              <ol class="process-grid mt-12 grid gap-x-10 gap-y-16 sm:gap-y-10">
                <li v-for="(step, index) in page.supplyChain.steps" :key="step.title"
                  class="group relative aspect-square transition duration-300 hover:-translate-y-1">
                  <div
                    class="process-frame pointer-events-none absolute bottom-0 right-0 top-0 text-primary transition-transform duration-300"
                    :class="frameClasses(index)"
                    aria-hidden="true"
                    v-html="index === page.supplyChain.steps.length - 1 ? noArrowFrame : arrowFrame"
                  />

                  <div class="absolute inset-[3%] z-10 flex flex-col items-center justify-center overflow-hidden rounded-[11%] bg-base-100/75 px-5 py-6 text-center shadow-[0_15px_35px_-20px_color-mix(in_oklab,var(--color-primary)_45%,transparent)] backdrop-blur-sm transition group-hover:bg-base-100">
                    <span class="pointer-events-none absolute left-[8%] top-[8%] select-none text-5xl font-black leading-none text-primary/6 sm:text-6xl">{{ toFaDigits(index + 1) }}</span>
                    <div class="relative z-10 flex size-12 items-center justify-center text-primary">
                      <component :is="supplyChainIcons[index]" class="size-12" :stroke-width="1.65" />
                    </div>
                    <h3 class="relative z-10 mt-4 text-sm font-black leading-7 text-primary">{{ step.title }}</h3>
                    <p class="relative z-10 mt-2 text-xs leading-6 text-base-content/55">{{ step.description }}</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section class="container mx-auto grid gap-12 px-4 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
        <div><SectionHeading :eyebrow="page.quality.eyebrow" :title="page.quality.title" :description="page.quality.description" /></div>
        <div class="grid gap-3 sm:grid-cols-2" dir="ltr">
          <div v-for="document in page.quality.documents" :key="document" class="flex min-h-20 items-center gap-3 rounded-2xl border border-base-300 bg-base-200/40 p-4 text-left transition hover:border-primary/30">
            <FileCheck2 class="size-6 shrink-0 text-primary" /><span class="text-sm font-semibold leading-6">{{ document }}</span>
          </div>
        </div>
      </section>

      <section class="container mx-auto px-4 pb-16 md:pb-24">
        <div class="relative overflow-hidden rounded-4xl border border-primary/20 bg-primary/5 px-6 py-12 text-center md:px-16 md:py-16">
          <ShieldCheck class="mx-auto size-12 text-primary" :stroke-width="1.5" />
          <p class="mt-5 text-sm font-semibold text-primary">{{ page.commitment.eyebrow }}</p>
          <h2 class="mx-auto mt-3 max-w-3xl text-2xl font-black leading-relaxed md:text-4xl">{{ page.commitment.title }}</h2>
          <p class="mx-auto mt-6 max-w-4xl text-justify leading-9 text-base-content/65 md:text-center">{{ page.commitment.description }}</p>
          <NuxtLink to="/contact" class="btn btn-primary mt-8 px-8">گفت‌وگو با کارشناسان هیراد</NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, BadgeCheck, ChevronLeft, FileCheck2, Globe2, Handshake, PackageCheck, PackageSearch, Plane, ScanSearch, SearchCheck, ShieldCheck, Ship, Wrench } from 'lucide-vue-next'
import { internationalSourcingPage as page } from '~/data/internationalSourcing'
import arrowFrame from '~/assets/decorations/supply-chain-with-arrow.svg?raw'
import noArrowFrame from '~/assets/decorations/supply-chain-no-arrow.svg?raw'

const heroCards = [
  { label: 'شبکه تأمین بین‌المللی', icon: Globe2 },
  { label: 'کنترل اصالت و کیفیت', icon: ShieldCheck },
  { label: 'لجستیک و حمل تخصصی', icon: Ship },
  { label: 'تأمین مهندسی‌محور', icon: Wrench },
]

const supplyChainIcons = [PackageSearch, ScanSearch, Handshake, BadgeCheck, Plane, PackageCheck]

const frameClasses = (index: number) => {
  const isLast = index === page.supplyChain.steps.length - 1

  if (isLast) {
    return ['left-0', index % 2 === 1 ? '[transform:scaleY(-1)]' : '']
  }

  return [
    'w-[113.5%] [transform:rotate(-90deg)] [transform-origin:56%_50%]',
    index % 2 === 1 ? 'sm:[transform:scaleY(-1)]' : 'sm:transform-none',
  ]
}

useSeoMeta({
  title: `${page.hero.title} | تجهیز فرآیند هیراد`,
  description: page.hero.summary,
  ogTitle: page.hero.title,
  ogDescription: page.hero.summary,
  ogType: 'website',
})
</script>

<style scoped>
.sourcing-grid { background-image: linear-gradient(to right, color-mix(in oklab, var(--color-base-content) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-base-content) 6%, transparent) 1px, transparent 1px); background-size: 42px 42px; mask-image: linear-gradient(to bottom, black, transparent 92%); }
.process-grid { grid-template-columns: minmax(0, 1fr); }
@media (min-width: 640px) {
  .process-grid { grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); }
}
.process-frame :deep(svg) { width: 100%; height: 100%; overflow: visible; opacity: .52; }
.process-frame :deep(path) { vector-effect: non-scaling-stroke; }
</style>
