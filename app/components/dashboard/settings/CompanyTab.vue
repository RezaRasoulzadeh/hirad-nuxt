<template>
  <form v-if="modelValue" @submit.prevent="handleSave">
    <div class="space-y-6">
      
      <!-- 1. Base Info Accordion -->
      <div class="collapse collapse-arrow border border-base-300 bg-base-200/40 rounded-xl">
        <input type="checkbox" checked />
        <div class="collapse-title font-bold text-sm">اطلاعات پایه و خلاصه‌ها</div>
        <div class="collapse-content space-y-4 bg-base-100 pt-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control w-full">
              <label class="label font-bold text-xs text-base-content/70">Company Title</label>
              <input v-model="modelValue.title" type="text" class="input input-bordered w-full" />
            </div>
            <div class="form-control w-full">
              <label class="label font-bold text-xs text-base-content/70">Slug</label>
              <input v-model="modelValue.slug" type="text" class="input input-bordered w-full" disabled />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control w-full">
              <label class="label font-bold text-xs text-base-content/70">Summary (EN)</label>
              <textarea v-model="modelValue.summary" class="textarea textarea-bordered w-full h-16 resize-none"></textarea>
            </div>
            <div class="form-control w-full">
              <label class="label font-bold text-xs text-base-content/70">Summary (FA)</label>
              <textarea v-model="modelValue.content.summary_fa" class="textarea textarea-bordered w-full h-16 resize-none"></textarea>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control w-full">
              <label class="label font-bold text-xs text-base-content/70">About Company Content (EN)</label>
              <textarea v-model="modelValue.content.about" class="textarea textarea-bordered w-full h-24 resize-none"></textarea>
            </div>
            <div class="form-control w-full">
              <label class="label font-bold text-xs text-base-content/70">About Company Content (FA)</label>
              <textarea v-model="modelValue.content.about_fa" class="textarea textarea-bordered w-full h-24 resize-none"></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Intro & Mission Accordion -->
      <div class="collapse collapse-arrow border border-base-300 bg-base-200/40 rounded-xl">
        <input type="checkbox" />
        <div class="collapse-title font-bold text-sm">بخش Intro و ماموریت شرکت</div>
        <div class="collapse-content space-y-4 bg-base-100 pt-4" v-if="modelValue.content?.intro">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input v-model.number="modelValue.content.intro.founded" type="number" placeholder="Founded Year" class="input input-bordered w-full" />
            <input v-model="modelValue.content.intro.founded_fa" type="text" placeholder="سال تاسیس" class="input input-bordered w-full" />
            <input v-model="modelValue.content.intro.registration_number" type="text" placeholder="شماره ثبت" class="input input-bordered w-full" />
            <input v-model="modelValue.content.intro.headquarters" type="text" placeholder="Headquarters" class="input input-bordered w-full" />
          </div>
          <input v-model="modelValue.content.intro.headquarters_fa" type="text" placeholder="دفتر مرکزی" class="input input-bordered w-full" />
          <textarea v-model="modelValue.content.intro.mission" placeholder="Mission (EN)" class="textarea textarea-bordered w-full h-16 resize-none"></textarea>
          <textarea v-model="modelValue.content.intro.mission_fa" placeholder="ماموریت (FA)" class="textarea textarea-bordered w-full h-16 resize-none"></textarea>
        </div>
      </div>

      <!-- 3. Stats Accordion -->
      <div class="collapse collapse-arrow border border-base-300 bg-base-200/40 rounded-xl">
        <input type="checkbox" />
        <div class="collapse-title font-bold text-sm">آمار و ارقام (Stats)</div>
        <div class="collapse-content space-y-6 bg-base-100 pt-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-xs font-bold mb-2 text-base-content/70">Stats (FA)</h4>
              <div v-for="(stat, idx) in localStatsFa" :key="'stat-fa-'+idx" class="flex gap-2 mb-2 items-center w-full">
                <input v-model="stat.label" type="text" placeholder="برچسب" class="input input-bordered input-sm grow" />
                <input v-model="stat.value" type="text" placeholder="مقدار" class="input input-bordered input-sm grow" />
                <button type="button" @click="localStatsFa.splice(idx, 1)" class="btn btn-ghost btn-sm text-error"><Trash2 class="w-4 h-4" /></button>
              </div>
              <button type="button" @click="localStatsFa.push({ label: '', value: '' })" class="btn btn-outline btn-dashed btn-xs btn-block"><PlusCircle class="w-3 h-3 ml-1" />افزودن آمار فارسی</button>
            </div>
            <div>
              <h4 class="text-xs font-bold mb-2 text-base-content/70">Stats (EN)</h4>
              <div v-for="(stat, idx) in localStatsEn" :key="'stat-en-'+idx" class="flex gap-2 mb-2 items-center w-full">
                <input v-model="stat.label" type="text" placeholder="Label" class="input input-bordered input-sm grow" />
                <input v-model="stat.value" type="text" placeholder="Value" class="input input-bordered input-sm grow" />
                <button type="button" @click="localStatsEn.splice(idx, 1)" class="btn btn-ghost btn-sm text-error"><Trash2 class="w-4 h-4" /></button>
              </div>
              <button type="button" @click="localStatsEn.push({ label: '', value: '' })" class="btn btn-outline btn-dashed btn-xs btn-block"><PlusCircle class="w-3 h-3 ml-1" />Add English Stat</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. History Timeline Accordion -->
      <div class="collapse collapse-arrow border border-base-300 bg-base-200/40 rounded-xl">
        <input type="checkbox" />
        <div class="collapse-title font-bold text-sm">تاریخچه شرکت (History Timeline)</div>
        <div class="collapse-content space-y-4 bg-base-100 pt-4">
          <div v-for="(hist, idx) in modelValue.content.history || []" :key="'hist-' + idx" class="collapse collapse-arrow border border-base-200 bg-base-200/30 rounded-xl">
            <input type="checkbox" />
            <div class="collapse-title flex items-center justify-between font-medium text-xs">
              <span>{{ hist.year_fa || hist.year || 'سال بدون نام' }}</span>
              <button type="button" @click.stop="modelValue.content.history.splice(idx, 1)" class="btn btn-ghost btn-xs text-error"><Trash2 class="w-4 h-4" /></button>
            </div>
            <div class="collapse-content space-y-4 bg-base-100 pt-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model.number="hist.year" type="number" placeholder="Year (Numeric)" class="input input-bordered w-full" />
                <input v-model="hist.year_fa" type="text" placeholder="سال (فارسی)" class="input input-bordered w-full" />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea v-model="hist.description" placeholder="Description (EN)" class="textarea textarea-bordered w-full h-16 resize-none"></textarea>
                <textarea v-model="hist.description_fa" placeholder="توضیحات (FA)" class="textarea textarea-bordered w-full h-16 resize-none"></textarea>
              </div>
            </div>
          </div>
          <button type="button" @click="modelValue.content.history.push({ year: 2026, year_fa: '', description: '', description_fa: '' })" class="btn btn-outline btn-dashed btn-success btn-block">
            <PlusCircle class="w-4 h-4 ml-2" /> افزودن رویداد تاریخی
          </button>
        </div>
      </div>

      <!-- 5. Map Points Accordion -->
      <div class="collapse collapse-arrow border border-base-300 bg-base-200/40 rounded-xl">
        <input type="checkbox" />
        <div class="collapse-title font-bold text-sm">نقاط روی نقشه (Map Points)</div>
        <div class="collapse-content space-y-4 bg-base-100 pt-4">
          <div v-for="(point, idx) in modelValue.content.map || []" :key="'map-' + idx" class="collapse collapse-arrow border border-base-200 bg-base-200/30 rounded-xl">
            <input type="checkbox" />
            <div class="collapse-title flex items-center justify-between font-medium text-xs">
              <span>{{ point.name_fa || point.name || 'مکان جدید' }}</span>
              <button type="button" @click.stop="modelValue.content.map.splice(idx, 1)" class="btn btn-ghost btn-xs text-error"><Trash2 class="w-4 h-4" /></button>
            </div>
            <div class="collapse-content space-y-4 bg-base-100 pt-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="point.name" type="text" placeholder="Location Name (EN)" class="input input-bordered w-full" />
                <input v-model="point.name_fa" type="text" placeholder="نام مکان (FA)" class="input input-bordered w-full" />
              </div>
              <input v-model="point.location" type="text" placeholder="Address Context Line" class="input input-bordered w-full" />
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model.number="point.x" type="number" step="any" placeholder="Coordinate Latitude (X)" class="input input-bordered w-full" />
                <input v-model.number="point.y" type="number" step="any" placeholder="Coordinate Longitude (Y)" class="input input-bordered w-full" />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea v-model="point.description" placeholder="Description (EN)" class="textarea textarea-bordered w-full h-16 resize-none"></textarea>
                <textarea v-model="point.description_fa" placeholder="توضیحات (FA)" class="textarea textarea-bordered w-full h-16 resize-none"></textarea>
              </div>
            </div>
          </div>
          <button type="button" @click="modelValue.content.map.push({ name: '', name_fa: '', location: '', description: '', description_fa: '', x: 0, y: 0 })" class="btn btn-outline btn-dashed btn-success btn-block">
            <PlusCircle class="w-4 h-4 ml-2" /> افزودن نقطه روی نقشه
          </button>
        </div>
      </div>

      <!-- 6. Team Members Accordion -->
      <div class="collapse collapse-arrow border border-base-300 bg-base-200/40 rounded-xl">
        <input type="checkbox" />
        <div class="collapse-title font-bold text-sm">تیم ما (Team Members)</div>
        <div class="collapse-content space-y-4 bg-base-100 pt-4">
          <div v-for="(member, idx) in modelValue.content.team || []" :key="'team-' + idx" class="collapse collapse-arrow border border-base-200 bg-base-200/30 rounded-xl">
            <input type="checkbox" />
            <div class="collapse-title flex items-center justify-between font-medium text-xs">
              <span>{{ member.name_fa || member.name || 'عضو بدون نام' }}</span>
              <button type="button" @click.stop="modelValue.content.team.splice(idx, 1)" class="btn btn-ghost btn-xs text-error"><Trash2 class="w-4 h-4" /></button>
            </div>
            <div class="collapse-content flex flex-col gap-4 bg-base-100 pt-4 lg:flex-row lg:items-start">
              <AssetPickerField v-model="member.photo_url" label="تصویر عضو تیم"
                class="w-full lg:w-64 lg:shrink-0" @select="$emit('select-media', idx, 'team')" />
              <div class="grid min-w-0 grow grid-cols-1 gap-4 md:grid-cols-2">
                <input v-model="member.name" type="text" placeholder="Name" dir="ltr" class="input input-bordered w-full" />
                <input v-model="member.name_fa" type="text" placeholder="نام" class="input input-bordered w-full" />
                <input v-model="member.role" type="text" placeholder="Role" dir="ltr" class="input input-bordered w-full" />
                <input v-model="member.role_fa" type="text" placeholder="نقش" class="input input-bordered w-full" />
              </div>
            </div>
          </div>
          <button type="button" @click="addTeamMember" class="btn btn-outline btn-dashed btn-success btn-block">
            <PlusCircle class="w-4 h-4 mr-2" /> افزودن عضو جدید
          </button>
        </div>
      </div>

      <button type="submit" class="btn btn-primary btn-block mt-6">ذخیره تغییرات اطلاعات شرکت</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Trash2, PlusCircle } from 'lucide-vue-next'
import AssetPickerField from './AssetPickerField.vue'

const props = defineProps<{ modelValue: any }>()
const emit = defineEmits(['save', 'select-media'])

interface LocalStat {
  label: string
  value: string
}

const localStatsFa = ref<LocalStat[]>([])
const localStatsEn = ref<LocalStat[]>([])

const parseIncomingStats = (rawArray: any[]): LocalStat[] => {
  if (!Array.isArray(rawArray)) return []
  return rawArray.map(obj => {
    const entries = Object.entries(obj)
    const first = entries[0]
    if (first) {
      const [key, val] = first
      return { label: key || '', value: String(val ?? '') }
    }
    return { label: '', value: '' }
  })
}

// Watch model initialization to build local editable lists
watch(() => props.modelValue, (newVal) => {
  if (newVal?.content?.stats) {
    localStatsFa.value = parseIncomingStats(newVal.content.stats.fa)
    localStatsEn.value = parseIncomingStats(newVal.content.stats.en)
  }
}, { immediate: true, deep: true })

const addTeamMember = () => {
  if (!props.modelValue.content) props.modelValue.content = {}
  if (!props.modelValue.content.team) props.modelValue.content.team = []
  props.modelValue.content.team.push({ name: '', name_fa: '', role: '', role_fa: '', photo_url: '' })
}

const handleSave = () => {
  if (!props.modelValue.content) props.modelValue.content = {}
  if (!props.modelValue.content.stats) props.modelValue.content.stats = { fa: [], en: [] }

  props.modelValue.content.stats.fa = localStatsFa.value
    .filter(s => s.label.trim())
    .map(s => ({ [s.label]: s.value }))

  props.modelValue.content.stats.en = localStatsEn.value
    .filter(s => s.label.trim())
    .map(s => ({ [s.label]: s.value }))

  emit('save')
}
</script>
