<script setup lang="ts">
const glob = import.meta.glob('~/assets/icons/*.png', { 
  eager: true, 
  import: 'default' 
}) as Record<string, string>

interface PromiseItem {
  title: string
  description: string
  filename: string
}

const items: PromiseItem[] = [
  {
    title: 'متعهد',
    description: 'تعهد برای ما اعتماد می‌آفریند. ما همواره به قول خود پایبندیم و باور داریم که تمامی مشتریان و همکاران می‌توانند روی ما حساب کنند.',
    filename: 'commitment.png'
  },
  {
    title: 'انگیزه‌مند',
    description: 'ما همیشه در تلاشیم تا بهترین راه‌حل‌ها را برای مشتریان خود بیابیم. هدف نهایی ما رضایت کامل آن‌هاست و این بزرگترین انگیزه ماست.',
    filename: 'motivation.png'
  },
  {
    title: 'با‌ صلاحیت',
    description: 'دانش تخصصی در حوزه‌های فنی و بازرگانی، پایه‌ای استوار برای توسعه و ارائه راه‌حل‌هایی دقیقاً مطابق با نیازهای واقعی مشتریان ماست.',
    filename: 'skill.png'
  },
  {
    title: 'منعطف',
    description: 'ما به دستورالعمل‌های خشک پایبند نیستیم. تمرکز اصلی ما بر خواسته‌های فردی مشتریان است و آن‌ها را به فرآیندهای داخلی ترجیح می‌دهیم.',
    filename: 'flexibility.png'
  }
]

const resolveAsset = (filename: string): string => {
  return glob[`/assets/icons/${filename}`] || ''
}
</script>

<template>
  <section class="container w-full mx-auto px-6 py-8 md:py-16" dir="rtl">
    <div class="flex flex-col items-center text-center mb-10 px-4">
      <span class="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-3">
        Brand Promise
      </span>
      <h2 class="text-base-content text-3xl md:text-3xl font-black tracking-tight">
        تعهد هیراد
      </h2>
      <div class="bg-primary h-1 w-12 mt-4 rounded-full opacity-80" />
      <p class="text-base-content/70 mx-auto text-sm leading-relaxed mt-4">
        چشم‌انداز این شرکت تبدیل شدن به همکاری مورد اعتماد برای تولید کنندگان و تامین کننده‌ای مطمئن برای مشتریان می باشد.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
      <div 
        v-for="(item, index) in items" 
        :key="index"
        class="flex flex-col items-center text-center group"
      >
        <div class="mb-6 p-4 bg-base-200 rounded-2xl group-hover:scale-105 transition-transform duration-300">
          <img 
            :src="resolveAsset(item.filename)" 
            :alt="item.title"
            width="48"
            height="48"
            class="w-12 h-12 object-contain block"
            loading="lazy"
          />
        </div>
        
        <h3 class="text-xl font-bold text-base-content mb-3">
          {{ item.title }}
        </h3>
        
        <p class="text-base-content/80 text-sm leading-relaxed font-normal max-w-sm">
          {{ item.description }}
        </p>
      </div>
    </div>
  </section>
</template>