<template>
    <div dir="rtl">
        <div v-if="error != null" class="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
            <div class="bg-error/10 rounded-full p-4">
                <WifiOff class="size-8 text-error" />
            </div>
            <p class="font-semibold text-base-content">خطا در بارگذاری گواهی‌ها</p>
            <p class="text-sm text-base-content/50">لطفاً اتصال اینترنت خود را بررسی کنید</p>
            <button class="btn btn-sm btn-error btn-soft" @click="fetchCertificates">تلاش مجدد</button>
        </div>

        <template v-else-if="certificates.length > 0">

            <div class="hidden lg:block relative w-full max-w-[1920px] mx-auto h-[92vh] overflow-hidden select-none"
                @wheel="handleWheel">
                <div class="absolute inset-0 pointer-events-none z-0">
                    <div class="absolute inset-0 bg-primary/5"
                        style="clip-path: polygon(0 0, 42% 0, 64.8% 100%, 0 100%)" />
                    <div class="absolute inset-0 bg-primary/10"
                        style="clip-path: polygon(0 0, 45% 0, 67.8% 100%, 0 100%)" />
                </div>
                <div class="relative z-10 h-full grid grid-cols-2" dir="rtl">

                    <div class="relative flex items-center px-20 py-10 justify-start text-right order-1">
                        <Transition name="cert-text" mode="out-in">
                            <div v-if="textVisible && activeCert != null" :key="activeIndex"
                                class="flex flex-col gap-5 max-w-2xl items-start">
                                <span class="text-xs font-semibold tracking-widest text-primary/50 uppercase">
                                    {{ toFaDigits(activeIndex + 1) }} / {{ toFaDigits(certificates.length) }}
                                </span>

                                <span class="text-sm font-semibold text-primary tracking-wide uppercase" dir="ltr">
                                    {{ activeCert.title }}
                                </span>

                                <h2 class="text-3xl 2xl:text-4xl font-black text-base-content leading-snug">
                                    {{ activeCert.title_fa }}
                                </h2>

                                <div class="w-16 h-0.5 bg-primary/30 rounded-full" />

                                <p class="text-base-content/65 text-sm 2xl:text-base leading-relaxed max-w-lg text-justify"
                                    style="text-justify: kashida;">
                                    {{ activeCert.description_fa }}
                                </p>
                            </div>
                        </Transition>

                        <div class="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 pointer-events-none">
                            <div v-for="(_, i) in certificates" :key="i"
                                class="w-1.5 rounded-full transition-all duration-300" :class="i === activeIndex
                                    ? 'h-7 bg-primary'
                                    : 'h-1.5 bg-base-content/20'" />
                        </div>
                    </div>

                    <div class="flex items-center justify-center py-10 relative order-2">
                        <div class="h-[75vh] w-full relative flex items-center justify-center">
                            <Transition name="cert-image">
                                <div v-if="imageVisible && activeCert != null" :key="activeIndex"
                                    class="absolute inset-0 flex items-center justify-center cert-image-container">
                                    <img :src="resolveAssetUrl(activeCert.image)" :alt="activeCert.title"
                                        class="h-full w-full object-contain" />
                                </div>
                            </Transition>
                        </div>
                    </div>

                </div>

                <Transition name="fade">
                    <div
                        class="hidden xl:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-3 z-30 select-none group">
                        <span
                            class="text-[10px] font-sans font-bold tracking-[0.125em] text-base-content/50 uppercase transition-colors group-hover:text-base-content/70">
                            Scroll
                        </span>
                        <div
                            class="relative w-6 h-10 rounded-3xl border-2 border-base-content/30 flex items-start justify-center pt-2 group-hover:border-base-content/50 transition-colors">
                            <div class="w-1 h-2.5 bg-primary rounded-full animate-scroll-wheel"></div>
                        </div>
                        <ArrowDown
                            class="size-3.5 text-base-content/40 transition-all group-hover:translate-y-0.5 group-hover:text-base-content/60" />
                    </div>
                </Transition>
            </div>

<div class="lg:hidden flex flex-col gap-6 px-4 py-8">
    <div v-for="(cert, i) in certificates" :key="i"
        class="flex flex-col gap-3 rounded-(--radius-box) bg-base-200/50 text-center overflow-hidden">
        
        <div class="w-full">
            <img :src="resolveAssetUrl(cert.image)" :alt="cert.title"
                class="w-full h-auto block" />
        </div>
        
        <div class="flex flex-col gap-2 px-5 pb-5 pt-2">
            <span class="text-xs font-semibold text-primary tracking-wide uppercase" dir="ltr">
                {{ cert.title }}
            </span>
            <h3 class="text-xl font-bold text-base-content">{{ cert.title_fa }}</h3>
            <p class="text-sm text-base-content/65 leading-relaxed">{{ cert.description_fa }}</p>
        </div>
    </div>
</div>

        </template>
    </div>
</template>

<script setup lang="ts">
import { WifiOff, ArrowDown } from 'lucide-vue-next'
import { resolveAssetUrl } from '~/utils/resolveAssetUrl'
import { ref, computed, onMounted, onUnmounted } from 'vue'

const { certificatePage, error, fetchCertificates } = useCertificates()

await fetchCertificates()

useHead({
    title: certificatePage.value?.meta_title ?? 'گواهی‌ها',
    meta: [
        { name: 'description', content: certificatePage.value?.meta_description ?? '' }
    ]
})

const certificates = computed(() => certificatePage.value?.content?.Certificates ?? [])

const activeIndex = ref(0)
const isAnimating = ref(false)
const imageVisible = ref(true)
const textVisible = ref(true)

const TRANSITION_MS = 400
let wheelTimeout: NodeJS.Timeout | null = null

function goTo(index: number) {
    if (isAnimating.value) return
    if (index < 0 || index >= certificates.value.length) return
    isAnimating.value = true
    imageVisible.value = false
    textVisible.value = false
    setTimeout(() => {
        activeIndex.value = index
        imageVisible.value = true
        textVisible.value = true
        isAnimating.value = false
    }, TRANSITION_MS)
}

function handleWheel(e: WheelEvent) {
    if (isAnimating.value) {
        e.preventDefault()
        return
    }

    const isAtEnd = activeIndex.value === certificates.value.length - 1 && e.deltaY > 0
    const isAtStart = activeIndex.value === 0 && e.deltaY < 0

    if (!isAtEnd && !isAtStart) {
        e.preventDefault()

        if (wheelTimeout) return

        if (e.deltaY > 20) {
            goTo(activeIndex.value + 1)
        } else if (e.deltaY < -20) {
            goTo(activeIndex.value - 1)
        }

        wheelTimeout = setTimeout(() => {
            wheelTimeout = null
        }, 100)
    }
}

function handleKey(e: KeyboardEvent) {
    if (isAnimating.value) return
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        if (activeIndex.value < certificates.value.length - 1) {
            e.preventDefault()
            goTo(activeIndex.value + 1)
        }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        if (activeIndex.value > 0) {
            e.preventDefault()
            goTo(activeIndex.value - 1)
        }
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKey)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKey)
    if (wheelTimeout) clearTimeout(wheelTimeout)
})

const activeCert = computed(() => certificates.value[activeIndex.value] ?? null)
</script>

<style scoped>
.cert-image-enter-active,
.cert-image-leave-active {
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.cert-image-enter-from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
}

.cert-image-enter-to {
    opacity: 1;
    transform: scale(1) translateY(0);
}

.cert-image-leave-from {
    opacity: 1;
    transform: scale(1) translateY(0);
}

.cert-image-leave-to {
    opacity: 0;
    transform: scale(1.05) translateY(-10px);
}

.cert-text-enter-active,
.cert-text-leave-active {
    transition: opacity 0.4s ease, transform 0.4s ease;
}

.cert-text-enter-from {
    opacity: 0;
    transform: translateY(15px);
}

.cert-text-enter-to {
    opacity: 1;
    transform: translateY(0);
}

.cert-text-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.cert-text-leave-to {
    opacity: 0;
    transform: translateY(-15px);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@keyframes scroll-wheel {
    0% {
        transform: translateY(0);
        opacity: 0.4;
    }

    50% {
        transform: translateY(12px);
        opacity: 1;
    }

    100% {
        transform: translateY(0);
        opacity: 0.4;
    }
}

.animate-scroll-wheel {
    animation: scroll-wheel 2s infinite ease-in-out;
}
</style>